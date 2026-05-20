const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const {
  createFood, getFoods, getFoodById, updateFood, deleteFood, getSummary,
} = require('../controllers/foodController');

/**
 * @swagger
 * tags:
 *   name: Alimentos
 *   description: Gestión de alimentos del usuario
 */

/**
 * @swagger
 * /api/foods/summary:
 *   get:
 *     summary: Resumen de alimentos agrupados por estado
 *     tags: [Alimentos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Alimentos agrupados en bueno, por_caducar y caducado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bueno:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Food'
 *                 por_caducar:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Food'
 *                 caducado:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Food'
 *       401:
 *         description: No autorizado
 */
router.get('/summary', authenticate, getSummary);

/**
 * @swagger
 * /api/foods:
 *   get:
 *     summary: Obtener todos los alimentos del usuario
 *     tags: [Alimentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [bueno, por_caducar, caducado]
 *         description: Filtrar por estado de caducidad
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [frutas, verduras, lacteos, carnes, granos, enlatados, bebidas, otros]
 *         description: Filtrar por categoría
 *     responses:
 *       200:
 *         description: Lista de alimentos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Food'
 *       401:
 *         description: No autorizado
 */
router.get('/', authenticate, getFoods);

/**
 * @swagger
 * /api/foods/{id}:
 *   get:
 *     summary: Obtener un alimento por ID
 *     tags: [Alimentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Alimento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Food'
 *       404:
 *         description: Alimento no encontrado
 */
router.get('/:id', authenticate, getFoodById);

/**
 * @swagger
 * /api/foods:
 *   post:
 *     summary: Agregar un nuevo alimento
 *     tags: [Alimentos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, quantity, unit, category, purchaseDate]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Manzana
 *               quantity:
 *                 type: number
 *                 example: 6
 *               unit:
 *                 type: string
 *                 enum: [kg, g, L, ml, piezas]
 *                 example: piezas
 *               category:
 *                 type: string
 *                 enum: [frutas, verduras, lacteos, carnes, granos, enlatados, bebidas, otros]
 *                 example: frutas
 *               purchaseDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-05-19"
 *               expirationDate:
 *                 type: string
 *                 format: date
 *                 description: Opcional para frutas/verduras (se calcula automáticamente)
 *                 example: "2026-05-26"
 *     responses:
 *       201:
 *         description: Alimento creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Food'
 *       400:
 *         description: Campos inválidos o faltantes
 *       401:
 *         description: No autorizado
 */
router.post('/', authenticate, createFood);

/**
 * @swagger
 * /api/foods/{id}:
 *   put:
 *     summary: Actualizar un alimento
 *     tags: [Alimentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               quantity:
 *                 type: number
 *               unit:
 *                 type: string
 *                 enum: [kg, g, L, ml, piezas]
 *               category:
 *                 type: string
 *                 enum: [frutas, verduras, lacteos, carnes, granos, enlatados, bebidas, otros]
 *               purchaseDate:
 *                 type: string
 *                 format: date
 *               expirationDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Alimento actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Food'
 *       404:
 *         description: Alimento no encontrado
 */
router.put('/:id', authenticate, updateFood);

/**
 * @swagger
 * /api/foods/{id}:
 *   delete:
 *     summary: Eliminar un alimento
 *     tags: [Alimentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Alimento eliminado
 *       404:
 *         description: Alimento no encontrado
 */
router.delete('/:id', authenticate, deleteFood);

module.exports = router;
