# HW3 - Hybrid 聊天应用

一个基于 Web 技术栈的实时聊天应用，支持文本、音频、视频消息发送。

## 项目结构

```
hw3/
├── server/          # Node.js 后端服务器
│   ├── src/
│   │   ├── index.js      # 主服务器文件
│   │   └── database.js   # SQLite 数据库操作
│   ├── database/         # 数据库文件
│   └── uploads/          # 上传文件存储
├── web/             # React 前端应用
│   └── src/
│       ├── components/   # React 组件
│       ├── services/     # 服务层（WebSocket, API）
│       └── types/        # TypeScript 类型定义
└── app/             # React Native 应用壳（待开发）
```

## 技术栈

### 服务端
- **Node.js + Express**: HTTP 服务器
- **WebSocket (ws)**: 实时通信
- **better-sqlite3**: 数据持久化
- **multer**: 文件上传处理

### Web 前端
- **React + TypeScript**: UI 框架
- **Ant Design**: UI 组件库
- **WebSocket API**: 实时通信
- **Axios**: HTTP 请求

## 功能特性

✅ **基础聊天**
- 文本消息收发
- 实时消息推送
- 消息历史记录

✅ **多媒体支持**
- 音频录制和发送
- 音频文件上传
- 视频文件上传
- 文件播放预览

✅ **高级功能**
- 多人群聊（2-5人）
- 聊天记录懒加载
- 消息持久化存储（SQLite）
- 自动重连机制

✅ **用户体验**
- 用户登录（ID + 昵称）
- 在线状态显示
- 消息已读未读
- 滚动自动加载

## 快速开始

### 1. 启动服务器

```bash
cd hw3/server
npm install
npm run dev
```

服务器将运行在:
- HTTP: http://localhost:3001
- WebSocket: ws://localhost:3001

### 2. 启动 Web 前端

```bash
cd hw3/web
npm install
npm run dev
```

Web 应用将运行在 http://localhost:5173

### 3. 使用应用

1. 打开浏览器访问 http://localhost:5173
2. 输入用户名和用户ID登录
3. 开始聊天！

**多人聊天测试**：
- 打开多个浏览器窗口
- 使用不同的用户ID登录
- 在不同窗口发送消息测试实时通信

## API 接口

### REST API

```
GET  /api/messages          # 获取历史消息
POST /api/upload            # 上传文件
GET  /api/health            # 健康检查
```

### WebSocket 消息格式

```typescript
{
  userId: string;
  userName: string;
  content?: string;
  type: 'text' | 'audio' | 'video' | 'system';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  timestamp: number;
}
```

## 项目特点

### 1. 消息持久化
使用 SQLite 数据库存储所有聊天记录，支持历史消息查询和懒加载。

### 2. 实时通信
基于 WebSocket 实现真正的实时消息推送，支持多人同时在线。

### 3. 多媒体支持
- 浏览器原生录音 API
- 文件上传和管理
- 音视频播放器集成

### 4. 自动重连
WebSocket 断线自动重连机制，确保连接稳定性。

### 5. 响应式设计
适配桌面和移动端浏览器。

## 开发计划

- [x] 服务器端开发
- [x] Web 前端开发
- [x] 文本消息功能
- [x] 音频录制和发送
- [x] 文件上传功能
- [x] 多人群聊支持
- [x] 消息懒加载
- [x] 数据持久化
- [ ] React Native App 壳
- [ ] 更多功能优化

## 许可证

MIT
