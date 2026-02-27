const categoryRepository = require('../repositories/categoryRepository');

class CategoryService {
    async getAllCategories() {
        return await categoryRepository.getAll();
    }

    async getCategoryById(id) {
        return await categoryRepository.getById(id);
    }

    async createCategory(categoryData) {
        const existing = await categoryRepository.getByName(categoryData.nombre);
        if (existing) {
            throw new Error('El nombre de la categoría ya existe.');
        }
        return await categoryRepository.create(categoryData);
    }

    async updateCategory(id, categoryData) {
        const existing = await categoryRepository.getByName(categoryData.nombre);
        if (existing && existing.IdCategoria != id) {
            throw new Error('El nombre de la categoría ya existe.');
        }
        return await categoryRepository.update(id, categoryData);
    }

    async deleteCategory(id) {
        return await categoryRepository.delete(id);
    }
}

module.exports = new CategoryService();
