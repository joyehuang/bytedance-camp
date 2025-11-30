import React, { useState, useRef } from 'react';
import { Input, Button, Upload, message as antdMessage, Progress } from 'antd';
import {
  SendOutlined,
  AudioOutlined,
  PaperClipOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { uploadFile } from '../services/api';
import './MessageInput.css';

interface MessageInputProps {
  onSendText: (text: string) => void;
  onSendAudio: (fileUrl: string, fileName: string, fileSize: number) => void;
  onSendVideo: (fileUrl: string, fileName: string, fileSize: number) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendText,
  onSendAudio,
  onSendVideo,
}) => {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleSendText = () => {
    if (text.trim()) {
      onSendText(text.trim());
      setText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], `audio_${Date.now()}.webm`, {
          type: 'audio/webm',
        });

        // 上传录音文件
        setIsUploading(true);
        try {
          const result = await uploadFile(audioFile, setUploadProgress);
          onSendAudio(result.fileUrl, result.fileName, result.fileSize);
          antdMessage.success('录音发送成功');
        } catch (error) {
          antdMessage.error('录音上传失败');
          console.error(error);
        } finally {
          setIsUploading(false);
          setUploadProgress(0);
        }

        // 停止所有音轨
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      antdMessage.info('开始录音...');
    } catch (error) {
      antdMessage.error('无法访问麦克风');
      console.error(error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      antdMessage.info('录音结束');
    }
  };

  const handleFileUpload = async (file: File, type: 'audio' | 'video') => {
    setIsUploading(true);
    try {
      const result = await uploadFile(file, setUploadProgress);

      if (type === 'audio') {
        onSendAudio(result.fileUrl, result.fileName, result.fileSize);
      } else {
        onSendVideo(result.fileUrl, result.fileName, result.fileSize);
      }

      antdMessage.success('文件上传成功');
    } catch (error) {
      antdMessage.error('文件上传失败');
      console.error(error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="message-input-container">
      {isUploading && (
        <div className="upload-progress">
          <Progress percent={uploadProgress} size="small" />
        </div>
      )}

      <div className="message-input-actions">
        <Button
          type={isRecording ? 'primary' : 'default'}
          danger={isRecording}
          icon={<AudioOutlined />}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isUploading}
        >
          {isRecording ? '停止录音' : '录音'}
        </Button>

        <Upload
          accept="audio/*"
          showUploadList={false}
          beforeUpload={(file) => {
            handleFileUpload(file, 'audio');
            return false;
          }}
          disabled={isUploading}
        >
          <Button icon={<PaperClipOutlined />} disabled={isUploading}>
            音频文件
          </Button>
        </Upload>

        <Upload
          accept="video/*"
          showUploadList={false}
          beforeUpload={(file) => {
            handleFileUpload(file, 'video');
            return false;
          }}
          disabled={isUploading}
        >
          <Button icon={<VideoCameraOutlined />} disabled={isUploading}>
            视频文件
          </Button>
        </Upload>
      </div>

      <div className="message-input-text">
        <Input.TextArea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="输入消息..."
          autoSize={{ minRows: 1, maxRows: 4 }}
          disabled={isUploading}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSendText}
          disabled={!text.trim() || isUploading}
        >
          发送
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
