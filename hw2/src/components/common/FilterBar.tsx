import React from 'react';
import { Card, Radio, Slider, Button, Space, Tag } from 'antd';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import {
  setCategory,
  setPriceRange,
  setSortBy,
  resetFilters,
} from '../../store/slices/productsSlice';
import type { FilterState } from '../../types';
import './FilterBar.css';

const categories = ['全部', '电子产品', '服装', '图书', '家居', '食品', '运动'];

const FilterBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const filter = useAppSelector((state) => state.products.filter);
  const [priceRange, setPriceRangeLocal] = React.useState<[number, number]>([
    0, 10000,
  ]);

  const handleCategoryChange = (category: string) => {
    dispatch(setCategory(category === '全部' ? '' : category));
  };

  const handleSortChange = (e: any) => {
    dispatch(setSortBy(e.target.value as FilterState['sortBy']));
  };

  const handlePriceRangeChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      setPriceRangeLocal(value as [number, number]);
    }
  };

  const handlePriceRangeComplete = () => {
    dispatch(setPriceRange(priceRange));
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
    setPriceRangeLocal([0, 10000]);
  };

  return (
    <Card className="filter-bar" bordered={false}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 分类筛选 */}
        <div className="filter-section">
          <h3>商品分类</h3>
          <div className="category-tags">
            {categories.map((cat) => (
              <Tag.CheckableTag
                key={cat}
                checked={
                  cat === '全部'
                    ? filter.category === ''
                    : filter.category === cat
                }
                onChange={() => handleCategoryChange(cat)}
                className="category-tag"
              >
                {cat}
              </Tag.CheckableTag>
            ))}
          </div>
        </div>

        {/* 价格筛选 */}
        <div className="filter-section">
          <h3>价格范围</h3>
          <Slider
            range
            min={0}
            max={10000}
            step={100}
            value={priceRange}
            onChange={handlePriceRangeChange}
            onChangeComplete={handlePriceRangeComplete}
            tooltip={{ formatter: (value) => `¥${value}` }}
          />
          <div className="price-range-text">
            ¥{priceRange[0]} - ¥{priceRange[1]}
          </div>
        </div>

        {/* 排序 */}
        <div className="filter-section">
          <h3>排序方式</h3>
          <Radio.Group value={filter.sortBy} onChange={handleSortChange}>
            <Space direction="vertical">
              <Radio value="default">默认排序</Radio>
              <Radio value="price-asc">价格从低到高</Radio>
              <Radio value="price-desc">价格从高到低</Radio>
              <Radio value="sales">销量优先</Radio>
            </Space>
          </Radio.Group>
        </div>

        {/* 重置按钮 */}
        <Button block onClick={handleResetFilters}>
          重置筛选
        </Button>
      </Space>
    </Card>
  );
};

export default FilterBar;
