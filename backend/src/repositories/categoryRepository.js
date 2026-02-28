const { sql } = require('../db');

class CategoryRepository {
    async getPaged(params) {
        const {
            page = 1,
            pageSize = 10,
            search = '',
            activo,
            sortBy = 'Nombre',
            sortDir = 'ASC'
        } = params;

        const offset = (page - 1) * pageSize;
        const pool = await sql;
        const request = new sql.Request();

        let whereClause = 'WHERE 1=1';
        if (search && search !== 'undefined' && search !== '') {
            whereClause += ' AND (Nombre LIKE @search OR Descripcion LIKE @search)';
            request.input('search', sql.NVarChar, `%${search}%`);
        }
        if (activo !== undefined && activo !== 'undefined' && activo !== '') {
            whereClause += ' AND Activo = @activo';
            request.input('activo', sql.Bit, activo === 'true' || activo === true ? 1 : 0);
        }

        const allowedSortFields = ['Nombre', 'FechaCreacion'];
        const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'Nombre';
        const validSortDir = sortDir.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

        const countQuery = `SELECT COUNT(*) AS total FROM Categorias ${whereClause}`;
        const totalResult = await request.query(countQuery);
        const total = totalResult.recordset[0].total;

        const dataQuery = `
            SELECT * FROM Categorias 
            ${whereClause} 
            ORDER BY ${validSortBy} ${validSortDir} 
            OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY
        `;
        request.input('offset', sql.Int, offset);
        request.input('pageSize', sql.Int, parseInt(pageSize));

        const dataResult = await request.query(dataQuery);

        return {
            items: dataResult.recordset,
            total,
            page: parseInt(page),
            pageSize: parseInt(pageSize)
        };
    }

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
        const { Nombre, Descripcion } = category;
        const result = await sql.query`
            INSERT INTO Categorias (Nombre, Descripcion)
            VALUES (${Nombre}, ${Descripcion});
            SELECT SCOPE_IDENTITY() AS id;
        `;
        return result.recordset[0].id;
    }

    async update(id, category) {
        const { Nombre, Descripcion, Activo } = category;
        await sql.query`
            UPDATE Categorias
            SET Nombre = ${Nombre},
                Descripcion = ${Descripcion},
                Activo = ${Activo}
            WHERE IdCategoria = ${id}
        `;
    }

    async delete(id) {
        // Soft delete y activo 0 productos relacionados
        await sql.query`UPDATE Productos SET Activo = 0 WHERE IdCategoria = ${id}`;
        await sql.query`UPDATE Categorias SET Activo = 0 WHERE IdCategoria = ${id}`;
    }
}

module.exports = new CategoryRepository();
