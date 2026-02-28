import { Layout, Menu, theme } from 'antd';
import { ShoppingCartOutlined, TagsOutlined } from '@ant-design/icons';
import { useState } from 'react';
import Products from './components/Products';
import Categories from './components/Categories';
import './App.css';

const { Header, Content, Footer, Sider } = Layout;

const App: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState('products');
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: 'products',
      icon: <ShoppingCartOutlined />,
      label: 'Productos',
    },
    {
      key: 'categories',
      icon: <TagsOutlined />,
      label: 'Categorías',
    },
  ];

  const renderContent = () => {
    switch (selectedKey) {
      case 'products':
        return <Products />;
      case 'categories':
        return <Categories />;
      default:
        return <Products />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        theme="dark"
      >
        <div className="demo-logo-vertical">
          🛒 Catálogo
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['products']}
          items={menuItems}
          onClick={(e) => setSelectedKey(e.key)}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: '0 24px', background: colorBgContainer, display: 'flex', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>{selectedKey === 'products' ? 'Productos' : 'Categorías'}</h2>
        </Header>
        <Content style={{ margin: '24px 16px', overflow: 'initial' }}>
          <div
            style={{
              padding: 24,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              minHeight: 'calc(100vh - 160px)',
            }}
          >
            {renderContent()}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Prueba Técnica ©{new Date().getFullYear()} creado con ❤️ por John
        </Footer>
      </Layout>
    </Layout>
  );
};

export default App;
