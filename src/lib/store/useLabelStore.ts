'use client';

import { useState, useEffect } from 'react';
import {
  Space, Service, BookingOption, Equipment, Booking, BookingStatus, Rental,
  Transaction, Inventory, AuditLogEntry, SettingsConfig, UserRole
} from '../types';
import {
  INITIAL_SPACES, INITIAL_SERVICES, INITIAL_OPTIONS, INITIAL_EQUIPMENT,
  INITIAL_BOOKINGS, INITIAL_RENTALS, INITIAL_TRANSACTIONS, INITIAL_SETTINGS,
  INITIAL_AUDIT_LOGS
} from './initialData';
import { isSlotAllowedForNoise } from '../utils/noiseCheck';

const STORAGE_KEY = 'seven_truth_db_v1';

export interface DBState {
  spaces: Space[];
  services: Service[];
  options: BookingOption[];
  equipment: Equipment[];
  bookings: Booking[];
  rentals: Rental[];
  transactions: Transaction[];
  inventories: Inventory[];
  auditLogs: AuditLogEntry[];
  settings: SettingsConfig;
  currentRole: UserRole;
  currentUserName: string;
}

const getInitialDB = (): DBState => {
  if (typeof window === 'undefined') {
    return {
      spaces: INITIAL_SPACES,
      services: INITIAL_SERVICES,
      options: INITIAL_OPTIONS,
      equipment: INITIAL_EQUIPMENT,
      bookings: INITIAL_BOOKINGS,
      rentals: INITIAL_RENTALS,
      transactions: INITIAL_TRANSACTIONS,
      inventories: [],
      auditLogs: INITIAL_AUDIT_LOGS,
      settings: INITIAL_SETTINGS,
      currentRole: 'admin',
      currentUserName: 'Modou Fall (Admin)'
    };
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to read localStorage:', e);
  }

  return {
    spaces: INITIAL_SPACES,
    services: INITIAL_SERVICES,
    options: INITIAL_OPTIONS,
    equipment: INITIAL_EQUIPMENT,
    bookings: INITIAL_BOOKINGS,
    rentals: INITIAL_RENTALS,
    transactions: INITIAL_TRANSACTIONS,
    inventories: [],
    auditLogs: INITIAL_AUDIT_LOGS,
    settings: INITIAL_SETTINGS,
    currentRole: 'admin',
    currentUserName: 'Modou Fall (Admin)'
  };
};

let globalState = getInitialDB();
const listeners = new Set<() => void>();

function notify() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(globalState));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }
  listeners.forEach(fn => fn());
}

export function useLabelStore() {
  const [state, setState] = useState<DBState>(globalState);

  useEffect(() => {
    const handleUpdate = () => setState({ ...globalState });
    listeners.add(handleUpdate);
    return () => {
      listeners.delete(handleUpdate);
    };
  }, []);

  // Helper pour journal d'audit append-only
  const logAudit = (action: 'INSERT' | 'UPDATE' | 'DELETE', tableName: string, recordId: string, oldData?: any, newData?: any) => {
    const newEntry: AuditLogEntry = {
      id: (globalState.auditLogs.length > 0 ? Math.max(...globalState.auditLogs.map(a => a.id)) : 0) + 1,
      timestamp: new Date().toISOString(),
      user_name: globalState.currentUserName,
      user_role: globalState.currentRole,
      action,
      table_name: tableName,
      record_id: recordId,
      old_data: oldData,
      new_data: newData
    };

    globalState = {
      ...globalState,
      auditLogs: [newEntry, ...globalState.auditLogs]
    };
  };

  // Change rôle utilisateur (Admin, Patron [lecture seule], Staff, Client)
  const setCurrentRole = (role: UserRole) => {
    let name = 'Visiteur';
    if (role === 'admin') name = 'Modou Fall (Admin & Gérant)';
    if (role === 'patron') name = 'Cheikh Diop (Le Patron / Investisseur)';
    if (role === 'staff') name = 'Awa Ndiaye (Ingénieure / Staff)';
    if (role === 'client') name = 'Client En Ligne';

    globalState = {
      ...globalState,
      currentRole: role,
      currentUserName: name
    };
    notify();
  };

  // 1. GESTION DES RÉSERVATIONS
  const addBooking = (newBookingData: Omit<Booking, 'id' | 'booking_number' | 'created_at'>): { success: boolean; booking?: Booking; error?: string } => {
    // Vérification de la règle de bruit pour services bruyants
    if (newBookingData.is_noisy) {
      const noiseCheck = isSlotAllowedForNoise(
        newBookingData.start_time,
        newBookingData.end_time,
        globalState.settings.noise_regulations
      );
      if (!noiseCheck.allowed) {
        return { success: false, error: noiseCheck.reason };
      }
    }

    // Vérification stricte anti-doublon (exclusion GiST simulée)
    const newStart = new Date(newBookingData.start_time).getTime();
    const newEnd = new Date(newBookingData.end_time).getTime();

    const hasConflict = globalState.bookings.some(b => {
      if (b.status === 'annulee') return false;
      if (b.space_id !== newBookingData.space_id) return false;
      const bStart = new Date(b.start_time).getTime();
      const bEnd = new Date(b.end_time).getTime();
      // Chevauchement
      return (newStart < bEnd && newEnd > bStart);
    });

    if (hasConflict) {
      return { success: false, error: "Ce créneau horaire est déjà réservé pour cet espace. Veuillez sélectionner une autre heure." };
    }

    const count = globalState.bookings.length + 1;
    const bookingNumber = `7T-BK-${new Date().getFullYear()}-${count.toString().padStart(3, '0')}`;
    const id = `bk-${Date.now()}`;

    const createdBooking: Booking = {
      ...newBookingData,
      id,
      booking_number: bookingNumber,
      created_at: new Date().toISOString()
    };

    globalState = {
      ...globalState,
      bookings: [createdBooking, ...globalState.bookings]
    };

    logAudit('INSERT', 'bookings', id, null, createdBooking);

    // Si un acompte est payé immédiatement, enregistrer une transaction financière d'entrée
    if (createdBooking.paid_amount > 0) {
      const txId = `tx-${Date.now()}`;
      const newTx: Transaction = {
        id: txId,
        date: new Date().toISOString().split('T')[0],
        type: 'entree',
        category: 'prestations',
        amount: createdBooking.paid_amount,
        description: `Acompte réservation ${bookingNumber} - ${createdBooking.client_name}`,
        payment_method: 'wave',
        created_by_name: globalState.currentUserName,
        created_at: new Date().toISOString()
      };
      globalState = {
        ...globalState,
        transactions: [newTx, ...globalState.transactions]
      };
      logAudit('INSERT', 'transactions', txId, null, newTx);
    }

    notify();
    return { success: true, booking: createdBooking };
  };

  const updateBookingStatus = (id: string, newStatus: BookingStatus, paidAmount?: number) => {
    const existing = globalState.bookings.find(b => b.id === id);
    if (!existing) return;

    const updated = {
      ...existing,
      status: newStatus,
      paid_amount: paidAmount !== undefined ? paidAmount : existing.paid_amount
    };

    globalState = {
      ...globalState,
      bookings: globalState.bookings.map(b => b.id === id ? updated : b)
    };

    logAudit('UPDATE', 'bookings', id, existing, updated);
    notify();
  };

  // 2. GESTION DU MATÉRIEL ET DES LOCATIONS
  const addEquipment = (item: Omit<Equipment, 'id' | 'created_at'>) => {
    const count = globalState.equipment.length + 1;
    const id = `EQ-${item.category.slice(0, 3).toUpperCase()}-${count.toString().padStart(2, '0')}`;
    const newItem: Equipment = {
      ...item,
      id,
      qr_code_data: `7T-${id}`,
      created_at: new Date().toISOString()
    };

    globalState = {
      ...globalState,
      equipment: [...globalState.equipment, newItem]
    };

    logAudit('INSERT', 'equipment', id, null, newItem);
    notify();
  };

  const updateEquipment = (id: string, updates: Partial<Equipment>) => {
    const existing = globalState.equipment.find(e => e.id === id);
    if (!existing) return;

    const updated = { ...existing, ...updates };
    globalState = {
      ...globalState,
      equipment: globalState.equipment.map(e => e.id === id ? updated : e)
    };

    logAudit('UPDATE', 'equipment', id, existing, updated);
    notify();
  };

  const addRental = (rentalData: Omit<Rental, 'id' | 'rental_number' | 'created_at'>): { success: boolean; rental?: Rental; error?: string } => {
    // Vérifier la disponibilité de l'équipement
    const eq = globalState.equipment.find(e => e.id === rentalData.equipment_id);
    if (!eq) return { success: false, error: "Équipement non trouvé." };
    if (eq.available_quantity < rentalData.quantity) {
      return { success: false, error: `Quantité insuffisante (${eq.available_quantity} disponible(s)).` };
    }

    const count = globalState.rentals.length + 1;
    const rentalNumber = `7T-LOC-${new Date().getFullYear()}-${count.toString().padStart(2, '0')}`;
    const id = `rent-${Date.now()}`;

    const newRental: Rental = {
      ...rentalData,
      id,
      rental_number: rentalNumber,
      equipment_name: eq.name,
      created_at: new Date().toISOString()
    };

    // Mettre à jour la quantité disponible
    const updatedEq = {
      ...eq,
      available_quantity: eq.available_quantity - rentalData.quantity
    };

    globalState = {
      ...globalState,
      rentals: [newRental, ...globalState.rentals],
      equipment: globalState.equipment.map(e => e.id === eq.id ? updatedEq : e)
    };

    logAudit('INSERT', 'rentals', id, null, newRental);
    logAudit('UPDATE', 'equipment', eq.id, eq, updatedEq);

    // Enregistrer le paiement de la location
    const txId = `tx-${Date.now()}`;
    const newTx: Transaction = {
      id: txId,
      date: new Date().toISOString().split('T')[0],
      type: 'entree',
      category: 'materiel',
      amount: newRental.total_price,
      description: `Location ${rentalNumber} (${eq.name}) - ${newRental.client_name}`,
      payment_method: 'wave',
      created_by_name: globalState.currentUserName,
      created_at: new Date().toISOString()
    };

    globalState = {
      ...globalState,
      transactions: [newTx, ...globalState.transactions]
    };
    logAudit('INSERT', 'transactions', txId, null, newTx);

    notify();
    return { success: true, rental: newRental };
  };

  const returnRental = (id: string, returnData: {
    condition_in: string;
    photos_in: string[];
    deposit_deduction: number;
    deduction_reason?: string;
  }) => {
    const existing = globalState.rentals.find(r => r.id === id);
    if (!existing) return;

    const eq = globalState.equipment.find(e => e.id === existing.equipment_id);

    const updatedRental: Rental = {
      ...existing,
      status: 'retourne',
      condition_in: returnData.condition_in,
      photos_in: returnData.photos_in,
      deposit_deduction: returnData.deposit_deduction,
      deduction_reason: returnData.deduction_reason
    };

    let updatedEquipmentList = globalState.equipment;
    if (eq) {
      const updatedEq = {
        ...eq,
        available_quantity: eq.available_quantity + existing.quantity
      };
      updatedEquipmentList = globalState.equipment.map(e => e.id === eq.id ? updatedEq : e);
      logAudit('UPDATE', 'equipment', eq.id, eq, updatedEq);
    }

    // Si retenue sur caution, enregistrer comme entrée maintenance
    if (returnData.deposit_deduction > 0) {
      const txId = `tx-${Date.now()}`;
      const deductionTx: Transaction = {
        id: txId,
        date: new Date().toISOString().split('T')[0],
        type: 'entree',
        category: 'maintenance',
        amount: returnData.deposit_deduction,
        description: `Retenue caution ${existing.rental_number}: ${returnData.deduction_reason || 'Dommages ou retard'}`,
        payment_method: 'especes',
        created_by_name: globalState.currentUserName,
        created_at: new Date().toISOString()
      };
      globalState = {
        ...globalState,
        transactions: [deductionTx, ...globalState.transactions]
      };
      logAudit('INSERT', 'transactions', txId, null, deductionTx);
    }

    globalState = {
      ...globalState,
      rentals: globalState.rentals.map(r => r.id === id ? updatedRental : r),
      equipment: updatedEquipmentList
    };

    logAudit('UPDATE', 'rentals', id, existing, updatedRental);
    notify();
  };

  // 3. GESTION DES FINANCES (RÈGLE OBLIGATOIRE REÇU PHOTO POUR SORTIE)
  const addTransaction = (txData: Omit<Transaction, 'id' | 'created_at'>): { success: boolean; error?: string } => {
    if (txData.type === 'sortie' && (!txData.receipt_photo_url || txData.receipt_photo_url.trim().length === 0)) {
      return {
        success: false,
        error: "RÈGLE STRICTE : La photo du reçu de paiement est obligatoire pour toute sortie d'argent."
      };
    }

    const id = `tx-${Date.now()}`;
    const newTx: Transaction = {
      ...txData,
      id,
      created_at: new Date().toISOString()
    };

    globalState = {
      ...globalState,
      transactions: [newTx, ...globalState.transactions]
    };

    logAudit('INSERT', 'transactions', id, null, newTx);
    notify();
    return { success: true };
  };

  // 4. INVENTAIRE MENSUEL
  const saveInventory = (inventoryData: Omit<Inventory, 'id' | 'created_at'>) => {
    const id = `inv-${Date.now()}`;
    const newInv: Inventory = {
      ...inventoryData,
      id,
      created_at: new Date().toISOString()
    };

    globalState = {
      ...globalState,
      inventories: [newInv, ...globalState.inventories]
    };

    logAudit('INSERT', 'inventories', id, null, newInv);
    notify();
  };

  // 5. MISE À JOUR DES PARAMÈTRES
  const updateSettings = (newSettings: Partial<SettingsConfig>) => {
    const oldSettings = globalState.settings;
    globalState = {
      ...globalState,
      settings: { ...globalState.settings, ...newSettings }
    };

    logAudit('UPDATE', 'settings', 'global', oldSettings, globalState.settings);
    notify();
  };

  // Calculateur de répartition de fin de mois selon la règle imposée :
  // Charges fixes d'abord, puis 10% réserve matériel, puis reste partagé 50% équipe / 30% patron / 20% réinvestissement
  const calculateFinancialBreakdown = () => {
    const totalIncomes = globalState.transactions
      .filter(t => t.type === 'entree')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = globalState.transactions
      .filter(t => t.type === 'sortie')
      .reduce((sum, t) => sum + t.amount, 0);

    const fixedChargesExpenses = globalState.transactions
      .filter(t => t.type === 'sortie' && t.is_fixed_charge)
      .reduce((sum, t) => sum + t.amount, 0);

    const fixedTarget = globalState.settings.financial_rules.monthly_fixed_charges_target; // 300 000 FCFA
    const fixedChargesCovered = Math.min(totalIncomes, fixedTarget);
    const fixedChargesProgress = Math.min(100, Math.round((totalIncomes / fixedTarget) * 100));

    // Bénéfice brut après toutes les dépenses
    const netProfit = Math.max(0, totalIncomes - totalExpenses);

    // Réserve matériel de 10%
    const reserve10Pct = Math.round(netProfit * (globalState.settings.financial_rules.equipment_reserve_pct / 100));
    
    // Bénéfice distribuable
    const distributable = Math.max(0, netProfit - reserve10Pct);

    // Partage : 50% équipe / 30% patron / 20% réinvestissement
    const teamShare = Math.round(distributable * (globalState.settings.financial_rules.team_split_pct / 100));
    const patronShare = Math.round(distributable * (globalState.settings.financial_rules.patron_split_pct / 100));
    const reinvestmentShare = Math.round(distributable * (globalState.settings.financial_rules.reinvestment_pct / 100));

    return {
      totalIncomes,
      totalExpenses,
      fixedChargesExpenses,
      fixedTarget,
      fixedChargesCovered,
      fixedChargesProgress,
      netProfit,
      reserve10Pct,
      distributable,
      teamShare,
      patronShare,
      reinvestmentShare
    };
  };

  // Réinitialiser les données au seed initial
  const resetToSeed = () => {
    globalState = {
      spaces: INITIAL_SPACES,
      services: INITIAL_SERVICES,
      options: INITIAL_OPTIONS,
      equipment: INITIAL_EQUIPMENT,
      bookings: INITIAL_BOOKINGS,
      rentals: INITIAL_RENTALS,
      transactions: INITIAL_TRANSACTIONS,
      inventories: [],
      auditLogs: INITIAL_AUDIT_LOGS,
      settings: INITIAL_SETTINGS,
      currentRole: 'admin',
      currentUserName: 'Modou Fall (Admin)'
    };
    notify();
  };

  return {
    ...state,
    setCurrentRole,
    addBooking,
    updateBookingStatus,
    addEquipment,
    updateEquipment,
    addRental,
    returnRental,
    addTransaction,
    saveInventory,
    updateSettings,
    calculateFinancialBreakdown,
    resetToSeed
  };
}
