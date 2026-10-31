# SEVEN TRUTH — Plateforme Web Complète (Site Vitrine & Back-Office)

> **Label musical & média indépendant installé à Thiès, Sénégal.**  
> Studio d'enregistrement insonorisé, plateau TV & podcast, salle shooting photo et location de matériel de tournage.

---

## 1. Présentation du Projet

Cette plateforme web tout-en-un répond aux besoins de production et de gestion du label **Seven Truth** situé à Thiès (Quartier Dixième) :

1. **Site Vitrine Public Haut de Gamme** :
   - Direction artistique sombre et dorée (fond `#0b0b0e`, or `#e8b23a`, touches violettes néon).
   - **Hero 3D interactif** : disque vinyle et ondes de particules Three.js avec logo central 7T, optimisé pour les smartphones Android d'entrée de gamme et connexions 3G/4G (limitation DPR à 1.5, arrêt du rendu hors écran, respect de `prefers-reduced-motion`).
   - Présentation détaillée des 3 espaces de création.
   - Grille complète des formules et packs clé en main.
   - Catalogue de location de matériel avec stock en direct.
   - Portfolio interactif avec lecteur audio streaming et vidéos intégrées.
   - **Parcours de réservation instantané** avec blocage temps réel des créneaux, sélection d'options, calcul automatique du prix, acompte de 50 % via **Wave** ou **Orange Money**, lien WhatsApp `wa.me` pré-rempli et reçu PDF imprimable.
   - Respect strict de la réglementation du voisinage (créneaux de Batterie / Sabar restreints de 10h à 19h).

2. **Back-Office de Gestion Privé & Transparent** :
   - **Tableau de bord** : recettes, dépenses, bénéfice net, reste à encaisser, heures réservées, matériel dehors et progression vers l'objectif de rentabilité (300 000 FCFA charges fixes / 630 000 FCFA objectif).
   - **Calendrier & Planning** : gestion des séances, changement de statut (*En attente → Confirmée → Payée → Terminée / Annulée*) et saisie manuelle téléphonique.
   - **Location de Matériel** : contrat de sortie avec CNI/passeport et état de départ, retour avec contrôle d'état et retenue de caution en cas de dégradation.
   - **Inventaire Permanent & QR Codes** : fiches par article avec photo et n° de série, génération d'étiquettes QR imprimables, module d'inventaire mensuel guidé avec détection d'écarts.
   - **Finances & Caisse des Charges** : traçabilité complète de chaque franc, **photo du reçu obligatoire pour toute dépense**, caisse de charges fixes séparée.
   - **Moteur de Clôture Mensuelle** : calcul automatique de la répartition des bénéfices :
     - Charges fixes en priorité (300 000 FCFA).
     - **10 % Réserve Matériel** (renouvellement du parc).
     - Solde partagé à **50 % Équipe / 30 % Patron (Investisseur) / 20 % Réinvestissement**.
   - **Journal d'Audit Immuable (Append-Only)** : table protégée contre toute modification ou suppression, traçant l'auteur, l'action, l'horodatage et l'écart *Ancienne valeur → Nouvelle valeur*.
   - **CRM Clients** avec export CSV.

---

## 2. Stack Technique

- **Framework** : Next.js 14+ (App Router) + React 18 + TypeScript
- **Styling** : Tailwind CSS + Lucide Icons + Space Grotesk / Inter Google Fonts
- **3D & Rendu WebGL** : React Three Fiber (`@react-three/fiber`) + Three.js (`three`) + Canvas Confetti
- **QR Codes** : `qrcode`
- **Base de Données & Auth** : Supabase PostgreSQL avec extension `btree_gist` (contrainte d'exclusion temporelle anti-doublon) + Storage + Row Level Security (RLS)
- **Paiements Mobiles** : Intégration Wave Sénégal & Orange Money via API PayTech / Agrégateur avec signature sécurisée
- **Format Monétaire & Fuseau** : FCFA (XOF) sans décimales (`15 000 FCFA`), fuseau horaire `Africa/Dakar` (UTC)

---

## 3. Structure du Code Source

```
seven-truth/
├── public/
│   └── manifest.json                    # Configuration PWA mobile
├── src/
│   ├── app/
│   │   ├── admin/                       # Back-office de gestion
│   │   │   ├── audit/page.tsx           # Journal d'audit inviolable
│   │   │   ├── calendrier/page.tsx      # Planning interactif des 3 espaces
│   │   │   ├── clients/page.tsx         # Répertoire clients & export CSV
│   │   │   ├── finances/page.tsx        # Comptabilité & Caisse charges
│   │   │   ├── inventaire/page.tsx      # Matériel, QR Codes & Inventaire
│   │   │   ├── locations/page.tsx       # Gestion des sorties et retours de prêt
│   │   │   ├── parametres/page.tsx      # Configuration studio & plages sonores
│   │   │   ├── rapports/page.tsx        # Compte rendu mensuel PDF
│   │   │   ├── layout.tsx               # Shell d'administration
│   │   │   └── page.tsx                 # Tableau de bord KPIs
│   │   ├── api/
│   │   │   ├── bookings/route.ts        # Validation serveur & anti-doublon
│   │   │   └── payments/paytech/route.ts# Passerelle de paiement Wave / OM
│   │   ├── a-propos/page.tsx            # Histoire, équipe & valeurs du label
│   │   ├── artistes/page.tsx            # Fiches artistes et beatmakers
│   │   ├── contact/page.tsx             # Accès studio Thiès, WhatsApp & carte
│   │   ├── espace-client/page.tsx       # Consultation réservations et reçus
│   │   ├── espaces/page.tsx             # Présentation détaillée des cabines
│   │   ├── formations/page.tsx          # Masterclasses et formations
│   │   ├── formules/page.tsx            # Grille complète des packs
│   │   ├── materiel/page.tsx            # Catalogue de location public
│   │   ├── portfolio/page.tsx           # Lecteur audio & vidéos
│   │   ├── reserver/page.tsx            # Parcours de réservation interactif
│   │   ├── globals.css                  # Thème nuit & scrollbars
│   │   ├── layout.tsx                   # Layout global avec barre de test RLS
│   │   └── page.tsx                     # Accueil vitrine avec Hero 3D
│   ├── components/
│   │   ├── 3d/                          # Vinyle 3D & ondes de particules R3F
│   │   ├── admin/                       # Modules du back-office
│   │   ├── booking/                     # Wizard de réservation & calendrier
│   │   ├── layout/                      # Navbar, Footer, Sélecteur de rôle
│   │   └── portfolio/                   # Lecteur audio interactif
│   └── lib/
│       ├── store/                       # Store local avec persistance & seed
│       ├── supabase/                    # Connecteur Supabase Client / Server
│       ├── types/                       # Définitions TypeScript complètes
│       └── utils/                       # Devises, dates, WhatsApp, vérification bruit
├── supabase/
│   ├── migrations/
│   │   └── 20261031000000_seven_truth_init.sql # Schéma, contraintes GiST & RLS
│   └── seed.sql                         # Données réalistes pour Thiès (Octobre 2026)
├── GUIDE_UTILISATION.md                 # Manuel opératoire pour l'équipe
├── CHECKLIST_LANCEMENT.md               # Liste de vérification pré-production
├── .env.example                         # Modèle de variables d'environnement
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 4. Installation & Démarrage Local

### Prérequis
- Node.js version 18 ou supérieure (v20 recommandé)
- npm version 9 ou supérieure

### Instructions
1. Cloner ou ouvrir le projet :
   ```bash
   cd /home/falilou/Bureau/seven-truth
   ```
2. Installer les dépendances :
   ```bash
   npm install
   ```
3. Lancer le serveur de développement :
   ```bash
   npm run dev
   ```
4. Ouvrir votre navigateur sur [http://localhost:3000](http://localhost:3000).

---

## 5. Déploiement de la Base de Données (Supabase)

1. Créez un projet sur [Supabase](https://supabase.com).
2. Rendez-vous dans **SQL Editor** et exécutez le fichier de migration :
   ```sql
   -- Contenu de supabase/migrations/20261031000000_seven_truth_init.sql
   ```
3. Exécutez le script de données initiales :
   ```sql
   -- Contenu de supabase/seed.sql
   ```
4. Récupérez vos clés dans **Project Settings > API** et renseignez votre fichier `.env.local` :
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
   SUPABASE_SERVICE_ROLE_KEY=votre_cle_service_role
   ```

---

## 6. Tester les Rôles et la Transparence

En haut de l'écran se trouve la barre **« Mode Test RLS »** qui permet de basculer instantanément entre les profils :

- **Admin (Gérant)** : Modou Fall a les pleins pouvoirs (ajout, modification, validation).
- **Le Patron (Investisseur)** : Cheikh Diop est en **lecture seule**. Les boutons d'ajout/modification sont désactivés ou masqués, mais il a une visibilité intégrale sur toutes les finances, les photos de reçus, l'inventaire physique et le journal d'audit immuable.
- **Staff** : Accès opérationnel aux saisies de terrain, interdiction d'altérer les tarifs unilatéralement.
- **Client** : Accès grand public et espace personnel.

---

## 7. Contacts & Support

- **Label Seven Truth** : Quartier Dixième, Thiès, Sénégal
- **WhatsApp Direct** : `+221 77 123 45 67`
- **Email** : `contact@seventruth.sn`
