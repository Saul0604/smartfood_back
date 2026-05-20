const Anthropic = require('@anthropic-ai/sdk');
const Food = require('../models/Food');
const { getFoodStatus } = require('../utils/expirationDefaults');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function getRecipeSuggestions(req, res) {
  const foods = await Food.findAll({ where: { userId: req.user.id } });

  const available = foods
    .map((f) => ({ ...f.toJSON(), status: getFoodStatus(f.expirationDate) }))
    .filter((f) => f.status !== 'caducado');

  if (available.length === 0) {
    return res.status(400).json({ message: 'No hay alimentos disponibles para sugerir recetas' });
  }

  const foodList = available
    .map((f) => `- ${f.name} (${f.quantity} ${f.unit}, caduca: ${f.expirationDate}${f.status === 'por_caducar' ? ' ⚠️ próximo a caducar' : ''})`)
    .join('\n');

  const prompt = `Soy usuario de una app de gestión de alimentos. Tengo los siguientes alimentos disponibles:

${foodList}

Por favor sugiere 3 recetas que pueda preparar con estos ingredientes. Prioriza usar los alimentos que están próximos a caducar. Para cada receta incluye:
1. Nombre de la receta
2. Ingredientes necesarios (de mi lista)
3. Pasos de preparación breves
4. Por qué es una buena opción considerando mis alimentos

Responde en español de forma clara y amigable.`;

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }],
  });

  res.json({
    availableFoods: available.length,
    suggestions: message.content[0].text,
  });
}

module.exports = { getRecipeSuggestions };
