import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Header from './components/common/Header';
import CartDrawer from './components/business/CartDrawer';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import './App.css';

const { Content, Footer } = Layout;

function App() {
  return (
    <BrowserRouter>
      <Layout className="app-layout">
        <Header />
        <Content className="app-content">
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
          </Routes>
        </Content>
        <Footer className="app-footer">
          电商平台 ©2024 - 课后作业项目
        </Footer>
        <CartDrawer />
      </Layout>
    </BrowserRouter>
  );
}

export default App;
