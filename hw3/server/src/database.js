const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '../database/chat.db'));

// 初始化数据库表
function initDatabase() {
  // 创建消息表
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      user_name TEXT NOT NULL,
      content TEXT,
      type TEXT NOT NULL,
      file_url TEXT,
      file_name TEXT,
      file_size INTEGER,
      timestamp INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 创建索引以提高查询性能
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_timestamp ON messages(timestamp DESC);
    CREATE INDEX IF NOT EXISTS idx_user_id ON messages(user_id);
  `);

  console.log('✅ Database initialized');
}

// 插入消息
function insertMessage(message) {
  const stmt = db.prepare(`
    INSERT INTO messages (user_id, user_name, content, type, file_url, file_name, file_size, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  return stmt.run(
    message.userId,
    message.userName,
    message.content || null,
    message.type,
    message.fileUrl || null,
    message.fileName || null,
    message.fileSize || null,
    message.timestamp
  );
}

// 获取最近的消息（分页）
function getMessages(limit = 50, before = null) {
  let query = 'SELECT * FROM messages';
  let params = [];

  if (before) {
    query += ' WHERE timestamp < ?';
    params.push(before);
  }

  query += ' ORDER BY timestamp DESC LIMIT ?';
  params.push(limit);

  const stmt = db.prepare(query);
  const messages = stmt.all(...params);

  // 转换为前端格式
  return messages.reverse().map(msg => ({
    id: msg.id,
    userId: msg.user_id,
    userName: msg.user_name,
    content: msg.content,
    type: msg.type,
    fileUrl: msg.file_url,
    fileName: msg.file_name,
    fileSize: msg.file_size,
    timestamp: msg.timestamp
  }));
}

// 获取消息总数
function getMessageCount() {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM messages');
  return stmt.get().count;
}

// 清空所有消息
function clearMessages() {
  db.exec('DELETE FROM messages');
  console.log('🗑️  All messages cleared');
}

module.exports = {
  initDatabase,
  insertMessage,
  getMessages,
  getMessageCount,
  clearMessages
};
