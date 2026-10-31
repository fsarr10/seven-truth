// ==============================================================================
// Formatage FCFA sans décimales : "15 000 FCFA"
// ==============================================================================

export function formatFCFA(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '0 FCFA';
  }
  
  // Formatage avec séparateur d'espace insécable ou standard
  const rounded = Math.round(amount);
  const formatted = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${formatted} FCFA`;
}
