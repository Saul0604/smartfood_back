const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const { getRecipeSuggestions } = require('../controllers/recipeController');

/**
 * @swagger
 * tags:
 *   name: Recetas IA
 *   description: Sugerencias de recetas generadas con IA basadas en tus alimentos
 */

/**
 * @swagger
 * /api/recipes/suggestions:
 *   get:
 *     summary: Obtener sugerencias de recetas con IA
 *     description: Genera 3 sugerencias de recetas usando Claude AI, priorizando alimentos próximos a caducar
 *     tags: [Recetas IA]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sugerencias de recetas generadas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 availableFoods:
 *                   type: integer
 *                   description: Número de alimentos disponibles usados para generar recetas
 *                 suggestions:
 *                   type: string
 *                   description: Texto con las sugerencias de recetas generado por Claude AI
 *       400:
 *         description: No hay alimentos disponibles
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado
 */
router.get('/suggestions', authenticate, getRecipeSuggestions);

module.exports = router;
