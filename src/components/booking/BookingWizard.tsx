'use client';

import React, { useState, useMemo } from 'react';
import { useLabelStore } from '@/lib/store/useLabelStore';
import { Service, Space, BookingOption, Booking } from '@/lib/types';
import { formatFCFA } from '@/lib/utils/currency';
import { isSlotAllowedForNoise } from '@/lib/utils/noiseCheck';
import { getWhatsAppBookingLink } from '@/lib/utils/whatsapp';
import confetti from 'canvas-confetti';
import {
  Calendar, Clock, CheckCircle2, AlertTriangle, ShieldCheck,
  CreditCard, Smartphone, DollarSign, ArrowRight, ArrowLeft,
  Volume2, Music, User, Phone, Mail, FileText, Share2, Sparkles
} from 'lucide-react';

interface BookingWizardProps {
  initialServiceId?: string;
  initialSpaceId?: string;
  onSuccess?: (booking: Booking) => void;
}

export function BookingWizard({ initialServiceId, initialSpaceId, onSuccess }: BookingWizardProps) {
  const { spaces, services, options, bookings, settings, addBooking } = useLabelStore();

  // Étape courante : 1: Service -> 2: Date & Créneau -> 3: Options -> 4: Client & Coordonnées -> 5: Acompte & Paiement -> 6: Confirmation
  const [step, setStep] = useState<number>(1);

  // Sélections
  const [selectedSpaceId, setSelectedSpaceId] = useState<string>(initialSpaceId || 'studio-son');
  const [selectedServiceId, setSelectedServiceId] = useState<string>(initialServiceId || 'pack-son-complet');
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [selectedStartTime, setSelectedStartTime] = useState<string>('14:00');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  // Coordonnées client
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('+221 ');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [clientNotes, setClientNotes] = useState<string>('');

  // Mode de paiement choisi (Wave, Orange Money, Sur place)
  const [paymentChoice, setPaymentChoice] = useState<'wave' | 'orange_money' | 'sur_place'>('wave');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [paymentStep, setPaymentStep] = useState<'idle' | 'prompt_pin' | 'success'>('idle');

  // Résultat
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Espace et service actuels
  const currentService = useMemo(() => {
    return services.find(s => s.id === selectedServiceId) || services[0];
  }, [services, selectedServiceId]);

  const currentSpace = useMemo(() => {
    const spaceId = currentService?.space_id || selectedSpaceId;
    return spaces.find(s => s.id === spaceId) || spaces[0];
  }, [spaces, currentService, selectedSpaceId]);

  // Durée du service
  const durationHours = currentService?.duration_hours || 1;

  // Calcul heure de fin
  const calculateEndTime = (startStr: string, duration: number) => {
    const [hours, mins] = startStr.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + Math.round(duration * 60);
    const endH = Math.floor(totalMinutes / 60);
    const endM = totalMinutes % 60;
    return `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;
  };

  const selectedEndTime = useMemo(() => {
    return calculateEndTime(selectedStartTime, durationHours);
  }, [selectedStartTime, durationHours]);

  // Calcul des montants
  const pricing = useMemo(() => {
    const basePrice = currentService ? currentService.price : 0;
    const optionsTotal = selectedOptions.reduce((sum, optId) => {
      const opt = options.find(o => o.id === optId);
      return sum + (opt ? opt.price : 0);
    }, 0);

    const total = basePrice + optionsTotal;
    const depositPct = currentService?.deposit_percentage || settings.booking_rules.deposit_percentage || 50;
    const deposit = Math.round((total * depositPct) / 100);

    return {
      basePrice,
      optionsTotal,
      total,
      depositPct,
      deposit
    };
  }, [currentService, selectedOptions, options, settings]);

  // Génération des créneaux disponibles pour la date sélectionnée (de 09:00 à 21:00)
  const availableSlots = useMemo(() => {
    const slots = [
      '09:00', '10:00', '11:00', '12:00', '13:00',
      '14:00', '15:00', '16:00', '17:00', '18:00',
      '19:00', '20:00'
    ];

    return slots.map(timeStr => {
      const startDateTimeStr = `${selectedDate}T${timeStr}:00Z`;
      const endStr = calculateEndTime(timeStr, durationHours);
      const endDateTimeStr = `${selectedDate}T${endStr}:00Z`;

      const startMs = new Date(startDateTimeStr).getTime();
      const endMs = new Date(endDateTimeStr).getTime();

      // Vérifier si le créneau dépasse les heures d'ouverture (22h)
      const [endH] = endStr.split(':').map(Number);
      if (endH > 22) {
        return { time: timeStr, available: false, reason: "Dépasse l'heure de fermeture (22h)" };
      }

      // 1. Vérification conflit de réservation
      const conflict = bookings.some(b => {
        if (b.status === 'annulee') return false;
        if (b.space_id !== currentSpace?.id) return false;
        const bStart = new Date(b.start_time).getTime();
        const bEnd = new Date(b.end_time).getTime();
        return (startMs < bEnd && endMs > bStart);
      });

      if (conflict) {
        return { time: timeStr, available: false, reason: "Créneau déjà réservé" };
      }

      // 2. Vérification règle de bruit si le service est marqué bruyant
      if (currentService?.is_noisy) {
        const noiseCheck = isSlotAllowedForNoise(
          startDateTimeStr,
          endDateTimeStr,
          settings.noise_regulations
        );
        if (!noiseCheck.allowed) {
          return { time: timeStr, available: false, reason: noiseCheck.reason || "Horaires bruyants restreints" };
        }
      }

      return { time: timeStr, available: true, reason: null };
    });
  }, [selectedDate, durationHours, bookings, currentSpace, currentService, settings]);

  // Options toggling
  const toggleOption = (id: string) => {
    setSelectedOptions(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Validation du formulaire de coordonnées
  const handleProceedToPayment = () => {
    setErrorMessage(null);
    if (!clientName.trim()) {
      setErrorMessage("Veuillez saisir votre nom complet.");
      return;
    }
    if (!clientPhone.trim() || clientPhone.trim() === '+221' || clientPhone.trim().length < 9) {
      setErrorMessage("Veuillez renseigner un numéro de téléphone sénégalais valide (+221).");
      return;
    }
    setStep(5);
  };

  // Soumission et paiement
  const handleConfirmBooking = () => {
    setErrorMessage(null);
    setIsProcessingPayment(true);

    const startIso = `${selectedDate}T${selectedStartTime}:00Z`;
    const endIso = `${selectedDate}T${selectedEndTime}:00Z`;

    const selectedOptionsObjects = selectedOptions.map(id => {
      const opt = options.find(o => o.id === id);
      return { id, name: opt?.name || id, price: opt?.price || 0 };
    });

    const isPayingNow = paymentChoice !== 'sur_place';
    const paidAmount = isPayingNow ? pricing.deposit : 0;
    const initialStatus = isPayingNow ? 'confirmee' : 'en_attente';

    // Simulation du prompt de confirmation mobile money Wave / Orange Money
    setTimeout(() => {
      const result = addBooking({
        client_name: clientName,
        client_phone: clientPhone,
        client_email: clientEmail || undefined,
        space_id: currentSpace.id,
        service_id: currentService.id,
        start_time: startIso,
        end_time: endIso,
        options_selected: selectedOptionsObjects,
        total_amount: pricing.total,
        deposit_amount: pricing.deposit,
        paid_amount: paidAmount,
        status: initialStatus,
        source: 'web',
        notes: clientNotes,
        is_noisy: currentService.is_noisy
      });

      setIsProcessingPayment(false);

      if (!result.success || !result.booking) {
        setErrorMessage(result.error || "Impossible de finaliser la réservation.");
        return;
      }

      setConfirmedBooking(result.booking);
      setStep(6);

      // Animation festive confetti pour confirmation
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#e8b23a', '#ffd066', '#ffffff']
        });
      } catch (e) {
        // Fallback sans effet visuel si non supporté
      }

      if (onSuccess) {
        onSuccess(result.booking);
      }
    }, 1200);
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-surface-secondary border border-surface-border rounded-2xl shadow-2xl overflow-hidden">
      {/* Barre d'étapes visuelle */}
      <div className="bg-surface border-b border-surface-border p-4">
        <div className="flex items-center justify-between text-xs sm:text-sm font-medium">
          <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-gold' : 'text-zinc-500'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-gold text-background' : 'bg-surface-border text-zinc-400'}`}>
              1
            </span>
            <span className="hidden sm:inline">Formule</span>
          </div>
          <div className="w-6 h-0.5 bg-surface-border" />
          <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-gold' : 'text-zinc-500'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-gold text-background' : 'bg-surface-border text-zinc-400'}`}>
              2
            </span>
            <span className="hidden sm:inline">Date & Heure</span>
          </div>
          <div className="w-6 h-0.5 bg-surface-border" />
          <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-gold' : 'text-zinc-500'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 3 ? 'bg-gold text-background' : 'bg-surface-border text-zinc-400'}`}>
              3
            </span>
            <span className="hidden sm:inline">Options</span>
          </div>
          <div className="w-6 h-0.5 bg-surface-border" />
          <div className={`flex items-center gap-1.5 ${step >= 4 ? 'text-gold' : 'text-zinc-500'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 4 ? 'bg-gold text-background' : 'bg-surface-border text-zinc-400'}`}>
              4
            </span>
            <span className="hidden sm:inline">Contact</span>
          </div>
          <div className="w-6 h-0.5 bg-surface-border" />
          <div className={`flex items-center gap-1.5 ${step >= 5 ? 'text-gold' : 'text-zinc-500'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 5 ? 'bg-gold text-background' : 'bg-surface-border text-zinc-400'}`}>
              5
            </span>
            <span className="hidden sm:inline">Acompte</span>
          </div>
        </div>
      </div>

      {/* Message d'erreur s'il y a lieu */}
      {errorMessage && (
        <div className="m-4 p-3 bg-red-950/60 border border-red-800 rounded-xl flex items-center gap-2 text-sm text-red-200">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* CONTENU SELON L'ÉTAPE */}
      <div className="p-4 sm:p-6">
        {/* ÉTAPE 1 : CHOIX DU SERVICE */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Choisissez votre service ou pack</h3>
              <p className="text-sm text-zinc-400 mt-1">
                Studio son insonorisé, plateau podcast & TV, ou séance photo au studio de Thiès.
              </p>
            </div>

            {/* Filtre par Espace */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedSpaceId('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedSpaceId === 'all'
                    ? 'bg-gold text-background'
                    : 'bg-surface border border-surface-border text-zinc-400 hover:text-white'
                }`}
              >
                Tous les services
              </button>
              {spaces.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedSpaceId(s.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedSpaceId === s.id
                      ? 'bg-gold text-background'
                    : 'bg-surface border border-surface-border text-zinc-400 hover:text-white'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>

            {/* Grille des services */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
              {services
                .filter(s => selectedSpaceId === 'all' || !s.space_id || s.space_id === selectedSpaceId)
                .map(service => {
                  const isSelected = service.id === selectedServiceId;
                  return (
                    <div
                      key={service.id}
                      onClick={() => setSelectedServiceId(service.id)}
                      className={`cursor-pointer p-4 rounded-xl border transition-all ${
                        isSelected
                          ? 'border-gold bg-gold/10 shadow-lg shadow-gold/5 ring-1 ring-gold'
                          : 'border-surface-border bg-surface hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-white text-sm sm:text-base">{service.name}</h4>
                        {service.is_noisy && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 flex-shrink-0">
                            <Volume2 className="w-3 h-3" /> 10h-19h
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{service.description}</p>
                      <div className="mt-3 flex items-center justify-between pt-2 border-t border-surface-border">
                        <span className="text-xs text-zinc-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-zinc-500" />
                          {service.duration_hours}h de session
                        </span>
                        <span className="font-display font-bold text-gold text-sm sm:text-base">
                          {formatFCFA(service.price)}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-background font-bold text-sm flex items-center gap-2 shadow-lg shadow-gold/10 transition-all active:scale-95"
              >
                <span>Choisir le créneau</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 2 : DATE & CRÉNEAU */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white tracking-tight">Sélectionnez la date et l'horaire</h3>
                <span className="text-xs text-gold bg-gold/10 px-2 py-0.5 rounded border border-gold/30">
                  {currentSpace?.name}
                </span>
              </div>
              <p className="text-sm text-zinc-400 mt-1">
                Les créneaux occupés sont bloqués en temps réel. Durée de la session : {durationHours}h.
              </p>
            </div>

            {/* Avertissement son si bruyant */}
            {currentService?.is_noisy && (
              <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl flex items-start gap-2.5 text-xs text-amber-200">
                <Volume2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Règle Bruit & Voisinage : </span>
                  Batterie et Sabar autorisés uniquement entre {settings.noise_regulations.start_hour}h00 et {settings.noise_regulations.end_hour}h00 (du lundi au samedi). Les autres créneaux sont automatiquement verrouillés.
                </div>
              </div>
            )}

            {/* Choix de la date */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                Date de la séance à Thiès
              </label>
              <input
                type="date"
                value={selectedDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full sm:w-auto px-4 py-2.5 bg-surface border border-surface-border rounded-xl text-white font-medium focus:outline-none focus:border-gold"
              />
            </div>

            {/* Grille des créneaux horaires */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                Heure de début (Créneaux disponibles)
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {availableSlots.map(({ time, available, reason }) => {
                  const isSelected = time === selectedStartTime;
                  return (
                    <button
                      key={time}
                      type="button"
                      disabled={!available}
                      onClick={() => {
                        setSelectedStartTime(time);
                        setErrorMessage(null);
                      }}
                      title={reason || undefined}
                      className={`p-2.5 rounded-xl text-xs font-semibold transition-all flex flex-col items-center justify-center ${
                        !available
                          ? 'bg-surface/50 border border-surface-border text-zinc-600 cursor-not-allowed line-through'
                          : isSelected
                          ? 'bg-gold text-background border border-gold font-bold shadow-md shadow-gold/20'
                          : 'bg-surface border border-surface-border text-zinc-300 hover:border-gold/50'
                      }`}
                    >
                      <span className="text-sm font-mono">{time}</span>
                      <span className="text-[10px] opacity-80">
                        {calculateEndTime(time, durationHours)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Résumé du créneau */}
            <div className="p-3 bg-surface border border-surface-border rounded-xl flex items-center justify-between text-xs sm:text-sm text-zinc-300">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-gold" />
                Séance prévue le <strong className="text-white">{selectedDate}</strong>
              </span>
              <span className="flex items-center gap-1.5 font-mono">
                <Clock className="w-4 h-4 text-gold" />
                {selectedStartTime} → {selectedEndTime}
              </span>
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl bg-surface hover:bg-surface-border text-zinc-300 text-sm flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Retour</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-background font-bold text-sm flex items-center gap-2 shadow-lg shadow-gold/10 transition-all active:scale-95"
              >
                <span>Options de séance</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 3 : OPTIONS SUPPLÉMENTAIRES */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Ajoutez des options à votre session</h3>
              <p className="text-sm text-zinc-400 mt-1">
                Optimisez votre rendu avec notre ingénieur dédié, un cadreur pro ou une livraison express.
              </p>
            </div>

            <div className="space-y-2.5">
              {options.map(option => {
                const isChecked = selectedOptions.includes(option.id);
                return (
                  <div
                    key={option.id}
                    onClick={() => toggleOption(option.id)}
                    className={`cursor-pointer p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                      isChecked
                        ? 'border-gold bg-gold/10 ring-1 ring-gold/50'
                        : 'border-surface-border bg-surface hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                        isChecked ? 'bg-gold border-gold text-background' : 'border-zinc-600 bg-surface'
                      }`}>
                        {isChecked && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{option.name}</h4>
                        <p className="text-xs text-zinc-400">{option.description}</p>
                      </div>
                    </div>
                    <span className="font-display font-bold text-gold text-sm whitespace-nowrap ml-2">
                      +{formatFCFA(option.price)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Récapitulatif intermédiaire du montant */}
            <div className="p-4 bg-surface border border-surface-border rounded-xl space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between text-zinc-400">
                <span>{currentService.name} ({durationHours}h)</span>
                <span>{formatFCFA(currentService.price)}</span>
              </div>
              {selectedOptions.length > 0 && (
                <div className="flex justify-between text-zinc-400">
                  <span>Options additionnelles ({selectedOptions.length})</span>
                  <span>+{formatFCFA(pricing.optionsTotal)}</span>
                </div>
              )}
              <div className="border-t border-surface-border pt-2 flex justify-between font-bold text-white text-base">
                <span>Total calculé</span>
                <span className="text-gold font-display">{formatFCFA(pricing.total)}</span>
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-xl bg-surface hover:bg-surface-border text-zinc-300 text-sm flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Retour</span>
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="px-6 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-background font-bold text-sm flex items-center gap-2 shadow-lg shadow-gold/10 transition-all active:scale-95"
              >
                <span>Vos coordonnées</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 4 : COORDONNÉES CLIENT */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Vos coordonnées</h3>
              <p className="text-sm text-zinc-400 mt-1">
                Nécessaires pour l'accès au studio à Thiès et l'envoi de votre confirmation WhatsApp.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Nom complet / Nom d'artiste <span className="text-gold">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Ousmane Sow"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-surface border border-surface-border rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-gold text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Numéro de téléphone (+221) <span className="text-gold">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="+221 77 123 45 67"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-surface border border-surface-border rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-gold text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Email (Optionnel pour reçu PDF)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    placeholder="artiste@gmail.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-surface border border-surface-border rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-gold text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Précisions sur votre projet (Optionnel)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Enregistrement voix rap sur prod drill + choeurs, besoin d'aide mixage..."
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  className="w-full p-3 bg-surface border border-surface-border rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-gold text-sm"
                />
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2 rounded-xl bg-surface hover:bg-surface-border text-zinc-300 text-sm flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Retour</span>
              </button>
              <button
                type="button"
                onClick={handleProceedToPayment}
                className="px-6 py-2.5 rounded-xl bg-gold hover:bg-gold-light text-background font-bold text-sm flex items-center gap-2 shadow-lg shadow-gold/10 transition-all active:scale-95"
              >
                <span>Passer au règlement</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 5 : ACOMPTE & PAIEMENT (WAVE / ORANGE MONEY / SUR PLACE) */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Règlement de l'acompte (50 %)</h3>
              <p className="text-sm text-zinc-400 mt-1">
                Votre réservation est immédiatement bloquée et validée dès le paiement de l'acompte.
              </p>
            </div>

            {/* Récapitulatif financier clair */}
            <div className="bg-surface border border-surface-border rounded-xl p-4 space-y-3">
              <div className="flex justify-between text-sm text-zinc-300">
                <span>Montant total de la prestation</span>
                <span className="font-semibold">{formatFCFA(pricing.total)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gold border-t border-surface-border pt-2">
                <span>Acompte requis ({pricing.depositPct} %)</span>
                <span className="font-display text-lg">{formatFCFA(pricing.deposit)}</span>
              </div>
              <div className="flex justify-between text-xs text-zinc-400">
                <span>Solde restant à régler sur place le jour J</span>
                <span>{formatFCFA(pricing.total - pricing.deposit)}</span>
              </div>
            </div>

            {/* Choix du moyen de paiement */}
            <div className="space-y-2.5">
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                Moyen de paiement sécurisé
              </label>

              {/* Option Wave */}
              <div
                onClick={() => setPaymentChoice('wave')}
                className={`cursor-pointer p-4 rounded-xl border flex items-center justify-between transition-all ${
                  paymentChoice === 'wave'
                    ? 'border-[#1dc3f5] bg-[#1dc3f5]/10 ring-1 ring-[#1dc3f5]'
                    : 'border-surface-border bg-surface hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1dc3f5] flex items-center justify-center text-white font-black text-sm">
                    Wave
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      Payer par Wave
                      <span className="px-2 py-0.5 rounded text-[10px] bg-green-500/20 text-green-300 border border-green-500/30">
                        Instantané 0% frais
                      </span>
                    </h4>
                    <p className="text-xs text-zinc-400">Paiement direct via l'application Wave Sénégal</p>
                  </div>
                </div>
                <Smartphone className="w-5 h-5 text-[#1dc3f5]" />
              </div>

              {/* Option Orange Money */}
              <div
                onClick={() => setPaymentChoice('orange_money')}
                className={`cursor-pointer p-4 rounded-xl border flex items-center justify-between transition-all ${
                  paymentChoice === 'orange_money'
                    ? 'border-[#ff7900] bg-[#ff7900]/10 ring-1 ring-[#ff7900]'
                    : 'border-surface-border bg-surface hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#ff7900] flex items-center justify-center text-white font-black text-xs">
                    OM
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Orange Money Sénégal</h4>
                    <p className="text-xs text-zinc-400">Paiement via QR Code ou numéro OTP (#144#)</p>
                  </div>
                </div>
                <Smartphone className="w-5 h-5 text-[#ff7900]" />
              </div>

              {/* Option Espèces sur place (si autorisée) */}
              {currentService.allow_cash && (
                <div
                  onClick={() => setPaymentChoice('sur_place')}
                  className={`cursor-pointer p-4 rounded-xl border flex items-center justify-between transition-all ${
                    paymentChoice === 'sur_place'
                      ? 'border-gold bg-gold/10 ring-1 ring-gold'
                      : 'border-surface-border bg-surface hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-surface-border flex items-center justify-center text-gold font-bold">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Payer sur place au studio</h4>
                      <p className="text-xs text-zinc-400">Réservation en attente de confirmation par le staff</p>
                    </div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-gold" />
                </div>
              )}
            </div>

            {/* Règles d'annulation conformes au prompt (§3) */}
            <div className="p-3 bg-surface border border-surface-border rounded-xl text-xs text-zinc-400 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-zinc-200">Politique d'annulation Seven Truth :</strong> Remboursement intégral de l'acompte garanti en cas d'annulation effectuée plus de 48 heures avant l'heure de début. Moins de 48h avant, l'acompte est conservé pour couvrir le blocage du studio.
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(4)}
                disabled={isProcessingPayment}
                className="px-4 py-2 rounded-xl bg-surface hover:bg-surface-border text-zinc-300 text-sm flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Retour</span>
              </button>
              <button
                type="button"
                disabled={isProcessingPayment}
                onClick={handleConfirmBooking}
                className="px-6 py-3 rounded-xl bg-gold hover:bg-gold-light text-background font-bold text-sm sm:text-base flex items-center gap-2 shadow-xl shadow-gold/20 transition-all active:scale-95 disabled:opacity-50"
              >
                {isProcessingPayment ? (
                  <>
                    <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                    <span>Traitement sécurisé...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>
                      {paymentChoice === 'sur_place'
                        ? 'Valider la réservation'
                        : `Payer ${formatFCFA(pricing.deposit)}`}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 6 : CONFIRMATION RÉUSSIE */}
        {step === 6 && confirmedBooking && (
          <div className="text-center py-4 space-y-6">
            <div className="w-16 h-16 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center mx-auto text-gold animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gold/20 text-gold border border-gold/30">
                {confirmedBooking.status === 'confirmee' || confirmedBooking.status === 'payee'
                  ? 'Réservation Confirmée & Enregistrée'
                  : 'Réservation Enregistrée (En attente)'}
              </span>
              <h3 className="text-2xl font-display font-black text-white mt-2">
                Félicitations, {confirmedBooking.client_name} !
              </h3>
              <p className="text-sm text-zinc-400 mt-1">
                Votre créneau est sécurisé dans notre calendrier studio à Thiès.
              </p>
            </div>

            {/* Fiche récapitulative imprimable */}
            <div className="bg-surface border border-surface-border rounded-2xl p-5 text-left max-w-md mx-auto space-y-3 font-sans shadow-xl">
              <div className="flex justify-between items-center border-b border-surface-border pb-3">
                <span className="font-display font-bold text-gold text-lg">SEVEN TRUTH</span>
                <span className="font-mono text-xs text-zinc-400 bg-surface-secondary px-2 py-1 rounded">
                  {confirmedBooking.booking_number}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-zinc-500 block">Service</span>
                  <strong className="text-white text-sm">{currentService.name}</strong>
                </div>
                <div>
                  <span className="text-zinc-500 block">Espace</span>
                  <strong className="text-white text-sm">{currentSpace.name}</strong>
                </div>
                <div>
                  <span className="text-zinc-500 block">Date</span>
                  <strong className="text-white">{selectedDate}</strong>
                </div>
                <div>
                  <span className="text-zinc-500 block">Horaire</span>
                  <strong className="text-white font-mono">{selectedStartTime} → {selectedEndTime}</strong>
                </div>
              </div>

              <div className="border-t border-surface-border pt-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Montant total</span>
                  <span className="text-white font-semibold">{formatFCFA(confirmedBooking.total_amount)}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Acompte versé</span>
                  <span className="text-green-400 font-semibold">{formatFCFA(confirmedBooking.paid_amount)}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Reste à régler le jour J</span>
                  <span className="text-gold font-bold">
                    {formatFCFA(confirmedBooking.total_amount - confirmedBooking.paid_amount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions : WhatsApp wa.me link & Reçu PDF / Impression */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href={getWhatsAppBookingLink({
                  booking_number: confirmedBooking.booking_number,
                  client_name: confirmedBooking.client_name,
                  space_name: currentSpace.name,
                  service_name: currentService.name,
                  date_formatted: selectedDate,
                  time_formatted: `${selectedStartTime} à ${selectedEndTime}`,
                  total_amount: confirmedBooking.total_amount,
                  deposit_amount: confirmedBooking.deposit_amount,
                  paid_amount: confirmedBooking.paid_amount
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
              >
                <Share2 className="w-4 h-4" />
                <span>Ouvrir sur WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => window.print()}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-surface border border-surface-border hover:border-gold text-zinc-200 font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <FileText className="w-4 h-4 text-gold" />
                <span>Imprimer le reçu (PDF)</span>
              </button>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setConfirmedBooking(null);
                }}
                className="text-xs text-zinc-400 hover:text-gold transition-colors underline"
              >
                Effectuer une autre réservation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
