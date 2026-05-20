const { Op } = require('sequelize');
const Food = require('../models/Food');
const { calculateExpirationDate, getFoodStatus } = require('../utils/expirationDefaults');

function attachStatus(food) {
  return { ...food.toJSON(), status: getFoodStatus(food.expirationDate) };
}

async function createFood(req, res) {
  const { name, quantity, unit, category, purchaseDate, expirationDate } = req.body;

  if (!name || !quantity || !unit || !category || !purchaseDate) {
    return res.status(400).json({ message: 'Faltan campos requeridos' });
  }

  let finalExpiration = expirationDate;
  let autoExpiration = false;

  if (!finalExpiration && (category === 'frutas' || category === 'verduras')) {
    finalExpiration = calculateExpirationDate(name, purchaseDate);
    if (!finalExpiration) {
      return res.status(400).json({
        message: `No se encontró fecha de caducidad automática para "${name}". Por favor ingresa la fecha manualmente.`,
      });
    }
    autoExpiration = true;
  }

  if (!finalExpiration) {
    return res.status(400).json({ message: 'La fecha de caducidad es requerida para esta categoría' });
  }

  const food = await Food.create({
    name,
    quantity,
    unit,
    category,
    purchaseDate,
    expirationDate: finalExpiration,
    autoExpiration,
    userId: req.user.id,
  });

  res.status(201).json(attachStatus(food));
}

async function getFoods(req, res) {
  const { status, category } = req.query;
  const where = { userId: req.user.id };

  if (category) where.category = category;

  const foods = await Food.findAll({ where, order: [['expirationDate', 'ASC']] });
  let result = foods.map(attachStatus);

  if (status) result = result.filter((f) => f.status === status);

  res.json(result);
}

async function getFoodById(req, res) {
  const food = await Food.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!food) return res.status(404).json({ message: 'Alimento no encontrado' });
  res.json(attachStatus(food));
}

async function updateFood(req, res) {
  const food = await Food.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!food) return res.status(404).json({ message: 'Alimento no encontrado' });

  const { name, quantity, unit, category, purchaseDate, expirationDate } = req.body;

  let finalExpiration = expirationDate || food.expirationDate;
  let autoExpiration = food.autoExpiration;

  const newCategory = category || food.category;
  const newName = name || food.name;
  const newPurchaseDate = purchaseDate || food.purchaseDate;

  if (!expirationDate && (newCategory === 'frutas' || newCategory === 'verduras')) {
    const calculated = calculateExpirationDate(newName, newPurchaseDate);
    if (calculated) {
      finalExpiration = calculated;
      autoExpiration = true;
    }
  } else if (expirationDate) {
    autoExpiration = false;
  }

  await food.update({ name: newName, quantity, unit, category: newCategory, purchaseDate: newPurchaseDate, expirationDate: finalExpiration, autoExpiration });
  res.json(attachStatus(food));
}

async function deleteFood(req, res) {
  const food = await Food.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!food) return res.status(404).json({ message: 'Alimento no encontrado' });
  await food.destroy();
  res.json({ message: 'Alimento eliminado' });
}

async function getSummary(req, res) {
  const foods = await Food.findAll({ where: { userId: req.user.id } });
  const withStatus = foods.map(attachStatus);

  res.json({
    bueno: withStatus.filter((f) => f.status === 'bueno'),
    por_caducar: withStatus.filter((f) => f.status === 'por_caducar'),
    caducado: withStatus.filter((f) => f.status === 'caducado'),
  });
}

module.exports = { createFood, getFoods, getFoodById, updateFood, deleteFood, getSummary };
