
export type ThemeType = 'minimal' | 'light' | 'dark' | 'glass' | 'oled';

export interface Character {
  id: string;
  name: string;
  avatar: string;
  description: string;
  systemPrompt: string;
  greeting: string;
}

export interface UserProfile {
  name: string;
  avatar: string;
  bio: string;
}

export interface WorldBookEntry {
  id: string;
  title: string;
  content: string;
  category: string;
}

export interface ChatMessage {
  id: string;
  charId: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface AppSettings {
  geminiUrl: string;
  geminiKey: string;
}
