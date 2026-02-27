const { sql } = require('../db');

class CategoryRepository {
    async getAll() {
        const result = await sql.query`SELECT * FROM Categorias WHERE Activo = 1 ORDER BY Nombre`;
        return result.recordset;
    }

    async getById(id) {
        const result = await sql.query`SELECT * FROM Categorias WHERE IdCategoria = ${id}`;
        return result.recordset[0];
    }

    async getByName(nombre) {
        const result = await sql.query`SELECT * FROM Categorias WHERE Nombre = ${nombre}`;
        return result.recordset[0];
    }

    async create(category) {
        const { nombre, descripcion } = category;
        const result = await sql.query`
            INSERT INTO Categorias (Nombre, Descripcion)
            VALUES (${nombre}, ${descripcion});
            SELECT SCOPE_IDENTITY() AS id;
        `;
        return result.recordset[0].id;
    }

    async update(id, category) {
        const { nombre, descripcion, activo } = category;
        await sql.query`
            UPDATE Categorias
            SET Nombre = ${nombre},
                Descripcion = ${descripcion},
                Activo = ${activo}
            WHERE IdCategoria = ${id}
        `;
    }

    async delete(id) {
        // Soft delete implementation
        await sql.query`UPDATE Categorias SET Activo = 0 WHERE IdCategoria = ${id}`;
    }
}

module.exports = new CategoryRepository();
