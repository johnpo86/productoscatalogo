const productService = require('../services/productService');

class ProductController {
    async getPaged(req, res) {
        try {
            const { page, pageSize, search, idCategoria, precioMin, precioMax, activo, sortBy, sortDir } = req.query;
            const result = await productService.getProductsPaged({
                page, pageSize, search, idCategoria, precioMin, precioMax, activo, sortBy, sortDir
            });
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getById(req, res) {
        try {
            const product = await productService.getProductById(req.params.id);
            if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
            res.json(product);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async create(req, res) {
        try {
            const { nombre, precio, idCategoria } = req.body;
            if (!nombre || !precio || !idCategoria) {
                return res.status(400).json({ message: 'Nombre, precio y categoría son obligatorios' });
            }
            if (precio <= 0) return res.status(400).json({ message: 'El precio debe ser mayor a 0' });

            const id = await productService.createProduct(req.body);
            res.status(201).json({ id, message: 'Producto creado con éxito' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async update(req, res) {
        try {
            await productService.updateProduct(req.params.id, req.body);
            res.json({ message: 'Producto actualizado con éxito' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async delete(req, res) {
        try {
            await productService.deleteProduct(req.params.id);
            res.json({ message: 'Producto eliminado con éxito' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async uploadMasive(req, res) {
        try {
            if (!req.file) return res.status(400).json({ message: 'No se subió ningún archivo' });
            const result = await productService.processMassiveUpload(req.file);
            res.json({ message: `Carga masiva finalizada. ${result.count} productos cargados.` });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new ProductController();
