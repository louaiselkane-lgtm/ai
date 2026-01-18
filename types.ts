export enum ModuleId {
  SAVOIR = 'SAVOIR',
  REDACTION = 'REDACTION',
  TECH = 'TECH',
  STRATEGIE = 'STRATEGIE',
  VISION = 'VISION'
}

export interface Attachment {
  mimeType: string;
  data: string;
  previewUrl?: string;
  name?: string;
}

export interface ModuleDefinition {
  id: ModuleId;
  name: string;
  description: string;
  icon: string;
  color: string;
  themeColor: string; 
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  moduleId?: ModuleId;
  attachments?: Attachment[];
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}