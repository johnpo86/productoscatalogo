const categoryService = require('../services/categoryService');

class CategoryController {
    async getAll(req, res) {
        try {
            const categories = await categoryService.getAllCategories();
            res.json(categories);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getById(req, res) {
        try {
            const category = await categoryService.getCategoryById(req.params.id);
            if (!category) return res.status(404).json({ message: 'Categoría no encontrada' });
            res.json(category);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async create(req, res) {
        try {
            if (!req.body.nombre) return res.status(400).json({ message: 'El nombre es obligatorio' });
            const id = await categoryService.createCategory(req.body);
            res.status(201).json({ id, message: 'Categoría creada con éxito' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async update(req, res) {
        try {
            await categoryService.updateCategory(req.params.id, req.body);
            res.json({ message: 'Categoría actualizada con éxito' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async delete(req, res) {
        try {
            await categoryService.deleteCategory(req.params.id);
            res.json({ message: 'Categoría eliminada con éxito (soft delete)' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new CategoryController();
