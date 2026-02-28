const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

/**
 * @swagger
 * /api/categorias:
 *   get:
 *     summary: Obtiene categorías paginadas con filtros
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Lista paginada de categorías
 */
router.get('/', categoryController.getPaged);

/**
 * @swagger
 * /api/categorias/all:
 *   get:
 *     summary: Obtiene todas las categorías activas (sin paginación)
 *     responses:
 *       200:
 *         description: Lista completa de categorías
 */
router.get('/all', categoryController.getAll);

/**
 * @swagger
 * /api/categorias/{id}:
 *   get:
 *     summary: Obtiene una categoría por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.get('/:id', categoryController.getById);

/**
 * @swagger
 * /api/categorias:
 *   post:
 *     summary: Crea una nueva categoría
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 */
router.post('/', categoryController.create);

/**
 * @swagger
 * /api/categorias/{id}:
 *   put:
 *     summary: Actualiza una categoría
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 */
router.put('/:id', categoryController.update);

/**
 * @swagger
 * /api/categorias/{id}:
 *   delete:
 *     summary: Elimina una categoría (soft delete)
 */
router.delete('/:id', categoryController.delete);

module.exports = router;
