const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const {
  initDatabase,
  insertMessage,
  getMessages,
  getMessageCount
} = require('./database');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// 中间件
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 确保上传目录存在
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// 配置文件上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB
  }
});

// 初始化数据库
initDatabase();

// 存储所有连接的客户端
const clients = new Set();

// WebSocket 连接处理
wss.on('connection', (ws) => {
  console.log('🔌 New client connected. Total clients:', clients.size + 1);
  clients.add(ws);

  // 发送欢迎消息
  ws.send(JSON.stringify({
    type: 'system',
    content: 'Connected to chat server'
  }));

  // 接收消息
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);

      // 保存到数据库
      if (message.type !== 'system') {
        insertMessage(message);
      }

      // 广播给所有客户端
      broadcast(message);
    } catch (error) {
      console.error('❌ Error processing message:', error);
    }
  });

  // 客户端断开
  ws.on('close', () => {
    clients.delete(ws);
    console.log('👋 Client disconnected. Total clients:', clients.size);
  });

  // 错误处理
  ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error);
  });
});

// 广播消息给所有客户端
function broadcast(message) {
  const data = JSON.stringify(message);
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

// REST API 路由

// 获取历史消息
app.get('/api/messages', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const before = req.query.before ? parseInt(req.query.before) : null;

    const messages = getMessages(limit, before);
    const total = getMessageCount();

    res.json({
      messages,
      total,
      hasMore: before ? messages.length === limit : total > limit
    });
  } catch (error) {
    console.error('❌ Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// 文件上传接口
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    res.json({
      success: true,
      fileUrl,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype
    });
  } catch (error) {
    console.error('❌ Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    clients: clients.size,
    messages: getMessageCount()
  });
});

// 启动服务器
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`
🚀 Chat server started!
📡 HTTP Server: http://localhost:${PORT}
🔌 WebSocket: ws://localhost:${PORT}
📊 Total messages: ${getMessageCount()}
  `);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, closing server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
