# 电商商品列表与详情页开发

课后作业 - 实现电商平台的商品列表页与商品详情页

## 项目概述

本项目使用 Vite + React + TypeScript + Redux Toolkit + Ant Design 开发了一个完整的电商商品展示系统，包含以下核心功能：

- 商品列表展示（支持筛选、排序、分页）
- 商品详情页（展示商品信息、规格选择、加入购物车）
- 购物车功能（加入、删除、修改数量）
- 响应式设计（支持电脑、平板、手机端）

## 技术栈

- **构建工具**: Vite
- **前端框架**: React 18 + TypeScript
- **状态管理**: Redux Toolkit
- **路由**: React Router v6
- **UI 库**: Ant Design
- **Mock 数据**: Mock.js

## 项目结构

```
hw2/
├── src/
│   ├── components/          # 组件目录
│   │   ├── common/         # 通用组件
│   │   │   ├── Header.tsx         # 导航栏
│   │   │   ├── Header.css
│   │   │   ├── FilterBar.tsx      # 筛选组件
│   │   │   └── FilterBar.css
│   │   └── business/       # 业务组件
│   │       ├── ProductCard.tsx    # 商品卡片
│   │       ├── ProductCard.css
│   │       ├── CartDrawer.tsx     # 购物车抽屉
│   │       └── CartDrawer.css
│   ├── pages/              # 页面组件
│   │   ├── ProductList.tsx        # 商品列表页
│   │   ├── ProductList.css
│   │   ├── ProductDetail.tsx      # 商品详情页
│   │   └── ProductDetail.css
│   ├── store/              # Redux 状态管理
│   │   ├── slices/
│   │   │   ├── productsSlice.ts   # 商品状态
│   │   │   └── cartSlice.ts       # 购物车状态
│   │   ├── index.ts               # Store 配置
│   │   └── hooks.ts               # Redux Hooks
│   ├── types/              # TypeScript 类型定义
│   │   └── index.ts
│   ├── mock/               # Mock 数据
│   │   └── products.ts
│   ├── App.tsx             # 应用主组件
│   ├── App.css
│   ├── main.tsx            # 应用入口
│   └── index.css
├── package.json
└── vite.config.ts
```

## 功能实现

### 1. 商品列表页

- ✅ 商品卡片展示（图片、名称、价格、评分、销量）
- ✅ 分类筛选（电子产品、服装、图书、家居、食品、运动）
- ✅ 价格范围筛选（滑块选择）
- ✅ 排序功能（默认、价格升序、价格降序、销量优先）
- ✅ 关键词搜索
- ✅ 分页功能（每页12个商品）
- ✅ 响应式布局

### 2. 商品详情页

- ✅ 商品信息展示（名称、价格、评分、销量、描述）
- ✅ 商品图片展示（支持多图预览）
- ✅ 规格选择（颜色、尺码、容量等）
- ✅ 数量选择（受库存限制）
- ✅ 加入购物车
- ✅ 面包屑导航
- ✅ 返回按钮

### 3. 购物车功能

- ✅ 侧边抽屉展示
- ✅ 显示商品信息（图片、名称、价格、规格）
- ✅ 修改数量
- ✅ 删除商品
- ✅ 清空购物车
- ✅ 实时计算总价和总数量

### 4. 状态管理

使用 Redux Toolkit 管理全局状态：

- **productsSlice**: 管理商品列表、筛选条件、分页状态
- **cartSlice**: 管理购物车商品和抽屉开关状态

### 5. 响应式设计

- 电脑端：列表 4 列显示，筛选栏固定侧边
- 平板端：列表 2-3 列显示
- 手机端：列表 1 列显示，搜索栏全宽，筛选栏可折叠

## 运行项目

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:5173/

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## Mock 数据说明

项目使用 Mock.js 生成 100 个模拟商品数据，包括：

- 随机商品名称（中文）
- 随机价格（10-9999元）
- 随机分类（6个分类）
- 随机图片（使用 Lorem Picsum）
- 随机销量、库存、评分
- 根据分类生成相应的规格选项

## 组件复用性

项目采用组件化开发，主要可复用组件：

- **Header**: 全局导航栏，包含搜索和购物车
- **FilterBar**: 筛选组件，支持分类、价格、排序
- **ProductCard**: 商品卡片，可在列表页使用
- **CartDrawer**: 购物车抽屉，全局共享

## 已实现的作业要求

### ✅ 第一步：项目初始化
- 使用 Vite 创建项目
- 配置 TypeScript
- 集成 Redux Toolkit 和 Ant Design

### ✅ 第二步：组件拆分
- 通用组件：导航栏、分页器、筛选组件
- 业务组件：商品卡片、规格选择器、购物车弹窗
- 页面组件：商品列表页、商品详情页

### ✅ 第三步：状态管理
- Redux Toolkit 实现全局状态
- Props 实现父子组件通信
- 存储商品列表、筛选条件、购物车数据

### ✅ 第四步：响应式 UI
- 使用 Ant Design 组件和栅格系统
- 自定义样式适配不同屏幕尺寸
- 移动端优化

### ✅ 第五步：Mock 数据交互
- 使用 Mock.js 生成商品数据
- 实现筛选（价格、分类）
- 实现排序（价格高低、销量）
- 实现分页加载
- 实现购物车功能

### ✅ 第六步：代码优化
- 组件复用性设计
- 状态管理合理性
- 响应式适配
- TypeScript 类型安全

## 后续优化建议

1. 添加商品收藏功能
2. 实现结算流程
3. 添加商品评论展示
4. 优化图片加载（懒加载）
5. 添加加载动画和骨架屏
6. 实现本地存储（购物车持久化）
7. 添加单元测试

## 开发者

课后作业项目 - 电商平台开发
