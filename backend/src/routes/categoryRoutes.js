const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

/**
 * @swagger
 * /api/categorias:
 *   get:
 *     summary: Obtiene todas las categorías activas
 *     responses:
 *       200:
 *         description: Lista de categorías
 */
router.get('/', categoryController.getAll);

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
