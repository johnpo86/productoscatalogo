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
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div className="demo-logo-vertical" style={{ color: 'white', padding: '16px', fontSize: '1.2rem', fontWeight: 'bold' }}>
          🛒 Catálogo Pro
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
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '24px 16px 0' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {renderContent()}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Prueba Técnica ©{new Date().getFullYear()} Creado por Antigravity
        </Footer>
      </Layout>
    </Layout>
  );
};

export default App;
