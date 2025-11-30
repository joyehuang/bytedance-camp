import React from 'react';
import { Avatar } from 'antd';
import { UserOutlined, PlayCircleOutlined } from '@ant-design/icons';
import type { Message } from '../types';
import './MessageItem.css';

interface MessageItemProps {
  message: Message;
  currentUserId: string;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, currentUserId }) => {
  const isCurrentUser = message.userId === currentUserId;
  const isSystem = message.type === 'system';

  if (isSystem) {
    return (
      <div className="message-system">
        <span>{message.content}</span>
      </div>
    );
  }

  const renderContent = () => {
    switch (message.type) {
      case 'text':
        return <div className="message-text">{message.content}</div>;

      case 'audio':
        return (
          <div className="message-audio">
            <audio controls src={`http://localhost:3001${message.fileUrl}`}>
              Your browser does not support the audio element.
            </audio>
            <div className="file-info">
              <PlayCircleOutlined />
              <span>{message.fileName}</span>
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="message-video">
            <video
              controls
              src={`http://localhost:3001${message.fileUrl}`}
              style={{ maxWidth: '100%', maxHeight: '300px' }}
            >
              Your browser does not support the video element.
            </video>
            <div className="file-info">
              <span>{message.fileName}</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`message-item ${isCurrentUser ? 'message-current-user' : ''}`}>
      {!isCurrentUser && (
        <Avatar
          icon={<UserOutlined />}
          style={{ backgroundColor: '#1890ff' }}
          className="message-avatar"
        />
      )}
      <div className="message-content-wrapper">
        {!isCurrentUser && <div className="message-username">{message.userName}</div>}
        <div className="message-bubble">{renderContent()}</div>
        <div className="message-timestamp">
          {new Date(message.timestamp).toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
      {isCurrentUser && (
        <Avatar
          icon={<UserOutlined />}
          style={{ backgroundColor: '#52c41a' }}
          className="message-avatar"
        />
      )}
    </div>
  );
};

export default MessageItem;
