import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Row,
  Col,
  Image,
  Button,
  InputNumber,
  Rate,
  Tag,
  Space,
  Radio,
  message,
  Breadcrumb,
} from 'antd';
import { ShoppingCartOutlined, LeftOutlined } from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { addToCart } from '../store/slices/cartSlice';
import './ProductDetail.css';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const product = useAppSelector((state) =>
    state.products.allProducts.find((p) => p.id === id)
  );

  const [quantity, setQuantity] = useState(1);
  const [selectedSpecs, setSelectedSpecs] = useState<{
    [key: string]: string;
  }>({});
  const [currentImage, setCurrentImage] = useState(0);

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="not-found">
          <h2>商品未找到</h2>
          <Button onClick={() => navigate('/')}>返回首页</Button>
        </div>
      </div>
    );
  }

  const handleSpecChange = (specName: string, option: string) => {
    setSelectedSpecs((prev) => ({ ...prev, [specName]: option }));
  };

  const handleAddToCart = () => {
    // 检查是否选择了所有规格
    if (product.specs && product.specs.length > 0) {
      const allSelected = product.specs.every((spec) => selectedSpecs[spec.name]);
      if (!allSelected) {
        message.warning('请选择商品规格');
        return;
      }
    }

    dispatch(
      addToCart({
        product,
        quantity,
        selectedSpecs: Object.keys(selectedSpecs).length > 0 ? selectedSpecs : undefined,
      })
    );
    message.success('已加入购物车');
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // 这里可以导航到结算页面
    message.info('立即购买功能待实现');
  };

  const images = product.images || [product.image];

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <Breadcrumb
          items={[
            { title: '首页', onClick: () => navigate('/') },
            { title: product.category },
            { title: product.name },
          ]}
          className="breadcrumb"
        />

        <Button
          icon={<LeftOutlined />}
          onClick={() => navigate(-1)}
          className="back-button"
        >
          返回
        </Button>

        <Row gutter={[48, 48]} className="product-detail-content">
          <Col xs={24} md={12}>
            <div className="product-images">
              <Image.PreviewGroup>
                <Image
                  src={images[currentImage]}
                  alt={product.name}
                  className="main-image"
                />
              </Image.PreviewGroup>

              <div className="thumbnail-list">
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    className={`thumbnail ${
                      currentImage === index ? 'active' : ''
                    }`}
                    onClick={() => setCurrentImage(index)}
                  />
                ))}
              </div>
            </div>
          </Col>

          <Col xs={24} md={12}>
            <div className="product-info-detail">
              <h1 className="product-title">{product.name}</h1>

              {product.tags && product.tags.length > 0 && (
                <div className="product-tags">
                  {product.tags.map((tag) => (
                    <Tag key={tag} color="red">
                      {tag}
                    </Tag>
                  ))}
                </div>
              )}

              <div className="product-rating-detail">
                <Rate disabled value={product.rating} allowHalf />
                <span className="rating-text">{product.rating} 分</span>
                <span className="sales-text">已售 {product.sales} 件</span>
              </div>

              <div className="product-price-detail">
                <div className="price-row">
                  <span className="price-label">价格</span>
                  <span className="current-price">
                    ¥{product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="original-price">
                      ¥{product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {product.specs && product.specs.length > 0 && (
                <div className="product-specs">
                  {product.specs.map((spec) => (
                    <div key={spec.name} className="spec-item">
                      <div className="spec-label">{spec.name}</div>
                      <Radio.Group
                        value={selectedSpecs[spec.name]}
                        onChange={(e) =>
                          handleSpecChange(spec.name, e.target.value)
                        }
                        className="spec-options"
                      >
                        {spec.options.map((option) => (
                          <Radio.Button key={option} value={option}>
                            {option}
                          </Radio.Button>
                        ))}
                      </Radio.Group>
                    </div>
                  ))}
                </div>
              )}

              <div className="product-quantity">
                <span className="quantity-label">数量</span>
                <InputNumber
                  min={1}
                  max={product.stock}
                  value={quantity}
                  onChange={(value) => setQuantity(value || 1)}
                />
                <span className="stock-text">库存 {product.stock} 件</span>
              </div>

              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Button
                  type="primary"
                  size="large"
                  block
                  icon={<ShoppingCartOutlined />}
                  onClick={handleAddToCart}
                >
                  加入购物车
                </Button>
                <Button size="large" block onClick={handleBuyNow}>
                  立即购买
                </Button>
              </Space>

              <div className="product-description-detail">
                <h3>商品描述</h3>
                <p>{product.description}</p>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ProductDetail;
