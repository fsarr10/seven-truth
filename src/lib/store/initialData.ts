import { Space, Service, BookingOption, Equipment, Booking, Rental, Transaction, Inventory, AuditLogEntry, SettingsConfig, PortfolioItem, Artist, Review } from '../types';

export const INITIAL_SPACES: Space[] = [
  {
    id: 'studio-son',
    name: 'Studio Son Pro',
    slug: 'studio-son',
    description: 'Pièce insonorisée "pièce dans la pièce" avec traitement acoustique complet. Enregistrement voix, beatmaking, mixage & mastering. Batterie & sabar autorisés sur créneaux convenus (10h-19h).',
    hourly_rate: 10000,
    noisy_allowed: true,
    noisy_start_hour: 10,
    noisy_end_hour: 19,
    photos: [
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80'
    ],
    equipment_included: ['Micro Shure SM7B', 'Rode NT1-A', 'Interface Apollo Twin X', 'Monitoring Yamaha HS8', 'Clavier Maître 61 touches'],
    capacity: 5,
    active: true
  },
  {
    id: 'plateau-tv',
    name: 'Plateau TV & Podcast',
    slug: 'plateau-tv',
    description: 'Plateau multi-caméras 4K insonorisé avec setup lumière cinéma 3 points, micros podcast et cravate sans fil, fond personnalisable (néon Seven Truth, rideau acoustique sombre).',
    hourly_rate: 15000,
    noisy_allowed: false,
    noisy_start_hour: 9,
    noisy_end_hour: 21,
    photos: [
      'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=800&q=80'
    ],
    equipment_included: ['3 Caméras Sony Cinema Line', 'Console Rodecaster Pro II', 'Micros PodMic', 'Projecteurs Aputure 300d II', 'Prompteur Pro'],
    capacity: 8,
    active: true
  },
  {
    id: 'salle-shooting',
    name: 'Salle Shooting Photo & Mode',
    slug: 'salle-shooting',
    description: "Cyclorama blanc & dérouleur de fonds papier couleur (terracotta, noir mat, vert émeraude, jaune or). Espace maquillage, miroirs loge et cabine d'habillage sur place.",
    hourly_rate: 12000,
    noisy_allowed: false,
    noisy_start_hour: 9,
    noisy_end_hour: 21,
    photos: [
      'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1200&q=80'
    ],
    equipment_included: ['2 Flashs Godox AD600 Pro', 'Boîtes à lumière octogonales 120cm', 'Gélatines couleur', 'Fonds vinyle & papier'],
    capacity: 6,
    active: true
  }
];

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'studio-heure',
    space_id: 'studio-son',
    category: 'studio',
    name: 'Studio Son à l\'heure',
    description: 'Session d\'enregistrement ou de mixage assistée par notre ingénieur du son résident.',
    price: 10000,
    duration_hours: 1,
    deposit_percentage: 50,
    is_noisy: false,
    allow_cash: true,
    active: true
  },
  {
    id: 'pack-son-complet',
    space_id: 'studio-son',
    category: 'pack',
    name: 'Pack Single Clé en Main (Rec + Mix + Master)',
    description: 'Enregistrement complet voix/instruments (jusqu\'à 4h de studio) + Mixage pro + Mastering prêt pour streaming (Spotify, Apple Music, YouTube).',
    price: 35000,
    duration_hours: 4,
    deposit_percentage: 50,
    is_noisy: false,
    allow_cash: true,
    featured: true,
    active: true
  },
  {
    id: 'beat-exclusif',
    space_id: 'studio-son',
    category: 'studio',
    name: 'Composition Beat Exclusif',
    description: 'Création d\'une production originale sur mesure avec stems séparés et contrat de cession de droits exclusifs.',
    price: 30000,
    duration_hours: 2,
    deposit_percentage: 50,
    is_noisy: false,
    allow_cash: true,
    active: true
  },
  {
    id: 'session-batterie-sabar',
    space_id: 'studio-son',
    category: 'studio',
    name: 'Session Sabar, Tam-tam & Batterie',
    description: 'Prise de son acoustique en cabine insonorisée. Strictement restreinte aux plages autorisées (10h-19h du lundi au samedi).',
    price: 15000,
    duration_hours: 1,
    deposit_percentage: 50,
    is_noisy: true, // Règle stricte bruit
    allow_cash: false,
    active: true
  },
  {
    id: 'podcast-heure',
    space_id: 'plateau-tv',
    category: 'podcast',
    name: 'Plateau Podcast à l\'heure',
    description: 'Location du plateau équipé (3 micros Rode, lumières cinéma, fond 7T) avec technicien pour la prise.',
    price: 15000,
    duration_hours: 1,
    deposit_percentage: 50,
    is_noisy: false,
    allow_cash: true,
    active: true
  },
  {
    id: 'pack-podcast-complet',
    space_id: 'plateau-tv',
    category: 'pack',
    name: 'Pack Épisode Podcast (1h + Montage vidéo)',
    description: '1h d\'enregistrement multi-caméras 4K + mix audio + montage dynamique livré en 48h avec chapitrage.',
    price: 40000,
    duration_hours: 2,
    deposit_percentage: 50,
    is_noisy: false,
    allow_cash: true,
    featured: true,
    active: true
  },
  {
    id: 'abonnement-createur',
    space_id: 'plateau-tv',
    category: 'pack',
    name: 'Abonnement Créateur (4 épisodes / mois)',
    description: 'Idéal pour podcasteurs réguliers. 4 sessions de 1h30 + montage complet inclus avec priorité sur le planning.',
    price: 140000,
    duration_hours: 6,
    deposit_percentage: 30,
    is_noisy: false,
    allow_cash: false,
    featured: true,
    active: true
  },
  {
    id: 'pack-photo-artiste',
    space_id: 'salle-shooting',
    category: 'photo',
    name: 'Pack Shooting Artiste / Mode',
    description: '1h de shooting studio + 10 photos retouchées haute définition (pochette d\'album, lookbook, promo réseaux).',
    price: 25000,
    duration_hours: 1,
    deposit_percentage: 50,
    is_noisy: false,
    allow_cash: true,
    featured: true,
    active: true
  },
  {
    id: 'montage-video-court',
    category: 'video',
    name: 'Montage Vidéo Courte (TikTok / Reels)',
    description: 'Montage dynamique avec sous-titres animés, sound design, zooms et étalonnage couleur pro.',
    price: 20000,
    duration_hours: 1,
    deposit_percentage: 50,
    is_noisy: false,
    allow_cash: true,
    active: true
  },
  {
    id: 'clip-video-pro',
    category: 'video',
    name: 'Réalisation Clip Vidéo',
    description: 'Scénarisation, tournage à Thiès/Dakar, cadreur cinéma, éclairage FX, drone 4K, étalonnage cinéma.',
    price: 150000,
    duration_hours: 8,
    deposit_percentage: 50,
    is_noisy: false,
    allow_cash: false,
    featured: true,
    active: true
  },
  {
    id: 'couverture-evenement',
    category: 'evenement',
    name: 'Couverture Événementielle (Mariage / Baptême / Live)',
    description: 'Équipe photo & vidéo dédiée pour couvrir vos cérémonies et concerts avec restitution en album & teaser.',
    price: 100000,
    duration_hours: 6,
    deposit_percentage: 50,
    is_noisy: false,
    allow_cash: false,
    active: true
  },
  {
    id: 'formation-week-end',
    space_id: 'studio-son',
    category: 'formation',
    name: 'Formation MAO & Beatmaking (Week-end)',
    description: '2 jours d\'immersion pratique à Thiès : composition FL Studio/Ableton, mixage voix et publication.',
    price: 25000,
    duration_hours: 8,
    deposit_percentage: 50,
    is_noisy: false,
    allow_cash: true,
    featured: true,
    active: true
  }
];

export const INITIAL_OPTIONS: BookingOption[] = [
  { id: 'opt-inge-son', name: 'Ingénieur du son dédié', price: 5000, unit: 'par heure', description: 'Prise en charge complète des réglages, micros et conseils artistiques.' },
  { id: 'opt-cadreur', name: 'Cadreur pro supplémentaire', price: 7500, unit: 'par heure', description: 'Pour les tournages multi-angles dynamiques ou captations live.' },
  { id: 'opt-montage-rush', name: 'Livraison Express en 24h', price: 10000, unit: 'par projet', description: 'Traitement prioritaire de votre mixage ou montage vidéo.' },
  { id: 'opt-maquilleuse', name: 'Maquillage & Mise en beauté', price: 10000, unit: 'par personne', description: 'Préparation professionnelle avant séance shooting ou plateau TV.' }
];

export const INITIAL_EQUIPMENT: Equipment[] = [
  {
    id: 'EQ-CAM-01',
    name: 'Sony FX3 Cinema Line',
    category: 'camera',
    serial_number: 'SN-FX3-88210',
    replacement_value: 2500000,
    quantity: 1,
    available_quantity: 1,
    condition: 'neuf',
    is_rentable: true,
    daily_price: 35000,
    deposit_required: 200000,
    description: 'Caméra cinéma plein format 4K 120fps, profil S-Cinetone, poignée XLR audio professionnelle.',
    photos: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80'],
    qr_code_data: '7T-EQ-CAM-01',
    partner_owned: true,
    created_at: '2026-10-01T08:00:00Z'
  },
  {
    id: 'EQ-CAM-02',
    name: 'Sony Alpha 7 IV (Boîtier)',
    category: 'camera',
    serial_number: 'SN-A7IV-44912',
    replacement_value: 1800000,
    quantity: 1,
    available_quantity: 0,
    condition: 'excellent',
    is_rentable: true,
    daily_price: 25000,
    deposit_required: 150000,
    description: 'Boîtier hybride 33 Mpx, idéal vidéo et photo pro avec autofocus œil en temps réel.',
    photos: ['https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80'],
    qr_code_data: '7T-EQ-CAM-02',
    partner_owned: true,
    created_at: '2026-10-01T08:00:00Z'
  },
  {
    id: 'EQ-OPT-01',
    name: 'Objectif Sony GM 24-70mm f/2.8 II',
    category: 'optique',
    serial_number: 'SN-GM2470-3301',
    replacement_value: 1400000,
    quantity: 1,
    available_quantity: 1,
    condition: 'excellent',
    is_rentable: true,
    daily_price: 15000,
    deposit_required: 100000,
    description: 'Zoom standard professionnel d\'une netteté exceptionnelle.',
    photos: ['https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&w=800&q=80'],
    qr_code_data: '7T-EQ-OPT-01',
    partner_owned: true,
    created_at: '2026-10-01T08:00:00Z'
  },
  {
    id: 'EQ-AUD-01',
    name: 'Micro Studio Shure SM7B',
    category: 'audio',
    serial_number: 'SN-SHURE-5501',
    replacement_value: 320000,
    quantity: 2,
    available_quantity: 2,
    condition: 'excellent',
    is_rentable: true,
    daily_price: 10000,
    deposit_required: 50000,
    description: 'Micro dynamique légendaire pour voix broadcast, rap et podcasts.',
    photos: ['https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80'],
    qr_code_data: '7T-EQ-AUD-01',
    partner_owned: true,
    created_at: '2026-10-01T08:00:00Z'
  },
  {
    id: 'EQ-LUM-01',
    name: 'Projecteur Cinéma Aputure LS 300d II',
    category: 'lumiere',
    serial_number: 'SN-APUT-300D-01',
    replacement_value: 750000,
    quantity: 2,
    available_quantity: 2,
    condition: 'bon',
    is_rentable: true,
    daily_price: 15000,
    deposit_required: 60000,
    description: 'Lumière continue 5500K puissante avec monture Bowens et dôme 90cm.',
    photos: ['https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80'],
    qr_code_data: '7T-EQ-LUM-01',
    partner_owned: true,
    created_at: '2026-10-01T08:00:00Z'
  },
  {
    id: 'EQ-STA-01',
    name: 'Stabilisateur DJI RS 3 Pro Combo',
    category: 'stabilisateur',
    serial_number: 'SN-DJI-RS3P-71',
    replacement_value: 650000,
    quantity: 1,
    available_quantity: 0,
    condition: 'excellent',
    is_rentable: true,
    daily_price: 15000,
    deposit_required: 50000,
    description: 'Gimbal cinéma avec moteur focus LiDAR et transmetteur vidéo.',
    photos: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80'],
    qr_code_data: '7T-EQ-STA-01',
    partner_owned: true,
    created_at: '2026-10-01T08:00:00Z'
  },
  {
    id: 'EQ-DRN-01',
    name: 'Drone DJI Mini 4 Pro Fly More Combo',
    category: 'drone',
    serial_number: 'SN-DJI-M4P-302',
    replacement_value: 850000,
    quantity: 1,
    available_quantity: 1,
    condition: 'neuf',
    is_rentable: true,
    daily_price: 20000,
    deposit_required: 75000,
    description: 'Drone 4K HDR vertical avec évitement d\'obstacles omnidirectionnel.',
    photos: ['https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80'],
    qr_code_data: '7T-EQ-DRN-01',
    partner_owned: true,
    created_at: '2026-10-01T08:00:00Z'
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bk-001',
    booking_number: '7T-BK-2026-101',
    client_name: 'Ousmane Sow',
    client_phone: '+221 77 444 55 66',
    client_email: 'ousmane@rapthies.com',
    space_id: 'studio-son',
    service_id: 'pack-son-complet',
    start_time: '2026-11-02T14:00:00Z',
    end_time: '2026-11-02T18:00:00Z',
    options_selected: [{ id: 'opt-montage-rush', name: 'Livraison Express en 24h', price: 10000 }],
    total_amount: 45000,
    deposit_amount: 22500,
    paid_amount: 22500,
    status: 'confirmee',
    source: 'web',
    notes: 'Enregistrement nouveau titre avec chœurs',
    is_noisy: false,
    created_at: '2026-10-28T10:30:00Z'
  },
  {
    id: 'bk-002',
    booking_number: '7T-BK-2026-102',
    client_name: 'Mariama Diallo',
    client_phone: '+221 70 888 99 00',
    client_email: 'mariama.d@media.sn',
    space_id: 'plateau-tv',
    service_id: 'pack-podcast-complet',
    start_time: '2026-11-03T10:00:00Z',
    end_time: '2026-11-03T12:00:00Z',
    options_selected: [],
    total_amount: 40000,
    deposit_amount: 20000,
    paid_amount: 40000,
    status: 'payee',
    source: 'web',
    notes: 'Épisode 15 - Invité entrepreneur de Thiès',
    is_noisy: false,
    created_at: '2026-10-29T15:20:00Z'
  },
  {
    id: 'bk-003',
    booking_number: '7T-BK-2026-103',
    client_name: 'Samba Diallo',
    client_phone: '+221 76 555 44 33',
    space_id: 'salle-shooting',
    service_id: 'pack-photo-artiste',
    start_time: '2026-11-04T15:00:00Z',
    end_time: '2026-11-04T16:00:00Z',
    options_selected: [{ id: 'opt-maquilleuse', name: 'Maquillage & Mise en beauté', price: 10000 }],
    total_amount: 35000,
    deposit_amount: 17500,
    paid_amount: 17500,
    status: 'confirmee',
    source: 'telephone',
    notes: 'Photos pour book mannequin',
    is_noisy: false,
    created_at: '2026-10-30T09:15:00Z'
  }
];

export const INITIAL_RENTALS: Rental[] = [
  {
    id: 'rent-001',
    rental_number: '7T-LOC-2026-08',
    client_name: 'Ibrahima Cissé (Sunu Brand)',
    client_phone: '+221 76 111 22 33',
    client_id_card: 'CNI 1 254 1992 04512',
    equipment_id: 'EQ-CAM-02',
    equipment_name: 'Sony Alpha 7 IV (Boîtier)',
    quantity: 1,
    start_date: '2026-10-30',
    end_date: '2026-11-02',
    days_count: 3,
    total_price: 75000,
    deposit_amount: 150000,
    deposit_paid: true,
    condition_out: 'Impeccable, écran protégé, capteur propre, 2 batteries chargées',
    photos_out: ['https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=400&q=80'],
    status: 'en_cours',
    notes: 'Tournage spot pub zone industrielle Thiès',
    created_at: '2026-10-30T08:00:00Z'
  },
  {
    id: 'rent-002',
    rental_number: '7T-LOC-2026-09',
    client_name: 'Abdoulaye Bâ',
    client_phone: '+221 77 333 88 99',
    client_id_card: 'CNI 1 889 1995 99120',
    equipment_id: 'EQ-STA-01',
    equipment_name: 'Stabilisateur DJI RS 3 Pro Combo',
    quantity: 1,
    start_date: '2026-10-31',
    end_date: '2026-11-01',
    days_count: 1,
    total_price: 15000,
    deposit_amount: 50000,
    deposit_paid: true,
    condition_out: 'Complet dans mallette avec câbles et focus motor',
    status: 'en_cours',
    notes: 'Clip musical au Monument du Rail',
    created_at: '2026-10-31T07:30:00Z'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  // Charges fixes (300 000 FCFA)
  {
    id: 'tx-001',
    date: '2026-10-01',
    type: 'sortie',
    category: 'loyer',
    amount: 150000,
    description: 'Loyer mensuel appartement studio Thiès (Quartier Dixième)',
    receipt_photo_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
    payment_method: 'virement',
    is_fixed_charge: true,
    created_by_name: 'Modou Fall',
    created_at: '2026-10-01T09:00:00Z'
  },
  {
    id: 'tx-002',
    date: '2026-10-03',
    type: 'sortie',
    category: 'electricite',
    amount: 48500,
    description: 'Recharge Woyofal Senelec climatisation & régie',
    receipt_photo_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
    payment_method: 'orange_money',
    is_fixed_charge: true,
    created_by_name: 'Modou Fall',
    created_at: '2026-10-03T11:00:00Z'
  },
  {
    id: 'tx-003',
    date: '2026-10-04',
    type: 'sortie',
    category: 'wifi',
    amount: 27900,
    description: 'Fibre Orange Pro 100 Mbps studio',
    receipt_photo_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
    payment_method: 'wave',
    is_fixed_charge: true,
    created_by_name: 'Modou Fall',
    created_at: '2026-10-04T10:30:00Z'
  },
  {
    id: 'tx-004',
    date: '2026-10-05',
    type: 'sortie',
    category: 'eau',
    amount: 11200,
    description: 'Facture Sen\'Eau consommation studio',
    receipt_photo_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
    payment_method: 'wave',
    is_fixed_charge: true,
    created_by_name: 'Modou Fall',
    created_at: '2026-10-05T09:15:00Z'
  },
  {
    id: 'tx-005',
    date: '2026-10-06',
    type: 'sortie',
    category: 'publicite',
    amount: 35000,
    description: 'Publicité sponsorisée Instagram/TikTok Thiès & Dakar',
    receipt_photo_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
    payment_method: 'wave',
    is_fixed_charge: true,
    created_by_name: 'Modou Fall',
    created_at: '2026-10-06T14:00:00Z'
  },
  {
    id: 'tx-006',
    date: '2026-10-07',
    type: 'sortie',
    category: 'consommables',
    amount: 14500,
    description: 'Café touba, thé ataya, eau minérale et piles micros',
    receipt_photo_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
    payment_method: 'especes',
    is_fixed_charge: true,
    created_by_name: 'Awa Ndiaye',
    created_at: '2026-10-07T16:00:00Z'
  },
  {
    id: 'tx-007',
    date: '2026-10-08',
    type: 'sortie',
    category: 'transport',
    amount: 12900,
    description: 'Carburant transport équipe tournage',
    receipt_photo_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
    payment_method: 'especes',
    is_fixed_charge: true,
    created_by_name: 'Babacar Seck',
    created_at: '2026-10-08T18:00:00Z'
  },
  // Recettes du mois (Total = 660 000 FCFA -> objectif de 630 000 FCFA dépassé !)
  {
    id: 'tx-101',
    date: '2026-10-05',
    type: 'entree',
    category: 'prestations',
    amount: 70000,
    description: 'Enregistrement album 2 titres Ousmane Sow',
    payment_method: 'wave',
    created_by_name: 'Awa Ndiaye',
    created_at: '2026-10-05T19:00:00Z'
  },
  {
    id: 'tx-102',
    date: '2026-10-09',
    type: 'entree',
    category: 'prestations',
    amount: 40000,
    description: 'Pack Podcast Voix du Rail épisode 13',
    payment_method: 'orange_money',
    created_by_name: 'Babacar Seck',
    created_at: '2026-10-09T17:30:00Z'
  },
  {
    id: 'tx-103',
    date: '2026-10-12',
    type: 'entree',
    category: 'prestations',
    amount: 140000,
    description: 'Abonnement Créateur Entreprise Sunu Brand (4 épisodes)',
    payment_method: 'virement',
    created_by_name: 'Modou Fall',
    created_at: '2026-10-12T10:00:00Z'
  },
  {
    id: 'tx-104',
    date: '2026-10-16',
    type: 'entree',
    category: 'prestations',
    amount: 150000,
    description: 'Prestation Réalisation Clip Vidéo Artiste Thiès',
    payment_method: 'wave',
    created_by_name: 'Modou Fall',
    created_at: '2026-10-16T16:00:00Z'
  },
  {
    id: 'tx-105',
    date: '2026-10-20',
    type: 'entree',
    category: 'materiel',
    amount: 75000,
    description: 'Location 3 jours Sony A7IV + optiques',
    payment_method: 'wave',
    created_by_name: 'Babacar Seck',
    created_at: '2026-10-20T12:00:00Z'
  },
  {
    id: 'tx-106',
    date: '2026-10-23',
    type: 'entree',
    category: 'prestations',
    amount: 50000,
    description: '2 Packs Photo Artiste lookbook',
    payment_method: 'especes',
    created_by_name: 'Awa Ndiaye',
    created_at: '2026-10-23T18:00:00Z'
  },
  {
    id: 'tx-107',
    date: '2026-10-27',
    type: 'entree',
    category: 'prestations',
    amount: 75000,
    description: 'Formation Week-end MAO (3 inscrits)',
    payment_method: 'wave',
    created_by_name: 'Modou Fall',
    created_at: '2026-10-27T14:30:00Z'
  },
  {
    id: 'tx-108',
    date: '2026-10-29',
    type: 'entree',
    category: 'prestations',
    amount: 60000,
    description: 'Sessions mixage et mastering 2 singles',
    payment_method: 'wave',
    created_by_name: 'Awa Ndiaye',
    created_at: '2026-10-29T20:00:00Z'
  }
];

export const INITIAL_SETTINGS: SettingsConfig = {
  label_info: {
    name: 'Seven Truth Label & Media',
    city: 'Thiès',
    country: 'Sénégal',
    address: 'Quartier Dixième, près de l\'Avenue Aynina Fall, Thiès',
    phone: '+221 77 123 45 67',
    whatsapp: '221771234567',
    email: 'contact@seventruth.sn'
  },
  financial_rules: {
    monthly_fixed_charges_target: 300000,
    monthly_revenue_goal: 630000,
    equipment_reserve_pct: 10,
    team_split_pct: 50,
    patron_split_pct: 30,
    reinvestment_pct: 20
  },
  noise_regulations: {
    allowed_days: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    start_hour: 10,
    end_hour: 19,
    warning_message: 'En accord avec le propriétaire et le voisinage à Thiès, les instruments à percussion (batterie, sabar) sont limités à la plage 10h–19h du lundi au samedi.'
  },
  booking_rules: {
    deposit_percentage: 50,
    free_cancellation_hours: 48,
    auto_reminder_hours: 24
  }
};

export const INITIAL_PORTFOLIO: PortfolioItem[] = [
  {
    id: 'port-01',
    title: 'Ndoxum Thiès (Single)',
    artist: 'Ousmane Sow ft. Aida',
    category: 'audio',
    media_url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
    thumbnail_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    duration: '3:45',
    year: '2026',
    featured: true
  },
  {
    id: 'port-02',
    title: 'Lumières du Rail (Session Acoustique)',
    artist: 'Khadim & Le Sabar Band',
    category: 'audio',
    media_url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=tropical-summer-10874.mp3',
    thumbnail_url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80',
    duration: '4:12',
    year: '2026',
    featured: true
  },
  {
    id: 'port-03',
    title: 'Podcast "Voix du Rail" — Épisode 14',
    artist: 'Mariama Diallo avec Pr. Ndiaye',
    category: 'video',
    media_url: 'https://www.youtube.com/embed/ScMzIvxBSi4',
    thumbnail_url: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80',
    duration: '42:10',
    year: '2026',
    featured: true
  },
  {
    id: 'port-04',
    title: 'Collection Mode Thiès Wax 2026',
    artist: 'Maison Sokhna',
    category: 'photo',
    media_url: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1200&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=600&q=80',
    duration: '12 clichés HD',
    year: '2026',
    featured: true
  }
];

export const INITIAL_ARTISTS: Artist[] = [
  {
    id: 'art-01',
    name: 'Ousmane Sow',
    genre: 'Afro-Rap / Wolof Fusion',
    bio: 'Artiste thiessois mêlant verbe engagé, mélodies traditionnelles et beats modernes produits au studio Seven Truth.',
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    active: true
  },
  {
    id: 'art-02',
    name: 'Sokhna Diarra',
    genre: 'Neo Soul & Acoustique',
    bio: 'Auteure-compositrice à la voix envoûtante, révélation de la scène acoustique thiessoise.',
    photo_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    active: true
  },
  {
    id: 'art-03',
    name: 'Thiès Beat Collective',
    genre: 'Beatmaking & Trap Sabar',
    bio: 'Collectif de producteurs et sound designers résidents explorant les polyrythmies du sabar appliquées aux productions urbaines.',
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    active: true
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-01',
    client_name: 'Cheikh Kane',
    client_type: 'Artiste Rappeur',
    rating: 5,
    comment: 'Le meilleur studio de Thiès sans hésiter ! L\'acoustique de la cabine est propre et Modou à la console sait exactement comment sublimer une voix.',
    service: 'Pack Single Clé en Main',
    verified: true,
    created_at: '2026-10-24'
  },
  {
    id: 'rev-02',
    client_name: 'Mariama Diallo',
    client_type: 'Podcasteuse',
    rating: 5,
    comment: 'Le plateau TV offre un rendu ultra pro qui rivalise avec les télés de Dakar. Mes auditeurs ont tout de suite remarqué le saut qualitatif !',
    service: 'Pack Épisode Podcast',
    verified: true,
    created_at: '2026-10-26'
  },
  {
    id: 'rev-03',
    client_name: 'Abdoulaye Bâ',
    client_type: 'Réalisateur Clip',
    rating: 5,
    comment: 'Matériel loué en parfait état (FX3 + optique GM). Caution restituée le jour même après vérification. Service transparent et sérieux.',
    service: 'Location Sony FX3',
    verified: true,
    created_at: '2026-10-28'
  },
  {
    id: 'rev-04',
    client_name: 'Aïssatou Seck',
    client_type: 'Créatrice de Mode',
    rating: 5,
    comment: 'Shooting pour ma nouvelle collection de robes. L\'équipe est ponctuelle, les flashs et le cyclo blanc sont impeccables.',
    service: 'Pack Photo Artiste',
    verified: true,
    created_at: '2026-10-29'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 1,
    timestamp: '2026-10-01T09:05:00Z',
    user_name: 'Modou Fall',
    user_role: 'admin',
    action: 'INSERT',
    table_name: 'transactions',
    record_id: 'tx-001',
    new_data: { description: 'Loyer mensuel appartement studio Thiès', amount: 150000, category: 'loyer' }
  },
  {
    id: 2,
    timestamp: '2026-10-28T10:30:00Z',
    user_name: 'Client (Web)',
    user_role: 'client',
    action: 'INSERT',
    table_name: 'bookings',
    record_id: 'bk-001',
    new_data: { booking_number: '7T-BK-2026-101', client_name: 'Ousmane Sow', total_amount: 45000 }
  },
  {
    id: 3,
    timestamp: '2026-10-30T08:00:00Z',
    user_name: 'Babacar Seck',
    user_role: 'staff',
    action: 'INSERT',
    table_name: 'rentals',
    record_id: 'rent-001',
    new_data: { rental_number: '7T-LOC-2026-08', equipment_id: 'EQ-CAM-02', client_name: 'Ibrahima Cissé' }
  }
];
