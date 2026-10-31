# Liste de Vérification de Lancement — Seven Truth

Ce document récapitule les étapes nécessaires avant l'ouverture officielle de la plateforme de production en ligne pour le public et l'équipe de Thiès.

---

## 1. Sécurité & Base de Données (Supabase Postgres)
- [x] Extension `pgcrypto` activée pour la génération de clés et jetons sécurisés.
- [x] Extension `btree_gist` activée pour l'exclusion temporelle `TSRANGE` anti-double réservation.
- [x] Row Level Security (RLS) activée sur toutes les tables sans exception.
- [x] Triggers d'audit append-only configurés (`prevent_audit_tampering` interdit tout `DELETE` et `UPDATE` sur `audit_log`).
- [x] Rôle « Patron » restreint à la lecture seule (`SELECT` uniquement sur l'ensemble du schéma).
- [x] Règle stricte : contrainte SQL `check_expense_has_receipt` interdisant toute sortie d'argent sans photo justificative.

## 2. Paiements Mobiles Sénégal (Wave & Orange Money)
- [x] Clés API PayTech / Wave de production renseignées dans les variables d'environnement Vercel.
- [x] Webhook endpoint `/api/payments/paytech` sécurisé avec vérification de signature SHA256.
- [x] Acompte de 50 % calculé automatiquement à la commande pour garantir la réservation.
- [x] Option « Paiement en espèces sur place » autorisée uniquement pour les services approuvés par l'Admin.

## 3. Matériel & Traçabilité (Le Patron)
- [x] Toutes les références matérielles (Sony FX3, A7IV, optiques GM, Shure SM7B, Aputure 300d II, drone DJI) inventoriées avec n° de série et valeur de remplacement.
- [x] QR codes générés pour chaque équipement et prêts à être imprimés pour collage sur les boîtes et valises Pelican.
- [x] Module de sortie avec saisie obligatoire de la CNI / Passeport et état photographique de départ.
- [x] Module de retour avec contrôle contradictoire et calcul automatique des retenues de caution si nécessaire.

## 4. Respect du Voisinage (Thiès)
- [x] Règle sonore intégrée au code (`isSlotAllowedForNoise`) : verrouillage strict des sessions Sabar, percussions et batterie en dehors de la plage autorisée (10h00 – 19h00 du lundi au samedi).
- [x] Messages d'avertissement clairs affichés sur le calendrier client et le formulaire de réservation.

## 5. Performance Mobile & Connexion 3G/4G
- [x] Scène 3D Hero allégée avec limitation automatique du DPR à 1.5 sur smartphone Android.
- [x] Détection de `prefers-reduced-motion` : bascule instantanée sur visuel statique SVG optimisé pour économie batterie et accessibilité.
- [x] Arrêt automatique du rendu WebGL via Intersection Observer lorsque l'utilisateur scroll au-delà de la section Hero.
- [x] Manifest PWA (`manifest.json`) présent pour l'installation en application native sur l'écran d'accueil du smartphone.

## 6. Référencement Local (SEO Thiès)
- [x] Balises Open Graph et Twitter Cards configurées.
- [x] Balisage JSON-LD `LocalBusiness` structuré avec adresse à Thiès (Quartier Dixième), coordonnées GPS, téléphone et horaires.
- [x] Mots-clés ciblés : *« studio d'enregistrement Thiès »*, *« location matériel vidéo Thiès »*, *« shooting photo Thiès »*.
