import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Modal, Input, Button, Spin, message as antdMessage } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import MessageItem from './components/MessageItem';
import MessageInput from './components/MessageInput';
import WebSocketService from './services/websocket';
import { getMessages } from './services/api';
import type { Message, User } from './types';
import './App.css';

const wsService = new WebSocketService('ws://localhost:3001');

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // 滚动到底部
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // 加载历史消息
  const loadHistoryMessages = useCallback(async (before?: number) => {
    if (!hasMore && before) return;

    setIsLoadingMore(true);
    try {
      const data = await getMessages(50, before);
      if (before) {
        setMessages((prev) => [...data.messages, ...prev]);
      } else {
        setMessages(data.messages);
        setTimeout(scrollToBottom, 100);
      }
      setHasMore(data.hasMore);
    } catch (error) {
      console.error('Failed to load messages:', error);
      antdMessage.error('加载消息失败');
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasMore, scrollToBottom]);

  // 监听滚动事件，实现懒加载
  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container || isLoadingMore || !hasMore) return;

    if (container.scrollTop < 100) {
      const oldestMessage = messages[0];
      if (oldestMessage) {
        loadHistoryMessages(oldestMessage.timestamp);
      }
    }
  }, [isLoadingMore, hasMore, messages, loadHistoryMessages]);

  // 用户登录
  const handleLogin = async (userName: string, userId: string) => {
    if (!userName.trim() || !userId.trim()) {
      antdMessage.error('请输入用户名和ID');
      return;
    }

    setUser({ name: userName, id: userId });

    try {
      await wsService.connect();
      setIsConnected(true);

      // 加载历史消息
      await loadHistoryMessages();

      antdMessage.success('连接成功');
    } catch (error) {
      console.error('Connection failed:', error);
      antdMessage.error('连接失败');
    }
  };

  // 发送文本消息
  const handleSendText = (content: string) => {
    if (!user) return;

    const message: Message = {
      userId: user.id,
      userName: user.name,
      content,
      type: 'text',
      timestamp: Date.now(),
    };

    wsService.sendMessage(message);
  };

  // 发送音频
  const handleSendAudio = (fileUrl: string, fileName: string, fileSize: number) => {
    if (!user) return;

    const message: Message = {
      userId: user.id,
      userName: user.name,
      type: 'audio',
      fileUrl,
      fileName,
      fileSize,
      timestamp: Date.now(),
    };

    wsService.sendMessage(message);
  };

  // 发送视频
  const handleSendVideo = (fileUrl: string, fileName: string, fileSize: number) => {
    if (!user) return;

    const message: Message = {
      userId: user.id,
      userName: user.name,
      type: 'video',
      fileUrl,
      fileName,
      fileSize,
      timestamp: Date.now(),
    };

    wsService.sendMessage(message);
  };

  // 监听 WebSocket 消息
  useEffect(() => {
    const unsubscribe = wsService.onMessage((message) => {
      setMessages((prev) => {
        // 避免重复消息
        if (prev.some((m) => m.timestamp === message.timestamp && m.userId === message.userId)) {
          return prev;
        }
        return [...prev, message];
      });

      // 滚动到底部
      setTimeout(scrollToBottom, 100);
    });

    return () => unsubscribe();
  }, [scrollToBottom]);

  // 组件卸载时断开连接
  useEffect(() => {
    return () => {
      wsService.disconnect();
    };
  }, []);

  if (!user) {
    return <LoginModal onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      <div className="app-header">
        <h2>聊天室</h2>
        <div className="user-info">
          <span>{user.name}</span>
          <span className={isConnected ? 'status-online' : 'status-offline'}>
            {isConnected ? '● 在线' : '● 离线'}
          </span>
        </div>
      </div>

      <div
        className="messages-container"
        ref={messagesContainerRef}
        onScroll={handleScroll}
      >
        {isLoadingMore && (
          <div style={{ textAlign: 'center', padding: '10px' }}>
            <Spin indicator={<LoadingOutlined />} />
          </div>
        )}
        {messages.map((message, index) => (
          <MessageItem key={index} message={message} currentUserId={user.id} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput
        onSendText={handleSendText}
        onSendAudio={handleSendAudio}
        onSendVideo={handleSendVideo}
      />
    </div>
  );
}

// 登录弹窗组件
const LoginModal: React.FC<{ onLogin: (name: string, id: string) => void }> = ({
  onLogin,
}) => {
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');

  const handleSubmit = () => {
    onLogin(userName, userId);
  };

  return (
    <Modal
      title="登录聊天室"
      open={true}
      onOk={handleSubmit}
      closable={false}
      okText="进入聊天室"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Input
          placeholder="输入用户名"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          onPressEnter={handleSubmit}
        />
        <Input
          placeholder="输入用户ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          onPressEnter={handleSubmit}
        />
      </div>
    </Modal>
  );
};

export default App;
