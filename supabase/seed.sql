-- ==============================================================================
-- SEVEN TRUTH — Seed Data (Données de démonstration réalistes - Thiès, Sénégal)
-- ==============================================================================

-- 1. PROFILS
INSERT INTO profiles (id, full_name, phone, email, role, tag, notes) VALUES
('a0000000-0000-0000-0000-000000000001', 'Modou Fall (Admin & Gérant)', '+221771234567', 'admin@seventruth.sn', 'admin', 'créateur', 'Gérant principal du studio'),
('a0000000-0000-0000-0000-000000000002', 'Cheikh Diop (Le Patron / Investisseur)', '+221779876543', 'patron@seventruth.sn', 'patron', 'entreprise', 'Fournisseur du parc matériel - Accès lecture seule'),
('a0000000-0000-0000-0000-000000000003', 'Awa Ndiaye (Ingénieure Son & Staff)', '+221783334455', 'awa@seventruth.sn', 'staff', 'artiste', 'Ingénieure son & régisseuse'),
('a0000000-0000-0000-0000-000000000004', 'Babacar Seck (Cadreur / Monteur)', '+221762221100', 'babacar@seventruth.sn', 'staff', 'créateur', 'Responsable vidéo et plateau TV'),
('b0000000-0000-0000-0000-000000000001', 'Ousmane Sow (Artiste - Thies Rap)', '+221774445566', 'ousmane@rapthies.com', 'client', 'artiste', 'Artiste régulier, album en préparation'),
('b0000000-0000-0000-0000-000000000002', 'Mariama Diallo (Podcasteuse)', '+221708889900', 'mariama.d@media.sn', 'client', 'créateur', 'Animatrice du podcast "Voix du Rail"'),
('b0000000-0000-0000-0000-000000000003', 'Ibrahima Cissé (Agence Sunu Brand)', '+221761112233', 'cisse@sunubrand.sn', 'client', 'entreprise', 'Tournages publicitaires récurrents')
ON CONFLICT (id) DO NOTHING;

-- 2. ESPACES
INSERT INTO spaces (id, name, slug, description, hourly_rate, noisy_allowed, noisy_start_hour, noisy_end_hour, photos, equipment_included, capacity) VALUES
('studio-son', 'Studio Son Pro', 'studio-son', 'Pièce insonorisée "pièce dans la pièce" traitée acoustiquement. Idéale pour l''enregistrement voix, beatmaking, mixage & mastering. Batterie & sabar autorisés sur créneaux convenus.', 10000, true, 10, 19, ARRAY['https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80'], ARRAY['Micro Shure SM7B', 'Rode NT1-A', 'Apollo Twin X', 'Monitoring Yamaha HS8', 'Clavier Maître Arturia KeyLab 61'], 5),
('plateau-tv', 'Plateau TV & Podcast', 'plateau-tv', 'Plateau multi-caméras insonorisé avec setup lumière 3 points, micros cravate et podcast, fond personnalisable (néon Seven Truth, fond sombre, rideau acoustique).', 15000, false, 9, 21, ARRAY['https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=800&q=80'], ARRAY['3 Caméras Sony Cinema Line', 'Console Rodecaster Pro II', 'Micros PodMic', 'Projecteurs Aputure 300d II', 'Prompteur Pro'], 8),
('salle-shooting', 'Salle Shooting Photo & Mode', 'salle-shooting', 'Cyclorama blanc & dérouleur de fonds papier couleur (noir, terracotta, vert émeraude, jaune or). Espace maquillage et cabine d''habillage sur place.', 12000, false, 9, 21, ARRAY['https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1200&q=80'], ARRAY['2 Flashs Godox AD600 Pro', 'Boîtes à lumière octogonales 120cm', 'Gélatines couleur', 'Fonds vinyle & papier'], 6)
ON CONFLICT (id) DO UPDATE SET
name = EXCLUDED.name,
hourly_rate = EXCLUDED.hourly_rate;

-- 3. SERVICES & FORMULES
INSERT INTO services (id, space_id, category, name, description, price, duration_hours, deposit_percentage, is_noisy, allow_cash, featured) VALUES
('studio-heure', 'studio-son', 'studio', 'Studio Son à l''heure', 'Session d''enregistrement ou de mixage assistée par notre ingénieur du son.', 10000, 1.0, 50, false, true, false),
('pack-son-complet', 'studio-son', 'pack', 'Pack Single Clé en Main (Rec + Mix + Master)', 'Enregistrement complet voix/instruments (jusqu''à 4h de studio) + Mixage professionnel + Mastering prêt pour streaming.', 35000, 4.0, 50, false, true, true),
('beat-exclusif', 'studio-son', 'studio', 'Composition Beat Exclusif', 'Création sur mesure d''une production originale avec cession des droits exclusifs.', 30000, 2.0, 50, false, true, false),
('session-batterie-sabar', 'studio-son', 'studio', 'Session Percussions & Sabar (Réglementée)', 'Prise de son batterie ou tam-tam/sabar en cabine insonorisée. Strictement autorisé de 10h à 19h.', 15000, 1.0, 50, true, false, false),
('podcast-heure', 'plateau-tv', 'podcast', 'Plateau Podcast à l''heure', 'Location du plateau équipé (3 micros Rode, lumières cinéma, fond 7T) avec technicien pour la prise.', 15000, 1.0, 50, false, true, false),
('pack-podcast-complet', 'plateau-tv', 'pack', 'Pack Épisode Podcast (1h + Montage vidéo)', '1h d''enregistrement multi-caméras 4K + mix audio + montage dynamique livré en 48h avec chapitrage.', 40000, 2.0, 50, false, true, true),
('abonnement-createur', 'plateau-tv', 'pack', 'Abonnement Créateur (4 épisodes / mois)', 'Idéal pour podcasteurs et YouTubers récurrents. 4 sessions de 1h30 + montage inclus.', 140000, 6.0, 30, false, false, true),
('pack-photo-artiste', 'salle-shooting', 'photo', 'Pack Shooting Artiste / Mode', '1h de shooting studio + 10 photos retouchées haute définition (pochette, promo réseaux).', 25000, 1.0, 50, false, true, true),
('montage-video-court', NULL, 'video', 'Montage Vidéo Courte (TikTok / Reels)', 'Montage dynamique avec sous-titres animés, sound design et étalonnage couleur.', 20000, 1.0, 50, false, true, false),
('clip-video-pro', NULL, 'video', 'Réalisation Clip Vidéo', 'Scénarisation, tournage à Thiès/Dakar (journée complète), cadreur, éclairage, drone, étalonnage cinéma.', 150000, 8.0, 50, false, false, true),
('couverture-evenement', NULL, 'evenement', 'Couverture Événementielle (Mariage / Baptême / Live)', 'Équipe photo & vidéo dédiée pour couvrir vos cérémonies et concerts avec restitution en album & teaser.', 100000, 6.0, 50, false, false, false),
('formation-week-end', 'studio-son', 'formation', 'Formation Beatmaking & MAO (Samedi-Dimanche)', '2 jours d''immersion pratique : composition FL Studio/Ableton, mixage voix et publication.', 25000, 8.0, 50, false, true, true)
ON CONFLICT (id) DO UPDATE SET
price = EXCLUDED.price,
name = EXCLUDED.name;

-- 4. OPTIONS
INSERT INTO booking_options (id, name, price, unit, description) VALUES
('opt-inge-son', 'Ingénieur du son dédié', 5000, 'par heure', 'Prise en charge complète des réglages, prises et conseils artistiques.'),
('opt-cadreur', 'Cadreur professionnel supplémentaire', 7500, 'par heure', 'Pour les tournages multi-angles dynamiques ou captation live.'),
('opt-montage-rush', 'Livraison Express en 24h', 10000, 'par projet', 'Traitement prioritaire de votre mixage ou montage vidéo.'),
('opt-maquilleuse', 'Maquillage & Mise en beauté', 10000, 'par personne', 'Préparation professionnelle avant séance shooting ou plateau TV.')
ON CONFLICT (id) DO NOTHING;

-- 5. MATÉRIEL (Équipement fourni par "le Patron")
INSERT INTO equipment (id, name, category, serial_number, replacement_value, quantity, available_quantity, condition, is_rentable, daily_price, deposit_required, description, photos, qr_code_data) VALUES
('EQ-CAM-01', 'Sony FX3 Cinema Line', 'camera', 'SN-FX3-88210', 2500000, 1, 1, 'neuf', true, 35000, 200000, 'Caméra cinéma plein format 4K 120fps, profil S-Cinetone, poignée XLR audio.', ARRAY['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80'], '7T-EQ-CAM-01'),
('EQ-CAM-02', 'Sony Alpha 7 IV (Boîtier)', 'camera', 'SN-A7IV-44912', 1800000, 1, 0, 'excellent', true, 25000, 150000, 'Boîtier hybride 33 Mpx, idéal vidéo et photo pro avec mise au point œil en temps réel.', ARRAY['https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80'], '7T-EQ-CAM-02'),
('EQ-OPT-01', 'Objectif Sony GM 24-70mm f/2.8 II', 'optique', 'SN-GM2470-3301', 1400000, 1, 1, 'excellent', true, 15000, 100000, 'Zoom standard professionnel d''une netteté exceptionnelle.', ARRAY['https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&w=800&q=80'], '7T-EQ-OPT-01'),
('EQ-OPT-02', 'Objectif Sony GM 85mm f/1.4', 'optique', 'SN-GM85-1192', 1100000, 1, 1, 'excellent', true, 12000, 80000, 'Objectif portrait par excellence avec bokeh crémeux pour clips et shooting.', ARRAY['https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&w=800&q=80'], '7T-EQ-OPT-02'),
('EQ-AUD-01', 'Micro Studio Shure SM7B', 'audio', 'SN-SHURE-5501', 320000, 2, 2, 'excellent', true, 10000, 50000, 'Micro dynamique légendaire pour voix broadcast, rap et podcasts.', ARRAY['https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80'], '7T-EQ-AUD-01'),
('EQ-AUD-02', 'Kit Micros Cravate Sans Fil Rode Wireless PRO', 'audio', 'SN-RODE-PRO-201', 280000, 1, 1, 'neuf', true, 10000, 40000, 'Kit 2 émetteurs + 1 récepteur avec enregistrement flottant 32 bits.', ARRAY['https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80'], '7T-EQ-AUD-02'),
('EQ-LUM-01', 'Projecteur Cinéma Aputure LS 300d II', 'lumiere', 'SN-APUT-300D-01', 750000, 2, 2, 'bon', true, 15000, 60000, 'Lumière puissante 5500K avec monture Bowens et dôme de diffusion 90cm.', ARRAY['https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80'], '7T-EQ-LUM-01'),
('EQ-LUM-02', 'Tubes LED Pixel Nanlite Pavotube II 30X (Paire)', 'lumiere', 'SN-NAN-PAVO-99', 420000, 1, 1, 'excellent', true, 10000, 40000, 'Tubes RVB programmables avec effets néon studio pour clips musicaux.', ARRAY['https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80'], '7T-EQ-LUM-02'),
('EQ-STA-01', 'Stabilisateur DJI RS 3 Pro Combo', 'stabilisateur', 'SN-DJI-RS3P-71', 650000, 1, 0, 'excellent', true, 15000, 50000, 'Gimbal cinéma avec moteur focus LiDAR et transmission vidéo sans fil.', ARRAY['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80'], '7T-EQ-STA-01'),
('EQ-DRN-01', 'Drone DJI Mini 4 Pro Fly More Combo', 'drone', 'SN-DJI-M4P-302', 850000, 1, 1, 'neuf', true, 20000, 75000, 'Drone 4K HDR vertical avec détection d''obstacles omnidirectionnelle.', ARRAY['https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80'], '7T-EQ-DRN-01')
ON CONFLICT (id) DO UPDATE SET
daily_price = EXCLUDED.daily_price,
replacement_value = EXCLUDED.replacement_value;

-- 6. PARAMÈTRES GLOBAUX
INSERT INTO settings (key, value, description) VALUES
('label_info', '{"name": "Seven Truth Label & Media", "city": "Thiès", "country": "Sénégal", "address": "Quartier Dixième, près de l''Avenue Aynina Fall, Thiès", "phone": "+221 77 123 45 67", "whatsapp": "+221771234567", "email": "contact@seventruth.sn"}'::jsonb, 'Coordonnées officielles du label'),
('financial_rules', '{"monthly_fixed_charges_target": 300000, "monthly_revenue_goal": 630000, "equipment_reserve_pct": 10, "team_split_pct": 50, "patron_split_pct": 30, "reinvestment_pct": 20}'::jsonb, 'Règles de répartition des bénéfices en fin de mois'),
('noise_regulations', '{"allowed_days": ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"], "start_hour": 10, "end_hour": 19, "warning_message": "En raison du respect du voisinage dans le bâtiment, les instruments à fort volume (batterie, sabar, tam-tam) sont limités à la plage 10h–19h."}'::jsonb, 'Réglementation sonore du studio à Thiès'),
('booking_rules', '{"deposit_percentage": 50, "free_cancellation_hours": 48, "auto_reminder_hours": 24}'::jsonb, 'Conditions d''acompte et d''annulation')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 7. TRANSACTIONS RÉCENTES (Mois d'Octobre 2026 - Contexte Thiès)
INSERT INTO transactions (id, date, type, category, amount, description, receipt_photo_url, payment_method, is_fixed_charge, created_by_name) VALUES
('t0000000-0000-0000-0000-000000000001', '2026-10-01', 'sortie', 'loyer', 150000, 'Loyer mensuel appartement studio Thiès - Propriétaire M. Fall', 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80', 'virement', true, 'Modou Fall'),
('t0000000-0000-0000-0000-000000000002', '2026-10-03', 'sortie', 'electricite', 48500, 'Facture Senelec Climatisation Studio + Plateau TV (Woyofal)', 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80', 'orange_money', true, 'Modou Fall'),
('t0000000-0000-0000-0000-000000000003', '2026-10-04', 'sortie', 'wifi', 27900, 'Abonnement Fibre Orange Pro 100 Mbps studio', 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80', 'wave', true, 'Modou Fall'),
('t0000000-0000-0000-0000-000000000004', '2026-10-05', 'sortie', 'eau', 11200, 'Facture Sen''Eau consommation eau studio & sanitaires', 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80', 'wave', true, 'Modou Fall'),
('t0000000-0000-0000-0000-000000000005', '2026-10-06', 'sortie', 'publicite', 35000, 'Campagne publicitaire Meta/Instagram ciblage Thiès & Dakar artistes', 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80', 'wave', true, 'Modou Fall'),
('t0000000-0000-0000-0000-000000000006', '2026-10-07', 'sortie', 'consommables', 14500, 'Pack café, thé ataya, eau minérale et lingettes nettoyage micros', 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80', 'especes', true, 'Awa Ndiaye'),
('t0000000-0000-0000-0000-000000000007', '2026-10-08', 'sortie', 'transport', 15000, 'Transport équipe déplacement tournage extérieur Somone', 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80', 'especes', true, 'Babacar Seck'),
-- Entrées du mois (Total > 600 000 FCFA pour illustrer le modèle sain)
('t0000000-0000-0000-0000-000000000010', '2026-10-05', 'entree', 'prestations', 35000, 'Paiement Pack Single Ousmane Sow (Rec + Mix)', NULL, 'wave', false, 'Awa Ndiaye'),
('t0000000-0000-0000-0000-000000000011', '2026-10-08', 'entree', 'prestations', 40000, 'Paiement Pack Podcast Épisode 12 Voix du Rail', NULL, 'orange_money', false, 'Babacar Seck'),
('t0000000-0000-0000-0000-000000000012', '2026-10-12', 'entree', 'prestations', 140000, 'Abonnement créateur mensuel Sunu Brand (4 émissions)', NULL, 'virement', false, 'Modou Fall'),
('t0000000-0000-0000-0000-000000000013', '2026-10-15', 'entree', 'prestations', 150000, 'Acompte tournage clip vidéo Artiste Thiès Centre', NULL, 'wave', false, 'Modou Fall'),
('t0000000-0000-0000-0000-000000000014', '2026-10-18', 'entree', 'materiel', 50000, 'Location Sony Alpha 7 IV (2 jours) par Agence Sunu Brand', NULL, 'wave', false, 'Babacar Seck'),
('t0000000-0000-0000-0000-000000000015', '2026-10-22', 'entree', 'prestations', 25000, 'Pack shooting photo pochette album', NULL, 'especes', false, 'Awa Ndiaye'),
('t0000000-0000-0000-0000-000000000016', '2026-10-25', 'entree', 'prestations', 50000, 'Formation week-end MAO (2 participants)', NULL, 'wave', false, 'Modou Fall')
ON CONFLICT (id) DO NOTHING;

-- 8. PORTFOLIO & RÉFÉRENCES
INSERT INTO portfolio_items (id, title, artist, category, media_url, thumbnail_url, duration, year, featured) VALUES
('port-01', 'Ndoxum Thiès (Single)', 'Ousmane Sow ft. Aida', 'audio', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80', '3:45', '2026', true),
('port-02', 'Lumières du Rail (Session Acoustique)', 'Khadim & Le Sabar Band', 'audio', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80', '4:12', '2026', true),
('port-03', 'Podcast "Voix du Rail" — Épisode 14', 'Mariama Diallo avec Pr. Ndiaye', 'video', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80', '42:10', '2026', true),
('port-04', 'Collection Mode Thiès Wax 2026', 'Maison Sokhna', 'photo', 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=600&q=80', '12 photos', '2026', true)
ON CONFLICT (id) DO NOTHING;

-- 9. ARTISTES DU LABEL
INSERT INTO artists (id, name, genre, bio, photo_url, active) VALUES
('art-01', 'Ousmane Sow', 'Afro-Rap / Mbalax Fusion', 'Figure montante de la scène musicale thiessoise, combinant flow percutant et mélodies wolof traditionnelles.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80', true),
('art-02', 'Sokhna Diarra', 'Neo Soul & Acoustique', 'Voix chaleureuse, auteur-compositrice enregistrant son premier EP 5 titres chez Seven Truth.', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80', true),
('art-03', 'Thiès Beat Collective', 'Beatmaking / Trap Wolof', 'Collectif de producteurs résidents au label créant les sonorités de demain pour l''Afrique de l''Ouest.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80', true)
ON CONFLICT (id) DO NOTHING;

-- 10. AVIS CLIENTS VÉRIFIÉS
INSERT INTO reviews (client_name, client_type, rating, comment, service, verified) VALUES
('Cheikh Kane', 'Artiste Rappeur', 5, 'Le meilleur studio de Thiès sans hésiter ! L''acoustique de la cabine est propre et Modou à la console sait exactement comment sublimer une voix.', 'Pack Single Clé en Main', true),
('Mariama Diallo', 'Podcasteuse', 5, 'Le plateau TV offre un rendu ultra pro qui rivalise avec les télés nationales à Dakar. Mes auditeurs ont tout de suite remarqué le saut qualitatif !', 'Pack Épisode Podcast', true),
('Abdoulaye Bâ', 'Réalisateur Clip', 5, 'Matériel loué en parfait état (FX3 + optique 24-70 GM). Caution restituée le jour même après vérification. Service transparent et sérieux.', 'Location Sony FX3', true),
('Aïssatou Seck', 'Créatrice de Mode', 5, 'Shooting pour ma nouvelle collection de robes. L''équipe est ponctuelle, les flashs et le cyclo blanc sont impeccables.', 'Pack Photo Artiste', true)
ON CONFLICT DO NOTHING;
