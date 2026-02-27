import React, { useEffect, useState, useCallback } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, Space, Tag, message, Upload, Card, Row, Col } from 'antd';
import { InboxOutlined, SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { productApi, categoryApi } from '../api/apiClient';

const { Option } = Select;

const Products: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isUploadVisible, setIsUploadVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [form] = Form.useForm();
    const [filterForm] = Form.useForm();
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
    const [sorter, setSorter] = useState({ field: 'FechaCreacion', order: 'DESC' });

    const fetchCategories = async () => {
        try {
            const cats = await categoryApi.getAll();
            setCategories(cats);
        } catch (error) {
            console.error('Error fetching categories', error);
        }
    };

    const fetchData = useCallback(async (page: number, pageSize: number, filters: any = {}, sort: any = {}) => {
        setLoading(true);
        try {
            const params = {
                page,
                pageSize,
                ...filters,
                sortBy: sort.field || 'FechaCreacion',
                sortDir: sort.order === 'ascend' ? 'ASC' : 'DESC',
            };
            const result = await productApi.getPaged(params);
            setData(result.items);
            setTotal(result.total);
        } catch (error: any) {
            message.error(error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
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
        setEditingProduct(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (record: any) => {
        setEditingProduct(record);
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    const handleDelete = async (id: number) => {
        try {
            await productApi.delete(id);
            message.success('Producto eliminado con éxito');
            fetchData(pagination.current, pagination.pageSize, filterForm.getFieldsValue(), sorter);
        } catch (error: any) {
            message.error(error.message);
        }
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            if (editingProduct) {
                await productApi.update(editingProduct.IdProducto, values);
                message.success('Producto actualizado con éxito');
            } else {
                await productApi.create(values);
                message.success('Producto creado con éxito');
            }
            setIsModalVisible(false);
            fetchData(pagination.current, pagination.pageSize, filterForm.getFieldsValue(), sorter);
        } catch (error: any) {
            message.error(error.message);
        }
    };

    const handleUpload = async (info: any) => {
        const { file } = info;
        try {
            const result = await productApi.uploadMasive(file);
            message.success(result.message);
            setIsUploadVisible(false);
            fetchData(1, pagination.pageSize);
        } catch (error: any) {
            message.error(error.message);
        }
    };

    const columns = [
        { title: 'Nombre', dataIndex: 'Nombre', key: 'Nombre', sorter: true },
        { title: 'SKU', dataIndex: 'Sku', key: 'Sku' },
        { title: 'Categoría', dataIndex: 'CategoriaNombre', key: 'CategoriaNombre' },
        { title: 'Precio', dataIndex: 'Precio', key: 'Precio', sorter: true, render: (v: number) => `$${v.toFixed(2)}` },
        { title: 'Stock', dataIndex: 'Stock', key: 'Stock', sorter: true },
        {
            title: 'Estado',
            dataIndex: 'Activo',
            key: 'Activo',
            render: (v: boolean) => <Tag color={v ? 'green' : 'red'}>{v ? 'Activo' : 'Inactivo'}</Tag>,
        },
        {
            title: 'Acciones',
            key: 'actions',
            render: (_: any, record: any) => (
                <Space>
                    <Button type="link" onClick={() => handleEdit(record)}>Editar</Button>
                    <Button type="link" danger onClick={() => handleDelete(record.IdProducto)}>Eliminar</Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Card style={{ marginBottom: 16 }} size="small">
                <Form form={filterForm} layout="inline" onFinish={handleFilter} style={{ justifyContent: 'center' }}>
                    <Form.Item name="search" label="Buscar">
                        <Input placeholder="Nombre o SKU" prefix={<SearchOutlined />} style={{ width: 180 }} />
                    </Form.Item>
                    <Form.Item name="idCategoria" label="Categoría">
                        <Select placeholder="Seleccionar" style={{ width: 150 }} allowClear>
                            {categories.map(c => <Option key={c.IdCategoria} value={c.IdCategoria}>{c.Nombre}</Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item name="precioMin" label="Precio Min">
                        <InputNumber min={0} />
                    </Form.Item>
                    <Form.Item name="precioMax" label="Precio Max">
                        <InputNumber min={0} />
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
                <h2>Gestión de Productos</h2>
                <Space>
                    <Button onClick={() => setIsUploadVisible(true)} icon={<InboxOutlined />}>Carga Masiva</Button>
                    <Button type="primary" onClick={handleAdd}>Agregar Producto</Button>
                </Space>
            </div>

            <Table
                dataSource={data}
                columns={columns}
                rowKey="IdProducto"
                pagination={{
                    ...pagination,
                    total,
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '20', '50'],
                }}
                loading={loading}
                onChange={handleTableChange}
            />

            {/* Product Form Modal */}
            <Modal
                title={editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={() => setIsModalVisible(false)}
                width={600}
            >
                <Form form={form} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="Nombre" label="Nombre" rules={[{ required: true, message: 'Requerido' }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="Sku" label="SKU">
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="IdCategoria" label="Categoría" rules={[{ required: true, message: 'Requerido' }]}>
                                <Select placeholder="Seleccionar">
                                    {categories.map(c => <Option key={c.IdCategoria} value={c.IdCategoria}>{c.Nombre}</Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="Precio" label="Precio" rules={[{ required: true, message: 'Requerido' }]}>
                                <InputNumber min={0.01} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="Stock" label="Stock" initialValue={0}>
                                <InputNumber min={0} style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="Activo" label="Estado" initialValue={true}>
                                <Select>
                                    <Option value={true}>Activo</Option>
                                    <Option value={false}>Inactivo</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="Descripcion" label="Descripción">
                        <Input.TextArea rows={3} />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Upload Modal */}
            <Modal
                title="Carga Masiva de Productos"
                open={isUploadVisible}
                onCancel={() => setIsUploadVisible(false)}
                footer={null}
            >
                <Upload.Dragger
                    name="file"
                    multiple={false}
                    beforeUpload={(file) => {
                        handleUpload({ file });
                        return false;
                    }}
                    accept=".xlsx,.csv"
                >
                    <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                    <p className="ant-upload-text">Haz clic o arrastra un archivo Excel/CSV para cargar</p>
                    <p className="ant-upload-hint">Debe incluir columnas: Nombre, IdCategoria, Precio, etc.</p>
                </Upload.Dragger>
            </Modal>
        </div>
    );
};

export default Products;
