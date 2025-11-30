export interface Message {
  id?: number;
  userId: string;
  userName: string;
  content?: string;
  type: 'text' | 'audio' | 'video' | 'system';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  timestamp: number;
}

export interface User {
  id: string;
  name: string;
}
