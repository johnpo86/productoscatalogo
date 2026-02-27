const productRepository = require('../repositories/productRepository');
const xlsx = require('xlsx');

class ProductService {
    async getProductsPaged(params) {
        return await productRepository.getPaged(params);
    }

    async getProductById(id) {
        return await productRepository.getById(id);
    }

    async createProduct(productData) {
        return await productRepository.create(productData);
    }

    async updateProduct(id, productData) {
        return await productRepository.update(id, productData);
    }

    async deleteProduct(id) {
        return await productRepository.delete(id);
    }

    async processMassiveUpload(file) {
        const workbook = xlsx.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet);

        // Map excel columns to database fields
        const products = data.map(item => ({
            idCategoria: item.IdCategoria || item.idCategoria,
            nombre: item.Nombre || item.nombre,
            descripcion: item.Descripcion || item.descripcion,
            sku: item.Sku || item.sku || String(Math.floor(Math.random() * 1000000)),
            precio: parseFloat(item.Precio || item.precio || 0),
            stock: parseInt(item.Stock || item.stock || 0),
            activo: 1
        }));

        // Validate basic rules for massive upload
        const validProducts = products.filter(p => p.nombre && p.precio > 0 && p.idCategoria);

        if (validProducts.length === 0) {
            throw new Error('No se encontraron productos válidos para cargar.');
        }

        await productRepository.createBulk(validProducts);
        return { count: validProducts.length };
    }
}

module.exports = new ProductService();
