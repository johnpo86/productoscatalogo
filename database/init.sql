-- Create database if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'CatalogDB')
BEGIN
    CREATE DATABASE CatalogDB;
END
GO

USE CatalogDB;
GO

-- Table: Categorias
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Categorias]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Categorias] (
        [IdCategoria] INT IDENTITY(1,1) PRIMARY KEY,
        [Nombre] NVARCHAR(100) NOT NULL UNIQUE,
        [Descripcion] NVARCHAR(500),
        [Activo] BIT DEFAULT 1,
        [FechaCreacion] DATETIME2 DEFAULT GETDATE(),
        [FechaModificacion] DATETIME2 DEFAULT GETDATE()
    );
END
GO

-- Table: Productos
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Productos]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Productos] (
        [IdProducto] INT IDENTITY(1,1) PRIMARY KEY,
        [IdCategoria] INT NOT NULL,
        [Nombre] NVARCHAR(200) NOT NULL,
        [Descripcion] NVARCHAR(MAX),
        [Sku] NVARCHAR(50) UNIQUE,
        [Precio] DECIMAL(18, 2) NOT NULL CHECK (Precio > 0),
        [Stock] INT NOT NULL DEFAULT 0,
        [Activo] BIT DEFAULT 1,
        [FechaCreacion] DATETIME2 DEFAULT GETDATE(),
        [FechaModificacion] DATETIME2 DEFAULT GETDATE(),
        CONSTRAINT FK_Productos_Categorias FOREIGN KEY (IdCategoria) REFERENCES Categorias(IdCategoria)
    );
END
GO

-- Indices for performance
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Productos_Nombre')
    CREATE INDEX IX_Productos_Nombre ON Productos(Nombre);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Productos_IdCategoria')
    CREATE INDEX IX_Productos_IdCategoria ON Productos(IdCategoria);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Productos_Precio')
    CREATE INDEX IX_Productos_Precio ON Productos(Precio);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Productos_FechaCreacion')
    CREATE INDEX IX_Productos_FechaCreacion ON Productos(FechaCreacion);
GO

-- Trigger for FechaModificacion on Categorias
CREATE OR ALTER TRIGGER TR_Categorias_Update
ON Categorias
AFTER UPDATE
AS
BEGIN
    UPDATE Categorias
    SET FechaModificacion = GETDATE()
    FROM Categorias c
    JOIN inserted i ON c.IdCategoria = i.IdCategoria;
END
GO

-- Trigger for FechaModificacion on Productos
CREATE OR ALTER TRIGGER TR_Productos_Update
ON Productos
AFTER UPDATE
AS
BEGIN
    UPDATE Productos
    SET FechaModificacion = GETDATE()
    FROM Productos p
    JOIN inserted i ON p.IdProducto = i.IdProducto;
END
GO
