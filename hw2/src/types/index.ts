// 商品接口
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  images?: string[];
  description: string;
  sales: number;
  stock: number;
  rating: number;
  specs?: ProductSpec[];
  tags?: string[];
}

// 商品规格
export interface ProductSpec {
  name: string;
  options: string[];
}

// 购物车商品
export interface CartItem {
  product: Product;
  quantity: number;
  selectedSpecs?: { [key: string]: string };
}

// 筛选条件
export interface FilterState {
  category: string;
  priceRange: [number, number] | null;
  sortBy: 'default' | 'price-asc' | 'price-desc' | 'sales';
  keyword: string;
}

// 分页状态
export interface PaginationState {
  current: number;
  pageSize: number;
  total: number;
}
