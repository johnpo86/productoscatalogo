import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Space, Tag } from 'antd';
import { categoryApi } from '../api/apiClient';

const Categories: React.FC = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [form] = Form.useForm();

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const data = await categoryApi.getAll();
            setCategories(data);
        } catch (error: any) {
            message.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAdd = () => {
        setEditingCategory(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (record: any) => {
        setEditingCategory(record);
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    const handleDelete = async (id: number) => {
        try {
            await categoryApi.delete(id);
            message.success('Categoría eliminada con éxito');
            fetchCategories();
        } catch (error: any) {
            message.error(error.message);
        }
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            if (editingCategory) {
                await categoryApi.update(editingCategory.IdCategoria, values);
                message.success('Categoría actualizada con éxito');
            } else {
                await categoryApi.create(values);
                message.success('Categoría creada con éxito');
            }
            setIsModalVisible(false);
            fetchCategories();
        } catch (error: any) {
            message.error(error.message);
        }
    };

    const columns = [
        { title: 'Nombre', dataIndex: 'Nombre', key: 'Nombre' },
        { title: 'Descripción', dataIndex: 'Descripcion', key: 'Descripcion' },
        {
            title: 'Estado',
            dataIndex: 'Activo',
            key: 'Activo',
            render: (activo: boolean) => (
                <Tag color={activo ? 'green' : 'red'}>{activo ? 'Activo' : 'Inactivo'}</Tag>
            ),
        },
        {
            title: 'Acciones',
            key: 'actions',
            render: (_: any, record: any) => (
                <Space>
                    <Button type="link" onClick={() => handleEdit(record)}>Editar</Button>
                    <Button type="link" danger onClick={() => handleDelete(record.IdCategoria)}>Eliminar</Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                <h2>Gestión de Categorías</h2>
                <Button type="primary" onClick={handleAdd}>Agregar Categoría</Button>
            </div>
            <Table
                dataSource={categories}
                columns={columns}
                rowKey="IdCategoria"
                loading={loading}
            />

            <Modal
                title={editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={() => setIsModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="Nombre"
                        label="Nombre"
                        rules={[{ required: true, message: 'El nombre es obligatorio' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name="Descripcion" label="Descripción">
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Categories;
