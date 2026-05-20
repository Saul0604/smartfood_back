// Average shelf life in days after purchase for common fruits and vegetables
const SHELF_LIFE_DAYS = {
  // Frutas
  manzana: 7,
  pera: 5,
  platano: 5,
  naranja: 10,
  limon: 14,
  fresa: 3,
  uva: 5,
  mango: 5,
  papaya: 4,
  melon: 5,
  sandia: 7,
  kiwi: 7,
  durazno: 4,
  ciruela: 4,
  cereza: 4,
  frambuesa: 2,
  arandano: 5,
  pina: 3,
  coco: 7,
  aguacate: 4,
  // Verduras
  tomate: 5,
  lechuga: 5,
  zanahoria: 14,
  brocoli: 5,
  espinaca: 4,
  cebolla: 30,
  ajo: 60,
  papa: 21,
  camote: 21,
  pepino: 5,
  calabaza: 7,
  chile: 7,
  pimiento: 7,
  apio: 7,
  coliflor: 5,
  champiñon: 5,
  ejote: 5,
  elote: 3,
  betabel: 14,
  nabo: 14,
};

/**
 * Returns shelf life in days for a fruit or vegetable by name.
 * Returns null if not found (manual entry required).
 */
function getShelfLifeDays(name) {
  const normalized = name.toLowerCase().trim();
  return SHELF_LIFE_DAYS[normalized] ?? null;
}

/**
 * Calculates expiration date from purchase date using average shelf life.
 * Returns null if the food item is not in the known list.
 */
function calculateExpirationDate(foodName, purchaseDate) {
  const days = getShelfLifeDays(foodName);
  if (days === null) return null;

  const date = new Date(purchaseDate);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

/**
 * Determines the status of a food item based on its expiration date.
 * - 'caducado'     → already expired
 * - 'por_caducar'  → expires within the next 3 days
 * - 'bueno'        → more than 3 days remaining
 */
function getFoodStatus(expirationDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expirationDate);
  const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'caducado';
  if (diffDays <= 3) return 'por_caducar';
  return 'bueno';
}

module.exports = { calculateExpirationDate, getFoodStatus, getShelfLifeDays, SHELF_LIFE_DAYS };
