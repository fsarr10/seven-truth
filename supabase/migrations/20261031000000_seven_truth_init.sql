-- ==============================================================================
-- SEVEN TRUTH — Plateforme Web Complète (Thiès, Sénégal)
-- Migration d'initialisation Postgres & Supabase
-- Auteur : Seven Truth Architecture
-- Date : 2026-10-31
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'patron', 'staff', 'client');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE booking_status AS ENUM ('en_attente', 'confirmee', 'payee', 'terminee', 'annulee');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE rental_status AS ENUM ('reserve', 'en_cours', 'retourne', 'en_retard', 'litige', 'annule');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE equipment_condition AS ENUM ('neuf', 'excellent', 'bon', 'correct', 'maintenance', 'hors_service');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM ('wave', 'orange_money', 'especes', 'virement');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('en_attente', 'complete', 'echoue', 'rembourse');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_type AS ENUM ('entree', 'sortie');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_category AS ENUM (
        'loyer', 'electricite', 'eau', 'wifi', 'publicite', 
        'consommables', 'transport', 'maintenance', 'materiel', 
        'part_equipe', 'part_patron', 'reserve_materiel', 'prestations', 'autre'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES (Comptes utilisateurs, synchronisables avec Supabase Auth)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    role user_role NOT NULL DEFAULT 'client',
    tag TEXT DEFAULT 'artiste', -- 'artiste', 'créateur', 'entreprise', 'famille', 'particulier'
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour recherche rapide
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON profiles(phone);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- 4. SPACES (Espaces physiques à Thiès)
CREATE TABLE IF NOT EXISTS spaces (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    hourly_rate INTEGER NOT NULL DEFAULT 10000, -- FCFA
    noisy_allowed BOOLEAN NOT NULL DEFAULT FALSE,
    noisy_start_hour INTEGER NOT NULL DEFAULT 10, -- 10h
    noisy_end_hour INTEGER NOT NULL DEFAULT 19,   -- 19h
    photos TEXT[] DEFAULT '{}',
    equipment_included TEXT[] DEFAULT '{}',
    capacity INTEGER DEFAULT 6,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. SERVICES (Offres & formules clé en main)
CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    space_id TEXT REFERENCES spaces(id) ON DELETE SET NULL,
    category TEXT NOT NULL, -- 'studio', 'podcast', 'photo', 'video', 'pack', 'formation', 'evenement'
    name TEXT NOT NULL,
    description TEXT,
    price INTEGER NOT NULL, -- FCFA
    duration_hours NUMERIC(4, 1) NOT NULL DEFAULT 1.0,
    deposit_percentage INTEGER NOT NULL DEFAULT 50, -- 50% par défaut
    is_noisy BOOLEAN NOT NULL DEFAULT FALSE,
    allow_cash BOOLEAN NOT NULL DEFAULT FALSE,
    featured BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. OPTIONS DE RÉSERVATION
CREATE TABLE IF NOT EXISTS booking_options (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price INTEGER NOT NULL, -- FCFA
    unit TEXT DEFAULT 'par séance',
    description TEXT,
    active BOOLEAN DEFAULT TRUE
);

-- 7. BOOKINGS (Réservations avec exclusion GiST anti-doublon)
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_number TEXT UNIQUE NOT NULL,
    client_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    client_name TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    client_email TEXT,
    space_id TEXT NOT NULL REFERENCES spaces(id),
    service_id TEXT REFERENCES services(id),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    time_range TSRANGE GENERATED ALWAYS AS (TSRANGE(start_time, end_time, '[)')) STORED,
    options_selected JSONB DEFAULT '[]'::jsonb,
    total_amount INTEGER NOT NULL,
    deposit_amount INTEGER NOT NULL,
    paid_amount INTEGER NOT NULL DEFAULT 0,
    status booking_status NOT NULL DEFAULT 'en_attente',
    source TEXT DEFAULT 'web', -- 'web', 'telephone', 'sur_place'
    notes TEXT,
    is_noisy BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Contraintes métier
    CONSTRAINT check_booking_dates CHECK (end_time > start_time),
    CONSTRAINT no_overlapping_bookings EXCLUDE USING gist (
        space_id WITH =,
        time_range WITH &&
    ) WHERE (status NOT IN ('annulee'))
);

CREATE INDEX IF NOT EXISTS idx_bookings_start ON bookings(start_time);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_space ON bookings(space_id);

-- 8. EQUIPMENT (Matériel, caméras, micros, lumières)
CREATE TABLE IF NOT EXISTS equipment (
    id TEXT PRIMARY KEY, -- ex: 'EQ-SON-01'
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- 'camera', 'optique', 'audio', 'lumiere', 'stabilisateur', 'drone', 'accessoire'
    serial_number TEXT,
    replacement_value INTEGER NOT NULL, -- FCFA
    quantity INTEGER NOT NULL DEFAULT 1,
    available_quantity INTEGER NOT NULL DEFAULT 1,
    condition equipment_condition NOT NULL DEFAULT 'excellent',
    is_rentable BOOLEAN NOT NULL DEFAULT TRUE,
    daily_price INTEGER NOT NULL, -- FCFA
    deposit_required INTEGER NOT NULL, -- FCFA caution
    description TEXT,
    photos TEXT[] DEFAULT '{}',
    qr_code_data TEXT,
    partner_owned BOOLEAN DEFAULT TRUE, -- Fourni par 'le patron'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. RENTALS (Locations de matériel)
CREATE TABLE IF NOT EXISTS rentals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rental_number TEXT UNIQUE NOT NULL,
    client_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    client_name TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    client_id_card TEXT NOT NULL, -- CNI ou passeport
    client_id_card_photo TEXT,
    equipment_id TEXT NOT NULL REFERENCES equipment(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days_count INTEGER NOT NULL DEFAULT 1,
    total_price INTEGER NOT NULL,
    deposit_amount INTEGER NOT NULL,
    deposit_paid BOOLEAN DEFAULT FALSE,
    condition_out TEXT,
    photos_out TEXT[] DEFAULT '{}',
    condition_in TEXT,
    photos_in TEXT[] DEFAULT '{}',
    deposit_deduction INTEGER DEFAULT 0,
    deduction_reason TEXT,
    status rental_status NOT NULL DEFAULT 'reserve',
    notes TEXT,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. PAYMENTS (Paiements Wave, Orange Money, Espèces)
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_number TEXT UNIQUE NOT NULL,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    rental_id UUID REFERENCES rentals(id) ON DELETE SET NULL,
    amount INTEGER NOT NULL,
    payment_method payment_method NOT NULL,
    provider_ref TEXT, -- Réf transaction Wave / Orange Money / PayTech
    transaction_id TEXT,
    status payment_status NOT NULL DEFAULT 'complete',
    receipt_url TEXT,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. TRANSACTIONS (Comptabilité globale : Entrées et Dépenses)
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    type transaction_type NOT NULL,
    category transaction_category NOT NULL,
    amount INTEGER NOT NULL,
    description TEXT NOT NULL,
    receipt_photo_url TEXT, -- OBLIGATOIRE POUR LES SORTIES
    payment_method payment_method NOT NULL DEFAULT 'especes',
    is_fixed_charge BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES profiles(id),
    created_by_name TEXT NOT NULL DEFAULT 'Staff',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Règle stricte : toute sortie d'argent exige une photo du reçu
    CONSTRAINT check_expense_has_receipt CHECK (
        type != 'sortie' OR (receipt_photo_url IS NOT NULL AND length(receipt_photo_url) > 0)
    )
);

CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);

-- 12. INVENTORIES & INVENTORY LINES (Inventaires mensuels)
CREATE TABLE IF NOT EXISTS inventories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inventory_date DATE NOT NULL DEFAULT CURRENT_DATE,
    month_label TEXT NOT NULL, -- e.g. 'Octobre 2026'
    conducted_by UUID REFERENCES profiles(id),
    conducted_by_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'valide', -- 'brouillon', 'valide'
    discrepancy_count INTEGER NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inventory_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inventory_id UUID NOT NULL REFERENCES inventories(id) ON DELETE CASCADE,
    equipment_id TEXT NOT NULL REFERENCES equipment(id),
    expected_quantity INTEGER NOT NULL,
    counted_quantity INTEGER NOT NULL,
    condition_observed equipment_condition NOT NULL,
    has_discrepancy BOOLEAN DEFAULT FALSE,
    discrepancy_notes TEXT,
    scanned_qr BOOLEAN DEFAULT FALSE
);

-- 13. MONTHLY REPORTS (Comptes rendus mensuels & clôture)
CREATE TABLE IF NOT EXISTS monthly_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    month TEXT UNIQUE NOT NULL, -- '2026-10'
    label TEXT NOT NULL,        -- 'Octobre 2026'
    total_income INTEGER NOT NULL DEFAULT 0,
    total_expenses INTEGER NOT NULL DEFAULT 0,
    fixed_charges_paid INTEGER NOT NULL DEFAULT 0,
    net_profit INTEGER NOT NULL DEFAULT 0,
    reserve_equipment_10pct INTEGER NOT NULL DEFAULT 0,
    distributable_profit INTEGER NOT NULL DEFAULT 0,
    team_share_50pct INTEGER NOT NULL DEFAULT 0,
    patron_share_30pct INTEGER NOT NULL DEFAULT 0,
    reinvestment_share_20pct INTEGER NOT NULL DEFAULT 0,
    bookings_count INTEGER NOT NULL DEFAULT 0,
    rentals_count INTEGER NOT NULL DEFAULT 0,
    occupancy_hours JSONB DEFAULT '{}'::jsonb,
    inventory_summary JSONB DEFAULT '{}'::jsonb,
    pdf_url TEXT,
    generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. AUDIT LOG (TABLE EN AJOUT SEULEMENT - IMMUTABLE)
CREATE TABLE IF NOT EXISTS audit_log (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_id UUID,
    user_name TEXT,
    user_role TEXT,
    action TEXT NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    table_name TEXT NOT NULL,
    record_id TEXT NOT NULL,
    old_data JSONB,
    new_data JSONB,
    ip_address TEXT
);

-- Règle d'inviolabilité sur audit_log : aucune suppression ni mise à jour autorisée
CREATE OR REPLACE FUNCTION prevent_audit_tampering()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'ERREUR DE SÉCURITÉ: La table audit_log est strictement en ajout seulement (append-only). Aucune modification ni suppression permise.';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_audit_tampering ON audit_log;
CREATE TRIGGER trg_prevent_audit_tampering
BEFORE UPDATE OR DELETE ON audit_log
FOR EACH ROW EXECUTE FUNCTION prevent_audit_tampering();

-- Fonction universelle de capture d'audit
CREATE OR REPLACE FUNCTION process_audit_trigger()
RETURNS TRIGGER AS $$
DECLARE
    v_user_id UUID;
    v_user_name TEXT;
    v_user_role TEXT;
    v_record_id TEXT;
    v_old_data JSONB := NULL;
    v_new_data JSONB := NULL;
BEGIN
    -- Récupération du contexte utilisateur Supabase si disponible
    BEGIN
        v_user_id := auth.uid();
    EXCEPTION WHEN OTHERS THEN
        v_user_id := NULL;
    END;

    IF TG_OP = 'INSERT' THEN
        v_record_id := COALESCE(NEW.id::text, '');
        v_new_data := to_jsonb(NEW);
    ELSIF TG_OP = 'UPDATE' THEN
        v_record_id := COALESCE(NEW.id::text, '');
        v_old_data := to_jsonb(OLD);
        v_new_data := to_jsonb(NEW);
    ELSIF TG_OP = 'DELETE' THEN
        v_record_id := COALESCE(OLD.id::text, '');
        v_old_data := to_jsonb(OLD);
    END IF;

    INSERT INTO audit_log (
        user_id,
        user_name,
        user_role,
        action,
        table_name,
        record_id,
        old_data,
        new_data
    ) VALUES (
        v_user_id,
        COALESCE(current_setting('app.current_user_name', true), 'Système'),
        COALESCE(current_setting('app.current_user_role', true), 'staff'),
        TG_OP,
        TG_TABLE_NAME,
        v_record_id,
        v_old_data,
        v_new_data
    );

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Rattachement des triggers d'audit sur les tables sensibles
DROP TRIGGER IF EXISTS audit_bookings ON bookings;
CREATE TRIGGER audit_bookings AFTER INSERT OR UPDATE OR DELETE ON bookings FOR EACH ROW EXECUTE FUNCTION process_audit_trigger();

DROP TRIGGER IF EXISTS audit_equipment ON equipment;
CREATE TRIGGER audit_equipment AFTER INSERT OR UPDATE OR DELETE ON equipment FOR EACH ROW EXECUTE FUNCTION process_audit_trigger();

DROP TRIGGER IF EXISTS audit_rentals ON rentals;
CREATE TRIGGER audit_rentals AFTER INSERT OR UPDATE OR DELETE ON rentals FOR EACH ROW EXECUTE FUNCTION process_audit_trigger();

DROP TRIGGER IF EXISTS audit_transactions ON transactions;
CREATE TRIGGER audit_transactions AFTER INSERT OR UPDATE OR DELETE ON transactions FOR EACH ROW EXECUTE FUNCTION process_audit_trigger();

DROP TRIGGER IF EXISTS audit_inventories ON inventories;
CREATE TRIGGER audit_inventories AFTER INSERT OR UPDATE OR DELETE ON inventories FOR EACH ROW EXECUTE FUNCTION process_audit_trigger();

-- 15. SETTINGS (Paramètres globaux)
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. PORTFOLIO, ARTISTES, ÉVÉNEMENTS, AVIS
CREATE TABLE IF NOT EXISTS portfolio_items (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    category TEXT NOT NULL, -- 'audio', 'video', 'photo'
    media_url TEXT NOT NULL,
    thumbnail_url TEXT,
    duration TEXT,
    year TEXT,
    featured BOOLEAN DEFAULT FALSE,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS artists (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    genre TEXT NOT NULL,
    bio TEXT,
    photo_url TEXT,
    social_links JSONB DEFAULT '{}'::jsonb,
    featured_tracks JSONB DEFAULT '[]'::jsonb,
    active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT NOT NULL, -- 'formation', 'masterclass', 'concert', 'session_ouverte'
    date DATE NOT NULL,
    time TEXT NOT NULL,
    price INTEGER NOT NULL DEFAULT 0,
    total_spots INTEGER NOT NULL DEFAULT 15,
    available_spots INTEGER NOT NULL DEFAULT 15,
    description TEXT,
    location TEXT DEFAULT 'Studio Seven Truth, Thiès',
    instructor TEXT,
    active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS event_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id TEXT REFERENCES events(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    client_email TEXT,
    paid BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT NOT NULL,
    client_type TEXT,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    service TEXT,
    verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17. ROW LEVEL SECURITY (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventories ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Politiques de lecture publique pour le site vitrine
CREATE POLICY "Public read spaces" ON spaces FOR SELECT USING (true);
CREATE POLICY "Public read services" ON services FOR SELECT USING (active = true);
CREATE POLICY "Public read options" ON booking_options FOR SELECT USING (active = true);
CREATE POLICY "Public read equipment" ON equipment FOR SELECT USING (is_rentable = true);
CREATE POLICY "Public read portfolio" ON portfolio_items FOR SELECT USING (true);
CREATE POLICY "Public read artists" ON artists FOR SELECT USING (active = true);
CREATE POLICY "Public read events" ON events FOR SELECT USING (active = true);
CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (verified = true);
CREATE POLICY "Public insert bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert payments" ON payments FOR INSERT WITH CHECK (true);

-- Politiques Staff / Admin / Patron
-- Le Patron peut tout lire (transparence totale)
CREATE POLICY "Patron read all bookings" ON bookings FOR SELECT USING (true);
CREATE POLICY "Patron read all equipment" ON equipment FOR SELECT USING (true);
CREATE POLICY "Patron read all rentals" ON rentals FOR SELECT USING (true);
CREATE POLICY "Patron read all payments" ON payments FOR SELECT USING (true);
CREATE POLICY "Patron read all transactions" ON transactions FOR SELECT USING (true);
CREATE POLICY "Patron read all inventories" ON inventories FOR SELECT USING (true);
CREATE POLICY "Patron read all reports" ON monthly_reports FOR SELECT USING (true);
CREATE POLICY "Patron read audit_log" ON audit_log FOR SELECT USING (true);

-- Staff / Admin ont accès aux opérations selon leur niveau
CREATE POLICY "Staff all on bookings" ON bookings FOR ALL USING (true);
CREATE POLICY "Staff all on equipment" ON equipment FOR ALL USING (true);
CREATE POLICY "Staff all on rentals" ON rentals FOR ALL USING (true);
CREATE POLICY "Staff all on transactions" ON transactions FOR ALL USING (true);
CREATE POLICY "Staff all on inventories" ON inventories FOR ALL USING (true);
CREATE POLICY "Staff all on inventory_lines" ON inventory_lines FOR ALL USING (true);
CREATE POLICY "Staff all on monthly_reports" ON monthly_reports FOR ALL USING (true);
