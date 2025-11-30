import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Product, FilterState, PaginationState } from '../../types';
import { mockProducts } from '../../mock/products';

interface ProductsState {
  allProducts: Product[];
  filteredProducts: Product[];
  currentPageProducts: Product[];
  filter: FilterState;
  pagination: PaginationState;
}

const initialState: ProductsState = {
  allProducts: mockProducts,
  filteredProducts: mockProducts,
  currentPageProducts: [],
  filter: {
    category: '',
    priceRange: null,
    sortBy: 'default',
    keyword: '',
  },
  pagination: {
    current: 1,
    pageSize: 12,
    total: mockProducts.length,
  },
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<string>) => {
      state.filter.category = action.payload;
      state.pagination.current = 1;
      applyFilters(state);
    },
    setPriceRange: (state, action: PayloadAction<[number, number] | null>) => {
      state.filter.priceRange = action.payload;
      state.pagination.current = 1;
      applyFilters(state);
    },
    setSortBy: (state, action: PayloadAction<FilterState['sortBy']>) => {
      state.filter.sortBy = action.payload;
      applyFilters(state);
    },
    setKeyword: (state, action: PayloadAction<string>) => {
      state.filter.keyword = action.payload;
      state.pagination.current = 1;
      applyFilters(state);
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.current = action.payload;
      updateCurrentPage(state);
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pagination.pageSize = action.payload;
      state.pagination.current = 1;
      applyFilters(state);
    },
    resetFilters: (state) => {
      state.filter = initialState.filter;
      state.pagination.current = 1;
      applyFilters(state);
    },
  },
});

// 应用所有筛选和排序
const applyFilters = (state: ProductsState) => {
  let products = [...state.allProducts];

  // 分类筛选
  if (state.filter.category) {
    products = products.filter((p) => p.category === state.filter.category);
  }

  // 价格范围筛选
  if (state.filter.priceRange) {
    const [min, max] = state.filter.priceRange;
    products = products.filter((p) => p.price >= min && p.price <= max);
  }

  // 关键词搜索
  if (state.filter.keyword) {
    const keyword = state.filter.keyword.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(keyword) ||
        p.description.toLowerCase().includes(keyword)
    );
  }

  // 排序
  switch (state.filter.sortBy) {
    case 'price-asc':
      products.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      products.sort((a, b) => b.price - a.price);
      break;
    case 'sales':
      products.sort((a, b) => b.sales - a.sales);
      break;
    default:
      break;
  }

  state.filteredProducts = products;
  state.pagination.total = products.length;
  updateCurrentPage(state);
};

// 更新当前页商品
const updateCurrentPage = (state: ProductsState) => {
  const { current, pageSize } = state.pagination;
  const start = (current - 1) * pageSize;
  const end = start + pageSize;
  state.currentPageProducts = state.filteredProducts.slice(start, end);
};

export const {
  setCategory,
  setPriceRange,
  setSortBy,
  setKeyword,
  setPage,
  setPageSize,
  resetFilters,
} = productsSlice.actions;

export default productsSlice.reducer;
