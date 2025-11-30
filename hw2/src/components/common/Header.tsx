import React from 'react';
import { Layout, Badge, Input, Button } from 'antd';
import { ShoppingCartOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { toggleCart } from '../../store/slices/cartSlice';
import { setKeyword } from '../../store/slices/productsSlice';
import './Header.css';

const { Header: AntHeader } = Layout;
const { Search } = Input;

const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const keyword = useAppSelector((state) => state.products.filter.keyword);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (value: string) => {
    dispatch(setKeyword(value));
    navigate('/');
  };

  const handleCartClick = () => {
    dispatch(toggleCart());
  };

  return (
    <AntHeader className="header">
      <div className="header-content">
        <div className="logo" onClick={() => navigate('/')}>
          <h1>电商平台</h1>
        </div>

        <div className="search-bar">
          <Search
            placeholder="搜索商品"
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            onSearch={handleSearch}
            defaultValue={keyword}
          />
        </div>

        <div className="header-actions">
          <Badge count={totalItems} offset={[10, 0]}>
            <Button
              type="text"
              icon={<ShoppingCartOutlined style={{ fontSize: '24px' }} />}
              onClick={handleCartClick}
              className="cart-button"
            />
          </Badge>
        </div>
      </div>
    </AntHeader>
  );
};

export default Header;
