import React, { useEffect, useState, useCallback } from 'react';
import { Table, Button, Modal, Form, Input, message, Space, Tag, Card, Select } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { categoryApi } from '../api/apiClient';

const Categories: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [form] = Form.useForm();
    const [filterForm] = Form.useForm();
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
    const [sorter, setSorter] = useState({ field: 'Nombre', order: 'ASC' });

    const fetchData = useCallback(async (page: number, pageSize: number, filters: any = {}, sort: any = {}) => {
        setLoading(true);
        try {
            const params = {
                page,
                pageSize,
                ...filters,
                sortBy: sort.field || 'Nombre',
                sortDir: sort.order === 'descend' ? 'DESC' : 'ASC',
            };
            const result = await categoryApi.getPaged(params);
            setData(result.items);
            setTotal(result.total);
        } catch (error: any) {
            message.error(error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData(pagination.current, pagination.pageSize);
    }, [fetchData, pagination.current, pagination.pageSize]);

    const handleTableChange = (pag: any, _filters: any, sorter: any) => {
        setPagination({ current: pag.current, pageSize: pag.pageSize });
        setSorter({ field: sorter.field, order: sorter.order });
        fetchData(pag.current, pag.pageSize, filterForm.getFieldsValue(), sorter);
    };

    const handleFilter = () => {
        setPagination({ ...pagination, current: 1 });
        fetchData(1, pagination.pageSize, filterForm.getFieldsValue(), sorter);
    };

    const handleResetFilters = () => {
        filterForm.resetFields();
        handleFilter();
    };

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
            fetchData(pagination.current, pagination.pageSize, filterForm.getFieldsValue(), sorter);
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
            fetchData(pagination.current, pagination.pageSize, filterForm.getFieldsValue(), sorter);
        } catch (error: any) {
            message.error(error.message);
        }
    };

    const columns = [
        { title: 'Nombre', dataIndex: 'Nombre', key: 'Nombre', sorter: true },
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
            <Card style={{ marginBottom: 16 }} size="small">
                <Form form={filterForm} layout="inline" onFinish={handleFilter} style={{ justifyContent: 'center' }}>
                    <Form.Item name="search" label="Buscar">
                        <Input placeholder="Nombre o descripción" prefix={<SearchOutlined />} style={{ width: 250 }} />
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit" icon={<FilterOutlined />}>Filtrar</Button>
                            <Button onClick={handleResetFilters}>Limpiar</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>

            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                <h2>Gestión de Categorías</h2>
                <Button type="primary" onClick={handleAdd}>Agregar Categoría</Button>
            </div>

            <Table
                dataSource={data}
                columns={columns}
                rowKey="IdCategoria"
                pagination={{
                    ...pagination,
                    total,
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '20', '50'],
                }}
                loading={loading}
                onChange={handleTableChange}
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
                    <Form.Item name="Activo" label="Estado" initialValue={true}>
                        <Select>
                            <Select.Option value={true}>Activo</Select.Option>
                            <Select.Option value={false}>Inactivo</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Categories;
