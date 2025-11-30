import React from 'react';
import { Card, Tag, Rate, Button } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../types';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/product/${product.id}`);
  };

  return (
    <Card
      hoverable
      className="product-card"
      cover={
        <div className="product-image-wrapper">
          <img alt={product.name} src={product.image} />
          {product.tags && product.tags.length > 0 && (
            <div className="product-tags">
              {product.tags.map((tag) => (
                <Tag key={tag} color="red">
                  {tag}
                </Tag>
              ))}
            </div>
          )}
        </div>
      }
      onClick={handleCardClick}
    >
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <div className="product-description">{product.description}</div>

        <div className="product-rating">
          <Rate disabled value={product.rating} allowHalf />
          <span className="sales-text">已售 {product.sales}</span>
        </div>

        <div className="product-footer">
          <div className="product-price">
            <span className="current-price">¥{product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="original-price">
                ¥{product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <Button
            type="primary"
            icon={<ShoppingCartOutlined />}
            onClick={handleAddToCart}
            className="add-cart-btn"
          >
            加入购物车
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
