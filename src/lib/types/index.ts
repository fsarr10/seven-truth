// ==============================================================================
// SEVEN TRUTH — Types TypeScript Globaux
// ==============================================================================

export type UserRole = 'admin' | 'patron' | 'staff' | 'client';

export type BookingStatus = 'en_attente' | 'confirmee' | 'payee' | 'terminee' | 'annulee';

export type RentalStatus = 'reserve' | 'en_cours' | 'retourne' | 'en_retard' | 'litige' | 'annule';

export type EquipmentCondition = 'neuf' | 'excellent' | 'bon' | 'correct' | 'maintenance' | 'hors_service';

export type PaymentMethod = 'wave' | 'orange_money' | 'especes' | 'virement';

export type PaymentStatus = 'en_attente' | 'complete' | 'echoue' | 'rembourse';

export type TransactionType = 'entree' | 'sortie';

export type TransactionCategory = 
  | 'loyer' 
  | 'electricite' 
  | 'eau' 
  | 'wifi' 
  | 'publicite' 
  | 'consommables' 
  | 'transport' 
  | 'maintenance' 
  | 'materiel' 
  | 'part_equipe' 
  | 'part_patron' 
  | 'reserve_materiel' 
  | 'prestations' 
  | 'autre';

export interface Profile {
  id: string;
  auth_user_id?: string;
  full_name: string;
  phone: string;
  email?: string;
  role: UserRole;
  tag?: string;
  notes?: string;
  created_at: string;
}

export interface Space {
  id: string;
  name: string;
  slug: string;
  description: string;
  hourly_rate: number; // FCFA
  noisy_allowed: boolean;
  noisy_start_hour: number; // ex: 10
  noisy_end_hour: number;   // ex: 19
  photos: string[];
  equipment_included: string[];
  capacity: number;
  active: boolean;
}

export interface Service {
  id: string;
  space_id?: string;
  category: 'studio' | 'podcast' | 'photo' | 'video' | 'pack' | 'formation' | 'evenement';
  name: string;
  description: string;
  price: number; // FCFA
  duration_hours: number;
  deposit_percentage: number;
  is_noisy: boolean;
  allow_cash: boolean;
  featured?: boolean;
  active: boolean;
}

export interface BookingOption {
  id: string;
  name: string;
  price: number;
  unit: string;
  description?: string;
}

export interface Booking {
  id: string;
  booking_number: string;
  client_id?: string;
  client_name: string;
  client_phone: string;
  client_email?: string;
  space_id: string;
  service_id?: string;
  start_time: string; // ISO 8601
  end_time: string;   // ISO 8601
  options_selected: { id: string; name: string; price: number }[];
  total_amount: number;
  deposit_amount: number;
  paid_amount: number;
  status: BookingStatus;
  source: 'web' | 'telephone' | 'sur_place';
  notes?: string;
  is_noisy?: boolean;
  created_by?: string;
  created_at: string;
}

export interface Equipment {
  id: string;
  name: string;
  category: 'camera' | 'optique' | 'audio' | 'lumiere' | 'stabilisateur' | 'drone' | 'accessoire';
  serial_number: string;
  replacement_value: number; // FCFA
  quantity: number;
  available_quantity: number;
  condition: EquipmentCondition;
  is_rentable: boolean;
  daily_price: number;
  deposit_required: number; // caution FCFA
  description: string;
  photos: string[];
  qr_code_data: string;
  partner_owned: boolean; // Le Patron
  created_at: string;
}

export interface Rental {
  id: string;
  rental_number: string;
  client_id?: string;
  client_name: string;
  client_phone: string;
  client_id_card: string;
  client_id_card_photo?: string;
  equipment_id: string;
  equipment_name?: string;
  quantity: number;
  start_date: string;
  end_date: string;
  days_count: number;
  total_price: number;
  deposit_amount: number;
  deposit_paid: boolean;
  condition_out?: string;
  photos_out?: string[];
  condition_in?: string;
  photos_in?: string[];
  deposit_deduction?: number;
  deduction_reason?: string;
  status: RentalStatus;
  notes?: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  description: string;
  receipt_photo_url?: string;
  payment_method: PaymentMethod;
  is_fixed_charge?: boolean;
  created_by_name: string;
  created_at: string;
}

export interface Inventory {
  id: string;
  inventory_date: string;
  month_label: string;
  conducted_by_name: string;
  status: 'brouillon' | 'valide';
  discrepancy_count: number;
  notes?: string;
  created_at: string;
  lines?: InventoryLine[];
}

export interface InventoryLine {
  id: string;
  inventory_id: string;
  equipment_id: string;
  equipment_name?: string;
  expected_quantity: number;
  counted_quantity: number;
  condition_observed: EquipmentCondition;
  has_discrepancy: boolean;
  discrepancy_notes?: string;
  scanned_qr: boolean;
}

export interface MonthlyReport {
  id: string;
  month: string; // '2026-10'
  label: string; // 'Octobre 2026'
  total_income: number;
  total_expenses: number;
  fixed_charges_paid: number;
  net_profit: number;
  reserve_equipment_10pct: number;
  distributable_profit: number;
  team_share_50pct: number;
  patron_share_30pct: number;
  reinvestment_share_20pct: number;
  bookings_count: number;
  rentals_count: number;
  occupancy_hours: Record<string, number>;
  pdf_url?: string;
  generated_at: string;
}

export interface AuditLogEntry {
  id: number;
  timestamp: string;
  user_id?: string;
  user_name: string;
  user_role: string;
  action: 'INSERT' | 'UPDATE' | 'DELETE';
  table_name: string;
  record_id: string;
  old_data?: Record<string, any>;
  new_data?: Record<string, any>;
  ip_address?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  artist: string;
  category: 'audio' | 'video' | 'photo';
  media_url: string;
  thumbnail_url?: string;
  duration?: string;
  year?: string;
  featured?: boolean;
}

export interface Artist {
  id: string;
  name: string;
  genre: string;
  bio: string;
  photo_url: string;
  active: boolean;
}

export interface LabelEvent {
  id: string;
  title: string;
  type: 'formation' | 'masterclass' | 'concert' | 'session_ouverte';
  date: string;
  time: string;
  price: number;
  total_spots: number;
  available_spots: number;
  description: string;
  location: string;
  instructor?: string;
}

export interface Review {
  id: string;
  client_name: string;
  client_type?: string;
  rating: number;
  comment: string;
  service?: string;
  verified: boolean;
  created_at: string;
}

export interface SettingsConfig {
  label_info: {
    name: string;
    city: string;
    country: string;
    address: string;
    phone: string;
    whatsapp: string;
    email: string;
  };
  financial_rules: {
    monthly_fixed_charges_target: number;
    monthly_revenue_goal: number;
    equipment_reserve_pct: number;
    team_split_pct: number;
    patron_split_pct: number;
    reinvestment_pct: number;
  };
  noise_regulations: {
    allowed_days: string[];
    start_hour: number;
    end_hour: number;
    warning_message: string;
  };
  booking_rules: {
    deposit_percentage: number;
    free_cancellation_hours: number;
    auto_reminder_hours: number;
  };
}
