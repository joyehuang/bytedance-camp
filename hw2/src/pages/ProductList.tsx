import React from 'react';
import { Row, Col, Pagination, Spin, Empty } from 'antd';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setPage } from '../store/slices/productsSlice';
import ProductCard from '../components/business/ProductCard';
import FilterBar from '../components/common/FilterBar';
import './ProductList.css';

const ProductList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentPageProducts, pagination } = useAppSelector(
    (state) => state.products
  );

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!currentPageProducts) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="product-list-page">
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={24} md={6} lg={6}>
          <FilterBar />
        </Col>

        <Col xs={24} sm={24} md={18} lg={18}>
          <div className="product-list-content">
            {currentPageProducts.length === 0 ? (
              <Empty description="没有找到商品" />
            ) : (
              <>
                <Row gutter={[16, 16]}>
                  {currentPageProducts.map((product) => (
                    <Col
                      key={product.id}
                      xs={24}
                      sm={12}
                      md={12}
                      lg={8}
                      xl={6}
                    >
                      <ProductCard product={product} />
                    </Col>
                  ))}
                </Row>

                <div className="pagination-container">
                  <Pagination
                    current={pagination.current}
                    pageSize={pagination.pageSize}
                    total={pagination.total}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    showTotal={(total) => `共 ${total} 件商品`}
                  />
                </div>
              </>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ProductList;
