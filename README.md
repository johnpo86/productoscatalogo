# Catálogo de Productos - Prueba Técnica

Este proyecto es una aplicación full-stack para la gestión de categorías y productos, diseñada para demostrar habilidades en arquitectura de software, dockerización y manejo de SQL Server.

## 🚀 Inicio Rápido

Para levantar todo el stack (Base de Datos, Setup, Backend y Frontend), simplemente ejecuta:

```bash
docker compose up --build
```

### Servicios Disponibles:
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:4000](http://localhost:4000)
- **Documentación Swagger**: [http://localhost:4000/api-docs](http://localhost:4000/api-docs)

---

## 🛠️ Arquitectura y Decisiones Técnicas

### Backend (Node.js/Express)
Se implementó una **Arquitectura por Capas** para garantizar la separación de responsabilidades y facilidad de mantenimiento:
- **Routes**: Definición de endpoints y documentación Swagger.
- **Controllers**: Manejo de peticiones HTTP y validación básica de entrada.
- **Services**: Lógica de negocio (ej. validación de nombres únicos, procesamiento de archivos).
- **Repositories**: Consultas a la base de datos utilizando **Consultas Parametrizadas** para prevenir Inyección SQL.

### Base de Datos (SQL Server)
- **Paginación en el lado del Servidor**: El listado de productos utiliza `OFFSET` y `FETCH NEXT` directamente en SQL Server para optimizar el rendimiento.
- **Soft Delete en Categorías**: Se optó por un borrado lógico (`Activo = 0`) para las categorías para evitar dejar productos "huérfanos" y mantener la integridad referencial.
- **Auditoría**: Se implementaron **Triggers** en SQL Server para actualizar automáticamente el campo `FechaModificacion`.
- **Índices**: Se agregaron índices en `Nombre`, `IdCategoria` y `Precio` para acelerar los filtros frecuentes.

### Frontend (React + Ant Design)
- **Ant Design Table**: Integrado con paginación, filtros y ordenamiento que se ejecutan en el backend.
- **Formularios con Validación**: Los campos obligatorios y reglas de negocio se validan antes de enviar al servidor.
- **UX**: Estados de carga (Spinners) y notificaciones de éxito/error.

---

## 📂 Funcionalidades Principales

### 1. Gestión de Categorías
- CRUD completo. El nombre de la categoría es único y obligatorio.

### 2. Gestión de Productos (CRUD + Filtros)
- **Paginación Real**: Los datos se solicitan al backend según la página y el tamaño seleccionados.
- **Filtros Avanzados**: 
  - Búsqueda por texto (Nombre o SKU).
  - Por categoría.
  - Por rango de precio (Min/Max).
- **Ordenamiento**: Por Nombre, Precio o Fecha de Creación.

### 3. Carga Masiva
- El sistema permite subir archivos `.xlsx` o `.csv` para crear múltiples productos de una sola vez.

---

## 📋 Escritura de Base de Datos (DDL)

El archivo `database/init.sql` contiene la estructura completa. Se ejecuta automáticamente al levantar el contenedor `db-setup`.

```sql
-- Resumen de Tablas
-- [Categorias]: IdCategoria, Nombre, Descripcion, Activo, FechaCreacion, FechaModificacion
-- [Productos]: IdProducto, IdCategoria (FK), Nombre, Descripcion, Sku, Precio, Stock, Activo, FechaCreacion, FechaModificacion
```
