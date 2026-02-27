const API_BASE_URL = 'http://localhost:4000/api';

export const categoryApi = {
    getAll: async () => {
        const response = await fetch(`${API_BASE_URL}/categorias`);
        if (!response.ok) throw new Error('Error fetching categories');
        return response.json();
    },
    create: async (data: any) => {
        const response = await fetch(`${API_BASE_URL}/categorias`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Error creating category');
        return result;
    },
    update: async (id: number, data: any) => {
        const response = await fetch(`${API_BASE_URL}/categorias/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Error updating category');
        return result;
    },
    delete: async (id: number) => {
        const response = await fetch(`${API_BASE_URL}/categorias/${id}`, {
            method: 'DELETE',
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Error deleting category');
        return result;
    },
};

export const productApi = {
    getPaged: async (params: any) => {
        const query = new URLSearchParams(params).toString();
        const response = await fetch(`${API_BASE_URL}/productos?${query}`);
        if (!response.ok) throw new Error('Error fetching products');
        return response.json();
    },
    create: async (data: any) => {
        const response = await fetch(`${API_BASE_URL}/productos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Error creating product');
        return result;
    },
    update: async (id: number, data: any) => {
        const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Error updating product');
        return result;
    },
    delete: async (id: number) => {
        const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
            method: 'DELETE',
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Error deleting product');
        return result;
    },
    uploadMasive: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch(`${API_BASE_URL}/productos/masivo`, {
            method: 'POST',
            body: formData,
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Error uploading file');
        return result;
    },
};
