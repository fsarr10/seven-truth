'use client';

import React, { useState, useMemo, useEffect } from 'react';

const WHATSAPP_PHONE = '221774501234';

interface ServiceOption {
  id: string;
  name: string;
  price: number;
  perHour?: boolean;
  type: 'hourly' | 'fixed' | 'per_person' | 'quote';
  defaultDuration?: number;
}

const SERVICES: ServiceOption[] = [
  { id: 'studio-heure', name: 'Studio son à l’heure', price: 10000, type: 'hourly', perHour: true, defaultDuration: 2 },
  { id: 'pack-son', name: 'Pack enregistrement + mix + master', price: 35000, type: 'fixed', defaultDuration: 4 },
  { id: 'plateau-heure', name: 'Plateau podcast / vidéo à l’heure', price: 15000, type: 'hourly', perHour: true, defaultDuration: 2 },
  { id: 'pack-podcast', name: 'Pack épisode podcast (1 h + montage)', price: 40000, type: 'fixed', defaultDuration: 2 },
  { id: 'abo-createur', name: 'Abonnement créateur (4 épisodes/mois)', price: 140000, type: 'fixed', defaultDuration: 8 },
  { id: 'pack-photo', name: 'Pack photo (1 h + 10 photos retouchées)', price: 25000, type: 'fixed', defaultDuration: 1 },
  { id: 'montage-court', name: 'Montage vidéo courte (Reels / TikTok)', price: 15000, type: 'fixed', defaultDuration: 2 },
  { id: 'clip-video', name: 'Clip vidéo (tournage + montage)', price: 150000, type: 'fixed', defaultDuration: 6 },
  { id: 'evenement', name: 'Événement (mariage, baptême, spectacle)', price: 100000, type: 'fixed', defaultDuration: 6 },
  { id: 'formation', name: 'Formation week-end (MAO, son, vidéo)', price: 25000, type: 'per_person', defaultDuration: 4 },
  { id: 'location', name: 'Location de matériel (caméras, micros, sono)', price: 0, type: 'quote', defaultDuration: 24 },
];

interface AddonOption {
  id: string;
  name: string;
  price: number;
  perHour?: boolean;
  isNoiseOption?: boolean;
}

const ADDONS: AddonOption[] = [
  { id: 'mix-pro', name: 'Mixage pro', price: 15000 },
  { id: 'beat-exclu', name: 'Beat exclusif', price: 25000 },
  { id: 'cadreur', name: 'Cadreur pro', price: 10000, perHour: true },
  { id: 'montage-sup', name: 'Montage additionnel', price: 20000 },
  { id: 'maquillage', name: 'Maquillage tournage', price: 15000 },
  { id: 'sabar-batterie', name: 'Batterie / tam-tam / sabar (10h–19h)', price: 0, isNoiseOption: true },
];

export function BrutalistBooking({ preselectedService }: { preselectedService?: string }) {
  // Numéro de session aléatoire
  const [sessionNum, setSessionNum] = useState('7T-4819');

  // Form State
  const [selectedServiceId, setSelectedServiceId] = useState<string>('studio-heure');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('14:00');
  const [duration, setDuration] = useState<number>(2);
  const [persons, setPersons] = useState<number>(1);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientProject, setClientProject] = useState<string>('');

  // Active Field & Errors
  const [activeField, setActiveField] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Initialisation session number & date par défaut (demain, ou lundi si demain est dimanche)
  useEffect(() => {
    const rand = Math.floor(1000 + Math.random() * 9000);
    setSessionNum(`7T-${rand}`);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    // Si dimanche (0), passer à lundi
    if (tomorrow.getDay() === 0) {
      tomorrow.setDate(tomorrow.getDate() + 1);
    }
    setDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  // Synchronisation si sélection externe depuis les salles ou formules
  useEffect(() => {
    if (preselectedService) {
      const match = SERVICES.find(
        (s) => s.id === preselectedService || s.id.includes(preselectedService)
      );
      if (match) {
        setSelectedServiceId(match.id);
      }
    }
  }, [preselectedService]);

  const currentService = useMemo(
    () => SERVICES.find((s) => s.id === selectedServiceId) || SERVICES[0],
    [selectedServiceId]
  );

  // Toggle options
  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Calcul du prix total & acompte
  const calculation = useMemo(() => {
    if (currentService.type === 'quote') {
      return { total: 0, deposit: 0, isQuote: true, details: [] };
    }

    const details: { label: string; amount: number }[] = [];

    let baseAmount = 0;
    if (currentService.type === 'hourly') {
      baseAmount = currentService.price * duration;
      details.push({
        label: `${currentService.name} (${duration}h × ${currentService.price.toLocaleString('fr-FR')} F)`,
        amount: baseAmount,
      });
    } else if (currentService.type === 'per_person') {
      baseAmount = currentService.price * persons;
      details.push({
        label: `${currentService.name} (${persons} pers. × ${currentService.price.toLocaleString('fr-FR')} F)`,
        amount: baseAmount,
      });
    } else {
      baseAmount = currentService.price;
      details.push({
        label: currentService.name,
        amount: baseAmount,
      });
    }

    let addonsAmount = 0;
    selectedAddons.forEach((addonId) => {
      const addon = ADDONS.find((a) => a.id === addonId);
      if (addon && addon.price > 0) {
        const itemAmount = addon.perHour ? addon.price * duration : addon.price;
        addonsAmount += itemAmount;
        details.push({
          label: addon.perHour
            ? `${addon.name} (${duration}h × ${addon.price.toLocaleString('fr-FR')} F)`
            : addon.name,
          amount: itemAmount,
        });
      }
    });

    const total = baseAmount + addonsAmount;
    const deposit = Math.round(total * 0.5);

    return { total, deposit, isQuote: false, details };
  }, [currentService, duration, persons, selectedAddons]);

  // Validation
  const validateForm = () => {
    const errs: { [key: string]: string } = {};

    if (!clientName.trim()) {
      errs.name = 'Ton nom complet est requis.';
    }

    const cleanPhone = clientPhone.replace(/\D/g, '');
    if (cleanPhone.length < 9) {
      errs.phone = 'Le numéro doit comporter au moins 9 chiffres.';
    }

    if (!date) {
      errs.date = 'Choisis une date.';
    } else {
      const chosen = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (chosen < today) {
        errs.date = 'La date ne peut pas être dans le passé.';
      }
    }

    // Vérification de la règle acoustique Sabar / Tam-tam / Batterie
    const hasSabar = selectedAddons.includes('sabar-batterie');
    if (hasSabar && date && time) {
      const chosenDate = new Date(date);
      const dayOfWeek = chosenDate.getDay(); // 0 = Dimanche
      const [startH] = time.split(':').map(Number);
      const endH = startH + (currentService.type === 'hourly' ? duration : 2);

      if (dayOfWeek === 0) {
        errs.noise = 'Les instruments acoustiques forts sont interdits le dimanche par le propriétaire.';
      } else if (startH < 10 || endH > 19) {
        errs.noise = `Batterie/Sabar autorisés uniquement entre 10h et 19h (ta séance se termine à ${endH}h).`;
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Construction du message WhatsApp récapitulatif
    const selectedAddonNames = selectedAddons
      .map((id) => ADDONS.find((a) => a.id === id)?.name)
      .filter(Boolean)
      .join(', ');

    const text = `*FICHE DE SESSION SEVEN TRUTH — ${sessionNum}*
---------------------------------------
👤 *Client :* ${clientName}
📞 *Téléphone :* ${clientPhone}
🎙️ *Service :* ${currentService.name}
📅 *Date :* ${date} à ${time}
⏳ *Durée :* ${currentService.type === 'hourly' ? `${duration} heure(s)` : 'Selon formule'}
${persons > 1 ? `👥 *Participants :* ${persons} personnes\n` : ''}${
      selectedAddonNames ? `⚡ *Options :* ${selectedAddonNames}\n` : ''
    }${clientProject ? `📝 *Projet :* ${clientProject}\n` : ''}---------------------------------------
💰 *Total séance :* ${
      calculation.isQuote ? 'Sur devis' : `${calculation.total.toLocaleString('fr-FR')} FCFA`
    }
💳 *Acompte 50% dû :* ${
      calculation.isQuote ? 'À définir' : `${calculation.deposit.toLocaleString('fr-FR')} FCFA (Wave / OM)`
    }
---------------------------------------
_Transmis depuis seventruth.sn — Quartier Dixième, Thiès_`;

    const encoded = encodeURIComponent(text);
    const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encoded}`;
    window.open(waUrl, '_blank');
  };

  return (
    <section
      id="reservation"
      className="w-full bg-[#f1eadd] border-t-[1.5px] border-[#121110] py-16 px-[clamp(16px,3.2vw,40px)]"
    >
      {/* EN-TÊTE DE SECTION (MODÈLE COMMUN) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-12 items-baseline">
        <div className="md:col-span-3 font-mono text-[12px] font-bold text-[#d7261e] uppercase tracking-[0.06em]">
          (05) RÉSERVATION
        </div>
        <div className="md:col-span-9">
          <h2 className="font-anton uppercase tracking-tight text-[#121110] leading-[0.9] text-[clamp(54px,9vw,150px)]">
            Bloque <span className="font-anton text-[#d7261e]">TA</span> séance.
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* COLONNE GAUCHE : TEXTE INTRO & 3 ÉTAPES NUMÉROTÉES EN MONO ROUGE */}
        <div className="lg:col-span-5 space-y-8">
          <p className="text-sm sm:text-base text-[#2a2724] leading-relaxed">
            Remplis la fiche de session en face pour verrouiller ton créneau. Les réservations se font directement avec l'équipe de production à Thiès.
          </p>

          <div className="space-y-6 pt-4 border-t-[1.5px] border-[#121110]">
            <div className="flex items-start gap-4">
              <span className="font-mono text-sm font-bold text-[#d7261e]">01</span>
              <div>
                <strong className="font-anton text-base uppercase text-[#121110] block">
                  Choisis ton service &amp; ta date
                </strong>
                <p className="text-xs text-[#5d564c] mt-0.5">
                  Sélectionne la formule, le créneau et les options de prise ou mixage.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="font-mono text-sm font-bold text-[#d7261e]">02</span>
              <div>
                <strong className="font-anton text-base uppercase text-[#121110] block">
                  Envoie ta fiche sur WhatsApp
                </strong>
                <p className="text-xs text-[#5d564c] mt-0.5">
                  La fiche pré-remplie est directement transmise à l'ingénieur de garde.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="font-mono text-sm font-bold text-[#d7261e]">03</span>
              <div>
                <strong className="font-anton text-base uppercase text-[#121110] block">
                  Paie 50% par Wave ou Orange Money
                </strong>
                <p className="text-xs text-[#5d564c] mt-0.5">
                  Ton acompte bloque la cabine. Le reste est réglé sur place à Thiès.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#e8dfcf] border-[1.5px] border-[#121110] font-mono text-xs text-[#2a2724] space-y-1">
            <span className="text-[#d7261e] font-bold block uppercase">
              RÈGLEMENT DE BRUIT &amp; VOISINAGE :
            </span>
            <p>
              Batterie, tam-tam et sabar autorisés exclusivement du lundi au samedi, entre 10h et 19h.
            </p>
          </div>
        </div>

        {/* COLONNE DROITE : FICHE DE SESSION PAPIER (OMBRE DURE 10PX 10PX 0 #121110) */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="bg-[#fbf7ef] border-[1.5px] border-[#121110] shadow-[10px_10px_0_#121110] max-[760px]:shadow-[6px_6px_0_#121110] overflow-hidden"
          >
            {/* EN-TÊTE NOIR DE LA FICHE */}
            <div className="bg-[#121110] text-[#f1eadd] px-6 py-4 flex items-center justify-between">
              <div>
                <span className="font-anton text-lg tracking-wider uppercase block leading-none">
                  FICHE DE SESSION
                </span>
                <span className="font-mono text-[10px] text-[#f1eadd]/60 uppercase tracking-widest mt-0.5 block">
                  STUDIO SEVEN TRUTH · QUARTIER DIXIÈME
                </span>
              </div>
              <span className="font-mono text-xs font-bold px-2 py-1 bg-[#d7261e] text-white">
                #{sessionNum}
              </span>
            </div>

            {/* GRILLE DE CHAMPS AVEC FILETS NOIRS */}
            <div className="divide-y-[1.5px] divide-[#121110]">
              {/* CHAMP 1 : SERVICE */}
              <div
                className={`p-4 sm:p-5 transition-colors ${
                  activeField === 'service' ? 'bg-[#fff5d6]' : 'bg-[#fbf7ef]'
                }`}
                onFocus={() => setActiveField('service')}
                onBlur={() => setActiveField(null)}
              >
                <label className={`font-mono text-xs font-bold uppercase tracking-wider block mb-1.5 ${
                  activeField === 'service' ? 'text-[#d7261e]' : 'text-[#5d564c]'
                }`}>
                  01 // Formule ou Service
                </label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full bg-transparent font-sans font-semibold text-[17px] text-[#121110] outline-none cursor-pointer"
                >
                  {SERVICES.map((s) => (
                    <option key={s.id} value={s.id} className="bg-[#f1eadd] text-[#121110]">
                      {s.name} — {s.type === 'quote' ? 'Sur devis' : `${s.price.toLocaleString('fr-FR')} F`}
                    </option>
                  ))}
                </select>
              </div>

              {/* CHAMP 2 : DATE, HEURE & DURÉE */}
              <div className="grid grid-cols-1 sm:grid-cols-3 divide-y-[1.5px] sm:divide-y-0 sm:divide-x-[1.5px] divide-[#121110]">
                {/* Date */}
                <div
                  className={`p-4 transition-colors ${
                    activeField === 'date' ? 'bg-[#fff5d6]' : 'bg-[#fbf7ef]'
                  }`}
                  onFocus={() => setActiveField('date')}
                  onBlur={() => setActiveField(null)}
                >
                  <label className={`font-mono text-xs font-bold uppercase tracking-wider block mb-1.5 ${
                    activeField === 'date' ? 'text-[#d7261e]' : 'text-[#5d564c]'
                  }`}>
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-transparent font-sans font-semibold text-[17px] text-[#121110] outline-none"
                  />
                  {errors.date && (
                    <span className="font-mono text-[11px] text-[#d7261e] font-bold block mt-1">
                      {errors.date}
                    </span>
                  )}
                </div>

                {/* Heure */}
                <div
                  className={`p-4 transition-colors ${
                    activeField === 'time' ? 'bg-[#fff5d6]' : 'bg-[#fbf7ef]'
                  }`}
                  onFocus={() => setActiveField('time')}
                  onBlur={() => setActiveField(null)}
                >
                  <label className={`font-mono text-xs font-bold uppercase tracking-wider block mb-1.5 ${
                    activeField === 'time' ? 'text-[#d7261e]' : 'text-[#5d564c]'
                  }`}>
                    Heure de début
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-transparent font-sans font-semibold text-[17px] text-[#121110] outline-none"
                  />
                </div>

                {/* Durée ou Personnes */}
                <div
                  className={`p-4 transition-colors ${
                    activeField === 'duration' ? 'bg-[#fff5d6]' : 'bg-[#fbf7ef]'
                  }`}
                  onFocus={() => setActiveField('duration')}
                  onBlur={() => setActiveField(null)}
                >
                  {currentService.type === 'hourly' ? (
                    <>
                      <label className={`font-mono text-xs font-bold uppercase tracking-wider block mb-1.5 ${
                        activeField === 'duration' ? 'text-[#d7261e]' : 'text-[#5d564c]'
                      }`}>
                        Durée (heures)
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={12}
                        value={duration}
                        onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full bg-transparent font-sans font-semibold text-[17px] text-[#121110] outline-none"
                      />
                    </>
                  ) : currentService.type === 'per_person' ? (
                    <>
                      <label className={`font-mono text-xs font-bold uppercase tracking-wider block mb-1.5 ${
                        activeField === 'duration' ? 'text-[#d7261e]' : 'text-[#5d564c]'
                      }`}>
                        Nombre de personnes
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={persons}
                        onChange={(e) => setPersons(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full bg-transparent font-sans font-semibold text-[17px] text-[#121110] outline-none"
                      />
                    </>
                  ) : (
                    <>
                      <label className="font-mono text-xs font-bold uppercase tracking-wider text-[#5d564c] block mb-1.5">
                        Format
                      </label>
                      <span className="font-sans font-semibold text-[17px] text-[#121110] block pt-1">
                        Forfait Studio
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* CHAMP 3 : OPTIONS & SUPPLÉMENTS */}
              <div className="p-4 sm:p-5">
                <label className="font-mono text-xs font-bold uppercase tracking-wider text-[#5d564c] block mb-3">
                  02 // Options &amp; Matériel Spécifique
                </label>

                <div className="flex flex-wrap gap-2.5">
                  {ADDONS.map((addon) => {
                    const isChecked = selectedAddons.includes(addon.id);
                    return (
                      <button
                        type="button"
                        key={addon.id}
                        onClick={() => toggleAddon(addon.id)}
                        className={`px-3 py-2 border-[1.5px] border-[#121110] font-mono text-[11.5px] uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                          isChecked
                            ? 'bg-[#121110] text-[#f1eadd]'
                            : 'bg-transparent text-[#121110] hover:bg-[#e8dfcf]'
                        }`}
                      >
                        <span>{isChecked ? '■' : '□'}</span>
                        <span>{addon.name}</span>
                        {addon.price > 0 && (
                          <span className={isChecked ? 'text-[#d7261e]' : 'text-[#5d564c]'}>
                            +{addon.price.toLocaleString('fr-FR')} F
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {errors.noise && (
                  <div className="mt-3 p-2 bg-[#d7261e]/10 border border-[#d7261e] font-mono text-xs text-[#d7261e] font-bold">
                    ⚠️ {errors.noise}
                  </div>
                )}
              </div>

              {/* CHAMP 4 : IDENTITÉ CLIENT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y-[1.5px] sm:divide-y-0 sm:divide-x-[1.5px] divide-[#121110]">
                {/* Nom */}
                <div
                  className={`p-4 transition-colors ${
                    activeField === 'name' ? 'bg-[#fff5d6]' : 'bg-[#fbf7ef]'
                  }`}
                  onFocus={() => setActiveField('name')}
                  onBlur={() => setActiveField(null)}
                >
                  <label className={`font-mono text-xs font-bold uppercase tracking-wider block mb-1.5 ${
                    activeField === 'name' ? 'text-[#d7261e]' : 'text-[#5d564c]'
                  }`}>
                    03 // Nom ou Nom d'artiste *
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Cheikh Ndoye"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-transparent font-sans font-semibold text-[17px] text-[#121110] outline-none placeholder:text-[#5d564c]/40"
                  />
                  {errors.name && (
                    <span className="font-mono text-[11px] text-[#d7261e] font-bold block mt-1">
                      {errors.name}
                    </span>
                  )}
                </div>

                {/* Téléphone */}
                <div
                  className={`p-4 transition-colors ${
                    activeField === 'phone' ? 'bg-[#fff5d6]' : 'bg-[#fbf7ef]'
                  }`}
                  onFocus={() => setActiveField('phone')}
                  onBlur={() => setActiveField(null)}
                >
                  <label className={`font-mono text-xs font-bold uppercase tracking-wider block mb-1.5 ${
                    activeField === 'phone' ? 'text-[#d7261e]' : 'text-[#5d564c]'
                  }`}>
                    04 // Téléphone WhatsApp *
                  </label>
                  <input
                    type="tel"
                    placeholder="+221 77 000 00 00"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full bg-transparent font-sans font-semibold text-[17px] text-[#121110] outline-none placeholder:text-[#5d564c]/40"
                  />
                  {errors.phone && (
                    <span className="font-mono text-[11px] text-[#d7261e] font-bold block mt-1">
                      {errors.phone}
                    </span>
                  )}
                </div>
              </div>

              {/* CHAMP 5 : TON PROJET */}
              <div
                className={`p-4 sm:p-5 transition-colors ${
                  activeField === 'project' ? 'bg-[#fff5d6]' : 'bg-[#fbf7ef]'
                }`}
                onFocus={() => setActiveField('project')}
                onBlur={() => setActiveField(null)}
              >
                <label className={`font-mono text-xs font-bold uppercase tracking-wider block mb-1.5 ${
                  activeField === 'project' ? 'text-[#d7261e]' : 'text-[#5d564c]'
                }`}>
                  05 // Détails du projet (Optionnel)
                </label>
                <textarea
                  rows={2}
                  placeholder="Style musical, instruments, nombre d'invités, attentes de rendu..."
                  value={clientProject}
                  onChange={(e) => setClientProject(e.target.value)}
                  className="w-full bg-transparent font-sans font-semibold text-[15px] text-[#121110] outline-none placeholder:text-[#5d564c]/40 resize-none"
                />
              </div>

              {/* TICKET DE CAISSE EN POINTILLÉS ET EN MONO */}
              <div className="p-5 sm:p-6 bg-[#f1eadd] font-mono text-xs text-[#2a2724] space-y-3">
                <div className="border-b border-dashed border-[#121110] pb-2 font-bold uppercase tracking-wider text-[#121110] flex justify-between">
                  <span>TICKET DE SESSION</span>
                  <span>7T-SN</span>
                </div>

                <div className="space-y-1.5">
                  {calculation.details.map((d, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-[#5d564c] truncate max-w-[280px] sm:max-w-md">{d.label}</span>
                      <span className="font-bold text-[#121110]">{d.amount.toLocaleString('fr-FR')} F</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-dashed border-[#121110] pt-3 flex flex-col sm:flex-row justify-between sm:items-baseline gap-2">
                  <div>
                    <span className="text-[#5d564c] uppercase block">TOTAL SÉANCE</span>
                    <span className="font-anton text-3xl sm:text-4xl text-[#d7261e] leading-none">
                      {calculation.isQuote
                        ? 'SUR DEVIS'
                        : `${calculation.total.toLocaleString('fr-FR')} FCFA`}
                    </span>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[#5d564c] uppercase block">ACOMPTE 50% REQUIS</span>
                    <span className="font-anton text-xl sm:text-2xl text-[#121110] leading-none">
                      {calculation.isQuote
                        ? 'À CONFIRMER'
                        : `${calculation.deposit.toLocaleString('fr-FR')} FCFA`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* BOUTON D'ENVOI WHATSAPP */}
            <div className="p-4 sm:p-5 bg-[#121110]">
              <button
                type="submit"
                className="w-full h-14 bg-[#d7261e] hover:bg-[#b01c15] text-[#f1eadd] font-anton text-xl uppercase tracking-wider flex items-center justify-center gap-3 transition-colors active:translate-x-[1px] active:translate-y-[1px]"
              >
                <span>TRANSMETTRE LA FICHE SUR WHATSAPP</span>
                <span>→</span>
              </button>
              <span className="font-mono text-[10px] text-[#f1eadd]/60 text-center block mt-2 uppercase tracking-widest">
                RÉPONSE EN MOINS D'1H · PAIEMENT ACOMPTE WAVE OU ORANGE MONEY
              </span>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
