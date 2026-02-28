const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const multer = require('multer');

// Configure multer for file storage in memory
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * /api/productos:
 *   get:
 *     summary: Obtiene productos paginados con filtros
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
 *       - in: query
 *         name: idCategoria
 *         schema: { type: integer }
 *       - in: query
 *         name: precioMin
 *         schema: { type: number }
 *       - in: query
 *         name: precioMax
 *         schema: { type: number }
 */
router.get('/', productController.getPaged);

/**
 * @swagger
 * /api/productos/plantilla:
 *   get:
 *     summary: Descarga una plantilla de Excel para carga masiva
 *     responses:
 *       200:
 *         description: Archivo Excel .xlsx
 */
router.get('/plantilla', productController.downloadTemplate);

/**
 * @swagger
 * /api/productos/{id}:
 *   get:
 *     summary: Obtiene un producto por ID
 */
router.get('/:id', productController.getById);

/**
 * @swagger
 * /api/productos:
 *   post:
 *     summary: Crea un nuevo producto
 */
router.post('/', productController.create);

/**
 * @swagger
 * /api/productosMasivo:
 *   post:
 *     summary: Carga masiva de productos vía Excel/CSV
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 */
router.post('/masivo', upload.single('file'), productController.uploadMasive);

/**
 * @swagger
 * /api/productos/{id}:
 *   put:
 *     summary: Actualiza un producto
 */
router.put('/:id', productController.update);

/**
 * @swagger
 * /api/productos/{id}:
 *   delete:
 *     summary: Elimina un producto
 */
router.delete('/:id', productController.delete);

module.exports = router;
