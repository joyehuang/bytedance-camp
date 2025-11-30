import React from 'react';
import { Drawer, List, Button, InputNumber, Empty, Space, Divider } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import {
  setCartOpen,
  removeFromCart,
  updateQuantity,
  clearCart,
} from '../../store/slices/cartSlice';
import './CartDrawer.css';

const CartDrawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, isOpen } = useAppSelector((state) => state.cart);

  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleClose = () => {
    dispatch(setCartOpen(false));
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    dispatch(updateQuantity({ index, quantity }));
  };

  const handleRemove = (index: number) => {
    dispatch(removeFromCart(index));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  return (
    <Drawer
      title="购物车"
      placement="right"
      onClose={handleClose}
      open={isOpen}
      width={400}
      className="cart-drawer"
    >
      {items.length === 0 ? (
        <Empty description="购物车是空的" />
      ) : (
        <>
          <List
            dataSource={items}
            renderItem={(item, index) => (
              <List.Item className="cart-item">
                <div className="cart-item-content">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="cart-item-image"
                  />
                  <div className="cart-item-info">
                    <h4>{item.product.name}</h4>
                    {item.selectedSpecs && (
                      <div className="cart-item-specs">
                        {Object.entries(item.selectedSpecs).map(
                          ([key, value]) => (
                            <span key={key}>
                              {key}: {value}
                            </span>
                          )
                        )}
                      </div>
                    )}
                    <div className="cart-item-price">
                      ¥{item.product.price.toFixed(2)}
                    </div>
                    <div className="cart-item-actions">
                      <InputNumber
                        min={1}
                        max={item.product.stock}
                        value={item.quantity}
                        onChange={(value) =>
                          handleQuantityChange(index, value || 1)
                        }
                        size="small"
                      />
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemove(index)}
                        size="small"
                      />
                    </div>
                  </div>
                </div>
              </List.Item>
            )}
          />

          <Divider />

          <div className="cart-summary">
            <div className="cart-summary-row">
              <span>商品数量：</span>
              <span>{totalItems} 件</span>
            </div>
            <div className="cart-summary-row total">
              <span>总计：</span>
              <span className="total-price">¥{totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Button type="primary" block size="large">
              去结算
            </Button>
            <Button block onClick={handleClearCart}>
              清空购物车
            </Button>
          </Space>
        </>
      )}
    </Drawer>
  );
};

export default CartDrawer;
