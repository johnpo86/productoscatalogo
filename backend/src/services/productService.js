const productRepository = require('../repositories/productRepository');
const categoryRepository = require('../repositories/categoryRepository');
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
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

        const categories = await categoryRepository.getAll();
        const categoryMap = new Map(categories.map(c => [c.Nombre.toLowerCase().trim(), c.IdCategoria]));

        const results = {
            success: [],
            errors: [],
            totalImported: 0
        };

        const productsToInsert = [];

        data.forEach((item, index) => {
            const rowNumber = index + 2; // +1 zero-indexed, +1 header row
            const nombre = item.Nombre || item.nombre;
            const catNombre = (item.Categoria || item.categoria || '').toString().toLowerCase().trim();
            const precio = parseFloat(item.Precio || item.precio || 0);

            const rowErrors = [];
            if (!nombre) rowErrors.push('El campo Nombre es obligatorio.');
            if (precio <= 0) rowErrors.push('El precio debe ser mayor a 0.');

            const idCategoria = categoryMap.get(catNombre);
            if (!idCategoria) rowErrors.push(`Categoría "${item.Categoria || 'vacía'}" no encontrada.`);

            if (rowErrors.length > 0) {
                results.errors.push({ row: rowNumber, errors: rowErrors });
            } else {
                productsToInsert.push({
                    IdCategoria: idCategoria,
                    Nombre: nombre,
                    Descripcion: item.Descripcion || item.descripcion || '',
                    Sku: item.Sku || item.sku || `SKU-${Math.floor(Math.random() * 1000000)}`,
                    Precio: precio,
                    Stock: parseInt(item.Stock || item.stock || 0),
                    Activo: 1
                });
            }
        });

        if (productsToInsert.length > 0) {
            await productRepository.createBulk(productsToInsert);
            results.totalImported = productsToInsert.length;
        }

        return results;
    }

    async generateUploadTemplate() {
        const categories = await categoryRepository.getAll();

        // Data for the main template
        const templateData = [
            { Categoria: 'Electrónica', Nombre: 'Laptop Gaming', Descripcion: 'Alta gama', Sku: 'LP-GAM-123', Precio: 1200, Stock: 5 }
        ];

        // List of existing categories for reference
        const categoryList = categories.map(c => ({ Nombre: c.Nombre }));

        const wb = xlsx.utils.book_new();
        const wsTemplate = xlsx.utils.json_to_sheet(templateData);
        const wsCategories = xlsx.utils.json_to_sheet(categoryList);

        xlsx.utils.book_append_sheet(wb, wsTemplate, 'Plantilla');
        xlsx.utils.book_append_sheet(wb, wsCategories, 'Formatos_Categorias');

        return xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
    }
}

module.exports = new ProductService();
