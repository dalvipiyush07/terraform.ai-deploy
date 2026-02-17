
export interface Message {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
  suggestions?: string[];
}

export interface TerraformFiles {
  [filename: string]: string;
}

export interface ProjectSession {
  id: string;
  title: string;
  timestamp: number;
  messages: Message[];
  files: TerraformFiles;
  dbId?: number;
  isFavorite?: boolean;
  updatedAt?: string;
}

export interface Suggestion {
  title: string;
  prompt: string;
  icon: string;
}

export enum AppStatus {
  IDLE = 'idle',
  GENERATING = 'generating',
  ERROR = 'error'
}
