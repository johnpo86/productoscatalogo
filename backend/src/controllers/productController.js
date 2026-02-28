const productService = require('../services/productService');
const categoryService = require('../services/categoryService');

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
            const { Nombre, Precio, IdCategoria } = req.body;
            if (!Nombre || !Precio || !IdCategoria) {
                return res.status(400).json({ message: 'Nombre, precio y categoría son obligatorios' });
            }
            if (Precio <= 0) return res.status(400).json({ message: 'El precio debe ser mayor a 0' });

            const id = await productService.createProduct(req.body);
            res.status(201).json({ id, message: 'Producto creado con éxito' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async update(req, res) {
        try {
            const { Nombre, Precio, IdCategoria } = req.body;
            if (!Nombre || !Precio || !IdCategoria) {
                return res.status(400).json({ message: 'Nombre, precio y categoría son obligatorios para actualizar' });
            }
            if (Precio <= 0) return res.status(400).json({ message: 'El precio debe ser mayor a 0' });

            // Si activo es 1, debo confirmar que la categoria este activa
            if (req.body.Activo === 1 || req.body.Activo === true) {
                const category = await categoryService.getCategoryById(req.body.IdCategoria);
                if (!category) return res.status(400).json({ message: 'La categoría no existe' });
                if (category.Activo === 0 || category.Activo === false) return res.status(400).json({ message: 'La categoría está inactiva' });
            }

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
            const results = await productService.processMassiveUpload(req.file);
            res.json({
                message: `Procesamiento finalizado. Importados: ${results.totalImported}. Errores: ${results.errors.length}`,
                ...results
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async downloadTemplate(req, res) {
        try {
            const buffer = await productService.generateUploadTemplate();
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=Plantilla_Productos.xlsx');
            res.send(buffer);
        } catch (error) {
            res.status(500).json({ message: 'Error generando plantilla' });
        }
    }
}

module.exports = new ProductController();
