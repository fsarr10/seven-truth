'use client';

import React, { useState, useEffect } from 'react';
import { useLabelStore } from '@/lib/store/useLabelStore';
import { Equipment, EquipmentCondition } from '@/lib/types';
import { formatFCFA } from '@/lib/utils/currency';
import QRCode from 'qrcode';
import {
  Package, Plus, QrCode, Search, Filter, Camera, AlertCircle,
  CheckCircle2, Printer, Shield, Eye, Edit3, X, SlidersHorizontal
} from 'lucide-react';

export function InventoryModule() {
  const { equipment, addEquipment, updateEquipment, saveInventory, inventories, currentRole } = useLabelStore();

  const isReadOnly = currentRole === 'patron';

  // Filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedItemForQR, setSelectedItemForQR] = useState<Equipment | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Modale Ajout / Édition
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Equipment | null>(null);

  // Formulaire équipement
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Equipment['category']>('camera');
  const [serialNumber, setSerialNumber] = useState('');
  const [replacementValue, setReplacementValue] = useState<number>(500000);
  const [quantity, setQuantity] = useState<number>(1);
  const [condition, setCondition] = useState<EquipmentCondition>('excellent');
  const [isRentable, setIsRentable] = useState(true);
  const [dailyPrice, setDailyPrice] = useState<number>(15000);
  const [depositRequired, setDepositRequired] = useState<number>(50000);
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');

  // Mode Inventaire Mensuel Guidé
  const [isConductingAudit, setIsConductingAudit] = useState(false);
  const [auditCounts, setAuditCounts] = useState<Record<string, { count: number; condition: EquipmentCondition; notes: string }>>({});
  const [auditSuccessMsg, setAuditSuccessMsg] = useState<string | null>(null);

  // Générer QR Code quand un article est sélectionné
  useEffect(() => {
    if (selectedItemForQR) {
      QRCode.toDataURL(selectedItemForQR.qr_code_data, {
        width: 320,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      }).then(url => {
        setQrDataUrl(url);
      }).catch(err => {
        console.error('QR code generation error:', err);
      });
    }
  }, [selectedItemForQR]);

  // Initialisation de l'inventaire guidé
  const startGuidedInventory = () => {
    const initial: Record<string, { count: number; condition: EquipmentCondition; notes: string }> = {};
    equipment.forEach(item => {
      initial[item.id] = {
        count: item.quantity,
        condition: item.condition,
        notes: ''
      };
    });
    setAuditCounts(initial);
    setIsConductingAudit(true);
    setAuditSuccessMsg(null);
  };

  const handleSaveAudit = () => {
    let discrepancies = 0;
    const lines = equipment.map(item => {
      const recorded = auditCounts[item.id] || { count: item.quantity, condition: item.condition, notes: '' };
      const hasDisc = recorded.count !== item.quantity || recorded.condition !== item.condition;
      if (hasDisc) discrepancies++;

      return {
        id: `line-${Date.now()}-${item.id}`,
        inventory_id: '',
        equipment_id: item.id,
        equipment_name: item.name,
        expected_quantity: item.quantity,
        counted_quantity: recorded.count,
        condition_observed: recorded.condition,
        has_discrepancy: hasDisc,
        discrepancy_notes: recorded.notes,
        scanned_qr: true
      };
    });

    const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    const currentMonthLabel = `${monthNames[new Date().getMonth()]} ${new Date().getFullYear()}`;

    saveInventory({
      inventory_date: new Date().toISOString().split('T')[0],
      month_label: currentMonthLabel,
      conducted_by_name: currentRole === 'patron' ? 'Cheikh Diop (Patron)' : 'Staff Seven Truth',
      status: 'valide',
      discrepancy_count: discrepancies,
      notes: discrepancies > 0 ? `${discrepancies} écart(s) identifié(s) lors du contrôle physique.` : 'Parc matériel complet et conforme sans anomalies.',
      lines
    });

    setIsConductingAudit(false);
    setAuditSuccessMsg(`Inventaire de ${currentMonthLabel} validé avec succès (${discrepancies} écarts).`);
  };

  const handleOpenAddModal = (item?: Equipment) => {
    if (item) {
      setEditingItem(item);
      setName(item.name);
      setCategory(item.category);
      setSerialNumber(item.serial_number || '');
      setReplacementValue(item.replacement_value);
      setQuantity(item.quantity);
      setCondition(item.condition);
      setIsRentable(item.is_rentable);
      setDailyPrice(item.daily_price);
      setDepositRequired(item.deposit_required);
      setDescription(item.description || '');
      setPhotoUrl(item.photos[0] || '');
    } else {
      setEditingItem(null);
      setName('');
      setCategory('camera');
      setSerialNumber('');
      setReplacementValue(500000);
      setQuantity(1);
      setCondition('excellent');
      setIsRentable(true);
      setDailyPrice(15000);
      setDepositRequired(50000);
      setDescription('');
      setPhotoUrl('');
    }
    setIsModalOpen(true);
  };

  const handleSaveEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const photos = photoUrl.trim()
      ? [photoUrl.trim()]
      : ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80'];

    if (editingItem) {
      updateEquipment(editingItem.id, {
        name,
        category,
        serial_number: serialNumber,
        replacement_value: replacementValue,
        quantity,
        condition,
        is_rentable: isRentable,
        daily_price: dailyPrice,
        deposit_required: depositRequired,
        description,
        photos
      });
    } else {
      addEquipment({
        name,
        category,
        serial_number: serialNumber,
        replacement_value: replacementValue,
        quantity,
        available_quantity: quantity,
        condition,
        is_rentable: isRentable,
        daily_price: dailyPrice,
        deposit_required: depositRequired,
        description,
        photos,
        qr_code_data: '',
        partner_owned: true
      });
    }

    setIsModalOpen(false);
  };

  // Filtrage
  const filteredEquipment = equipment.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.serial_number && item.serial_number.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const totalValue = equipment.reduce((sum, item) => sum + item.replacement_value * item.quantity, 0);

  return (
    <div className="space-y-6">
      {/* En-tête avec métriques */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-gold" />
            Parc Matériel & Inventaire
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Inventaire permanent des équipements mis à disposition par le Patron. Valorisation globale :{' '}
            <strong className="text-gold font-display">{formatFCFA(totalValue)}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isReadOnly && (
            <>
              <button
                type="button"
                onClick={startGuidedInventory}
                className="px-4 py-2 rounded-xl bg-surface border border-surface-border hover:border-gold text-zinc-200 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors"
              >
                <QrCode className="w-4 h-4 text-gold" />
                <span>Inventaire Mensuel</span>
              </button>
              <button
                type="button"
                onClick={() => handleOpenAddModal()}
                className="px-4 py-2 rounded-xl bg-gold hover:bg-gold-light text-background text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-lg shadow-gold/10 transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter Matériel</span>
              </button>
            </>
          )}
        </div>
      </div>

      {auditSuccessMsg && (
        <div className="p-3 bg-green-950/40 border border-green-800 rounded-xl text-green-200 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          <span>{auditSuccessMsg}</span>
        </div>
      )}

      {/* Barre de recherche et filtres */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Rechercher par nom, référence (ex: EQ-CAM-01), n° de série..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface border border-surface-border rounded-xl text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-gold"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 bg-surface border border-surface-border rounded-xl text-white text-sm focus:outline-none focus:border-gold"
        >
          <option value="all">Toutes les catégories</option>
          <option value="camera">Caméras & Boîtiers</option>
          <option value="optique">Objectifs & Optiques</option>
          <option value="audio">Micros & Audio</option>
          <option value="lumiere">Éclairage & Projecteurs</option>
          <option value="stabilisateur">Stabilisateurs</option>
          <option value="drone">Drones</option>
        </select>
      </div>

      {/* Grille des fiches d'équipements */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEquipment.map(item => (
          <div
            key={item.id}
            className="bg-surface-secondary border border-surface-border rounded-2xl overflow-hidden hover:border-zinc-700 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Photo & badges */}
              <div className="relative h-44 w-full bg-surface overflow-hidden">
                <img
                  src={item.photos[0] || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80'}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                />
                <div className="absolute top-2 left-2 flex gap-1.5 flex-wrap">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-background/80 backdrop-blur-md text-gold border border-gold/30">
                    {item.id}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold backdrop-blur-md ${
                    item.available_quantity > 0
                      ? 'bg-green-950/80 text-green-300 border border-green-700'
                      : 'bg-red-950/80 text-red-300 border border-red-700'
                  }`}>
                    {item.available_quantity > 0 ? `${item.available_quantity} dispo` : 'En location'}
                  </span>
                </div>
                <div className="absolute top-2 right-2">
                  <button
                    type="button"
                    onClick={() => setSelectedItemForQR(item)}
                    className="p-1.5 rounded-lg bg-background/80 backdrop-blur-md hover:bg-gold hover:text-background text-zinc-300 transition-colors"
                    title="Imprimer QR Code"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Contenu */}
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-1">
                  <h4 className="font-bold text-white text-base leading-tight">{item.name}</h4>
                  <span className="text-[11px] uppercase tracking-wider text-zinc-400 bg-surface px-2 py-0.5 rounded border border-surface-border">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 line-clamp-2">{item.description}</p>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-surface-border">
                  <div>
                    <span className="text-zinc-500 block">Valeur à neuf</span>
                    <strong className="text-white">{formatFCFA(item.replacement_value)}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Tarif jour</span>
                    <strong className="text-gold font-display">{formatFCFA(item.daily_price)} / j</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Caution requise</span>
                    <span className="text-zinc-300">{formatFCFA(item.deposit_required)}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">État constaté</span>
                    <span className="capitalize text-zinc-300 font-medium">{item.condition}</span>
                  </div>
                </div>

                {item.serial_number && (
                  <div className="text-[11px] text-zinc-500 font-mono">
                    S/N: {item.serial_number}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="p-3 bg-surface border-t border-surface-border flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedItemForQR(item)}
                className="text-xs text-gold hover:underline flex items-center gap-1"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>QR Code</span>
              </button>
              {!isReadOnly && (
                <button
                  type="button"
                  onClick={() => handleOpenAddModal(item)}
                  className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Modifier</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODALE QR CODE IMPRIMABLE */}
      {selectedItemForQR && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-secondary border border-surface-border rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl relative text-center">
            <button
              onClick={() => setSelectedItemForQR(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-mono text-gold bg-gold/10 px-2.5 py-0.5 rounded border border-gold/30">
                {selectedItemForQR.id}
              </span>
              <h3 className="text-lg font-bold text-white mt-1">{selectedItemForQR.name}</h3>
              <p className="text-xs text-zinc-400">Étiquette inventaire Seven Truth Thiès</p>
            </div>

            {/* Zone QR Code prête à être collée sur le matériel */}
            <div className="p-4 bg-white rounded-xl mx-auto inline-block shadow-inner">
              {qrDataUrl && (
                <img
                  src={qrDataUrl}
                  alt={`QR Code ${selectedItemForQR.id}`}
                  className="w-48 h-48 mx-auto"
                />
              )}
              <div className="mt-2 text-zinc-900 font-mono text-xs font-bold">
                {selectedItemForQR.qr_code_data}
              </div>
            </div>

            <p className="text-[11px] text-zinc-400">
              Scannez ce code pour vérifier la fiche matériel, enregistrer une sortie ou vérifier un retour.
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-gold hover:bg-gold-light text-background font-bold text-xs rounded-xl flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimer l'étiquette</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedItemForQR(null)}
                className="px-4 py-2.5 bg-surface hover:bg-surface-border text-zinc-300 text-xs rounded-xl"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODALE INVENTAIRE MENSUEL GUIDÉ */}
      {isConductingAudit && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-surface-secondary border border-surface-border rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-gold" />
                  Inventaire Mensuel Guidé
                </h3>
                <p className="text-xs text-zinc-400">
                  Vérifiez physiquement chaque article. Tout écart de quantité ou dégradation d'état sera consigné.
                </p>
              </div>
              <button
                onClick={() => setIsConductingAudit(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {equipment.map(item => {
                const recorded = auditCounts[item.id] || { count: item.quantity, condition: item.condition, notes: '' };
                const hasDiscrepancy = recorded.count !== item.quantity || recorded.condition !== item.condition;

                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      hasDiscrepancy
                        ? 'border-amber-600 bg-amber-950/20'
                        : 'border-surface-border bg-surface'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-gold">{item.id}</span>
                          <h4 className="font-bold text-white text-sm">{item.name}</h4>
                        </div>
                        <span className="text-xs text-zinc-400">
                          Attendu en stock : <strong>{item.quantity}</strong> | État théorique : <strong className="capitalize">{item.condition}</strong>
                        </span>
                      </div>

                      {/* Champs de pointage */}
                      <div className="flex items-center gap-3">
                        <div>
                          <label className="block text-[10px] text-zinc-400 uppercase font-semibold">
                            Qté Comptée
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="20"
                            value={recorded.count}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 0;
                              setAuditCounts(prev => ({
                                ...prev,
                                [item.id]: { ...recorded, count: val }
                              }));
                            }}
                            className="w-16 px-2 py-1 bg-surface-border rounded text-white text-center font-bold text-sm focus:outline-none focus:ring-1 focus:ring-gold"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-zinc-400 uppercase font-semibold">
                            État constaté
                          </label>
                          <select
                            value={recorded.condition}
                            onChange={(e) => {
                              const cond = e.target.value as EquipmentCondition;
                              setAuditCounts(prev => ({
                                ...prev,
                                [item.id]: { ...recorded, condition: cond }
                              }));
                            }}
                            className="px-2 py-1 bg-surface-border rounded text-white text-xs focus:outline-none focus:ring-1 focus:ring-gold"
                          >
                            <option value="neuf">Neuf</option>
                            <option value="excellent">Excellent</option>
                            <option value="bon">Bon</option>
                            <option value="correct">Correct</option>
                            <option value="maintenance">Maintenance</option>
                            <option value="hors_service">Hors service</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {hasDiscrepancy && (
                      <div className="mt-2.5 pt-2 border-t border-amber-900/40">
                        <input
                          type="text"
                          placeholder="Motif de l'écart (ex: Rayure constatée sur lentille, câble manquant...)"
                          value={recorded.notes}
                          onChange={(e) => {
                            const note = e.target.value;
                            setAuditCounts(prev => ({
                              ...prev,
                              [item.id]: { ...recorded, notes: note }
                            }));
                          }}
                          className="w-full px-2.5 py-1 text-xs bg-amber-950/40 border border-amber-800 rounded text-amber-200 placeholder-amber-400/50 focus:outline-none"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-surface-border">
              <span className="text-xs text-zinc-400">
                Rapport consultable directement par le Patron.
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsConductingAudit(false)}
                  className="px-4 py-2 rounded-xl bg-surface hover:bg-surface-border text-zinc-300 text-xs"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleSaveAudit}
                  className="px-5 py-2 rounded-xl bg-gold hover:bg-gold-light text-background font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-gold/10"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Valider et Enregistrer l'inventaire</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODALE CRÉATION / MODIFICATION MATÉRIEL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveEquipment}
            className="bg-surface-secondary border border-surface-border rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl relative"
          >
            <div className="flex items-center justify-between border-b border-surface-border pb-3">
              <h3 className="text-lg font-bold text-white">
                {editingItem ? `Modifier : ${editingItem.name}` : 'Ajouter un équipement'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                Désignation de l'équipement *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Sony FX3 Cinema Line"
                className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-white text-sm focus:outline-none focus:border-gold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  Catégorie
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-white text-sm focus:outline-none focus:border-gold"
                >
                  <option value="camera">Caméra</option>
                  <option value="optique">Optique</option>
                  <option value="audio">Audio</option>
                  <option value="lumiere">Lumière</option>
                  <option value="stabilisateur">Stabilisateur</option>
                  <option value="drone">Drone</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  Numéro de série
                </label>
                <input
                  type="text"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  placeholder="SN-12345"
                  className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-white text-sm font-mono focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  Valeur (FCFA)
                </label>
                <input
                  type="number"
                  value={replacementValue}
                  onChange={(e) => setReplacementValue(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-white text-sm focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  Prix / jour (FCFA)
                </label>
                <input
                  type="number"
                  value={dailyPrice}
                  onChange={(e) => setDailyPrice(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-white text-sm focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                  Caution (FCFA)
                </label>
                <input
                  type="number"
                  value={depositRequired}
                  onChange={(e) => setDepositRequired(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-white text-sm focus:outline-none focus:border-gold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                URL Photo du matériel (Prise de vue réelle)
              </label>
              <input
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 bg-surface border border-surface-border rounded-xl text-white text-sm focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                Description & Accessoires inclus
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Détails du kit (batteries, chargeurs, valise étanche...)"
                className="w-full p-2.5 bg-surface border border-surface-border rounded-xl text-white text-sm focus:outline-none focus:border-gold"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-surface-border">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-surface hover:bg-surface-border text-zinc-300 text-xs"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gold hover:bg-gold-light text-background font-bold text-xs"
              >
                {editingItem ? 'Enregistrer les modifications' : 'Créer la fiche'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
