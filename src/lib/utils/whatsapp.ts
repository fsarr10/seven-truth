// ==============================================================================
// Générateur de liens WhatsApp (wa.me) pré-remplis
// ==============================================================================

import { formatFCFA } from './currency';

const DEFAULT_WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '221771234567';

export function getWhatsAppBookingLink(booking: {
  booking_number: string;
  client_name: string;
  space_name: string;
  service_name: string;
  date_formatted: string;
  time_formatted: string;
  total_amount: number;
  deposit_amount: number;
  paid_amount: number;
}): string {
  const text = `*SEVEN TRUTH — Confirmation de réservation* 🎵
Bonjour l'équipe Seven Truth, je viens d'enregistrer ma réservation en ligne :

📄 *Numéro* : ${booking.booking_number}
👤 *Client* : ${booking.client_name}
📍 *Espace* : ${booking.space_name}
🎙️ *Formule* : ${booking.service_name}
📅 *Date* : ${booking.date_formatted}
⏰ *Horaire* : ${booking.time_formatted}
💰 *Total* : ${formatFCFA(booking.total_amount)}
💵 *Acompte réglé* : ${formatFCFA(booking.paid_amount)}

Merci de me confirmer la prise en compte de ma séance au studio à Thiès !`;

  return `https://wa.me/${DEFAULT_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function getWhatsAppRentalLink(rental: {
  rental_number: string;
  client_name: string;
  equipment_name: string;
  start_date: string;
  end_date: string;
  days_count: number;
  total_price: number;
  deposit_amount: number;
}): string {
  const text = `*SEVEN TRUTH — Demande de Location Matériel* 📷
Bonjour, je réserve la location suivante :

📄 *Réf* : ${rental.rental_number}
👤 *Nom* : ${rental.client_name}
🎥 *Matériel* : ${rental.equipment_name}
🗓️ *Période* : Du ${rental.start_date} au ${rental.end_date} (${rental.days_count} j)
💰 *Prix location* : ${formatFCFA(rental.total_price)}
🔒 *Caution* : ${formatFCFA(rental.deposit_amount)}

J'ai préparé ma CNI et le dépôt de caution.`;

  return `https://wa.me/${DEFAULT_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
