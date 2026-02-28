const { sql } = require('../db');

class ProductRepository {
    async getPaged(params) {
        const {
            page = 1,
            pageSize = 10,
            search = '',
            idCategoria,
            precioMin,
            precioMax,
            activo,
            sortBy = 'FechaCreacion',
            sortDir = 'DESC'
        } = params;

        const offset = (page - 1) * pageSize;
        const pool = await sql;
        const request = new sql.Request();

        let whereClause = 'WHERE 1=1';
        if (search && search !== 'undefined' && search !== '') {
            whereClause += ' AND (p.Nombre LIKE @search OR p.Sku LIKE @search)';
            request.input('search', sql.NVarChar, `%${search}%`);
        }
        if (idCategoria && idCategoria !== 'undefined' && idCategoria !== '') {
            whereClause += ' AND p.IdCategoria = @idCategoria';
            request.input('idCategoria', sql.Int, idCategoria);
        }
        if (precioMin !== undefined && precioMin !== 'undefined' && precioMin !== '') {
            whereClause += ' AND p.Precio >= @precioMin';
            request.input('precioMin', sql.Decimal(18, 2), precioMin);
        }
        if (precioMax !== undefined && precioMax !== 'undefined' && precioMax !== '') {
            whereClause += ' AND p.Precio <= @precioMax';
            request.input('precioMax', sql.Decimal(18, 2), precioMax);
        }
        if (activo !== undefined && activo !== 'undefined' && activo !== '') {
            whereClause += ' AND p.Activo = @activo';
            request.input('activo', sql.Bit, activo === 'true' || activo === true ? 1 : 0);
        }

        // Validate sortBy and sortDir to prevent SQL Injection
        const allowedSortFields = ['Nombre', 'Precio', 'FechaCreacion', 'Stock'];
        const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'FechaCreacion';
        const validSortDir = sortDir.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        const countQuery = `SELECT COUNT(*) AS total FROM Productos p ${whereClause}`;
        const totalResult = await request.query(countQuery);
        const total = totalResult.recordset[0].total;

        const dataQuery = `
            SELECT p.*, c.Nombre AS CategoriaNombre
            FROM Productos p
            JOIN Categorias c ON p.IdCategoria = c.IdCategoria
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

    async getById(id) {
        const result = await sql.query`
            SELECT p.*, c.Nombre AS CategoriaNombre 
            FROM Productos p 
            JOIN Categorias c ON p.IdCategoria = c.IdCategoria 
            WHERE p.IdProducto = ${id}
        `;
        return result.recordset[0];
    }

    async create(product) {
        const { IdCategoria, Nombre, Descripcion, Sku, Precio, Stock, Activo } = product;
        const result = await sql.query`
            INSERT INTO Productos (IdCategoria, Nombre, Descripcion, Sku, Precio, Stock, Activo)
            VALUES (${IdCategoria}, ${Nombre}, ${Descripcion}, ${Sku}, ${Precio}, ${Stock}, ${Activo === undefined ? 1 : Activo});
            SELECT SCOPE_IDENTITY() AS id;
        `;
        return result.recordset[0].id;
    }

    async update(id, product) {
        const { IdCategoria, Nombre, Descripcion, Sku, Precio, Stock, Activo } = product;
        await sql.query`
            UPDATE Productos
            SET IdCategoria = ${IdCategoria},
                Nombre = ${Nombre},
                Descripcion = ${Descripcion},
                Sku = ${Sku},
                Precio = ${Precio},
                Stock = ${Stock},
                Activo = ${Activo}
            WHERE IdProducto = ${id}
        `;
    }

    async delete(id) {
        await sql.query`DELETE FROM Productos WHERE IdProducto = ${id}`;
    }

    async createBulk(products) {
        // Simple sequential insertion or use Table-Valued Parameters for better performance
        // For a technical test, sequential is easier to implement quickly.
        for (const product of products) {
            await this.create(product);
        }
    }
}

module.exports = new ProductRepository();
