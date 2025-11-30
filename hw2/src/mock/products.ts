import Mock from 'mockjs';
import type { Product } from '../types';

const categories = ['电子产品', '服装', '图书', '家居', '食品', '运动'];
const tags = ['热销', '新品', '推荐', '限时优惠', '包邮'];

// 生成商品图片URL
const generateImageUrl = (index: number): string => {
  return `https://picsum.photos/400/400?random=${index}`;
};

// 生成商品数据
export const generateProducts = (count: number = 100): Product[] => {
  const products: Product[] = [];

  for (let i = 1; i <= count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const price = Mock.Random.float(10, 9999, 2, 2);
    const originalPrice = price * Mock.Random.float(1.1, 1.5, 2, 2);

    const product: Product = {
      id: `product-${i}`,
      name: Mock.Random.ctitle(5, 15),
      price,
      originalPrice,
      category,
      image: generateImageUrl(i),
      images: Array.from({ length: 5 }, (_, idx) => generateImageUrl(i * 10 + idx)),
      description: Mock.Random.cparagraph(3, 7),
      sales: Mock.Random.integer(0, 10000),
      stock: Mock.Random.integer(0, 1000),
      rating: Mock.Random.float(3, 5, 1, 1),
      specs: generateSpecs(category),
      tags: Mock.Random.shuffle(tags).slice(0, Mock.Random.integer(1, 3)),
    };

    products.push(product);
  }

  return products;
};

// 根据分类生成不同的规格
const generateSpecs = (category: string) => {
  switch (category) {
    case '电子产品':
      return [
        { name: '颜色', options: ['黑色', '白色', '金色', '蓝色'] },
        { name: '容量', options: ['64GB', '128GB', '256GB', '512GB'] },
      ];
    case '服装':
      return [
        { name: '颜色', options: ['黑色', '白色', '红色', '蓝色'] },
        { name: '尺码', options: ['S', 'M', 'L', 'XL', 'XXL'] },
      ];
    case '图书':
      return [
        { name: '版本', options: ['平装', '精装', '电子版'] },
      ];
    case '家居':
      return [
        { name: '颜色', options: ['原木色', '白色', '黑色', '灰色'] },
        { name: '尺寸', options: ['小号', '中号', '大号'] },
      ];
    case '食品':
      return [
        { name: '规格', options: ['500g', '1kg', '2kg'] },
        { name: '口味', options: ['原味', '甜味', '咸味'] },
      ];
    case '运动':
      return [
        { name: '颜色', options: ['黑色', '白色', '红色', '蓝色'] },
        { name: '尺码', options: ['39', '40', '41', '42', '43'] },
      ];
    default:
      return [];
  }
};

// 导出模拟数据
export const mockProducts = generateProducts(100);
