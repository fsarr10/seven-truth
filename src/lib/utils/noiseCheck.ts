// ==============================================================================
// Validation des plages bruyantes (Batterie, Sabar, Tam-tam)
// Studio Seven Truth, Thiès
// ==============================================================================

export interface NoiseRuleConfig {
  allowed_days: string[];
  start_hour: number; // ex: 10
  end_hour: number;   // ex: 19
  warning_message?: string;
}

export const DEFAULT_NOISE_RULES: NoiseRuleConfig = {
  allowed_days: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
  start_hour: 10,
  end_hour: 19,
  warning_message: "En accord avec le voisinage de l'immeuble, les instruments acoustiques à fort volume (batterie, sabar, percussions) sont strictement autorisés entre 10h00 et 19h00 du lundi au samedi."
};

const DAY_NAMES = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

export function isSlotAllowedForNoise(
  startTimeStr: string,
  endTimeStr: string,
  rules: NoiseRuleConfig = DEFAULT_NOISE_RULES
): { allowed: boolean; reason?: string } {
  const start = new Date(startTimeStr);
  const end = new Date(endTimeStr);

  const dayOfWeek = DAY_NAMES[start.getDay()];

  if (!rules.allowed_days.includes(dayOfWeek)) {
    return {
      allowed: false,
      reason: `Les sessions bruyantes (sabar, batterie) ne sont pas autorisées le ${dayOfWeek}. Jours autorisés : ${rules.allowed_days.join(', ')}.`
    };
  }

  const startHour = start.getHours() + start.getMinutes() / 60;
  const endHour = end.getHours() + end.getMinutes() / 60;

  if (startHour < rules.start_hour || endHour > rules.end_hour) {
    return {
      allowed: false,
      reason: `Créneau hors plage autorisée. Pour la batterie et le sabar, les sessions doivent se situer entre ${rules.start_hour}h00 et ${rules.end_hour}h00.`
    };
  }

  return { allowed: true };
}
