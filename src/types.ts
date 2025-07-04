export interface Location {
  id: number;
  name: string;
  position: [number, number];
  description: string;
}

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  date: string;
}

export interface Message {
  text: string;
  isUser: boolean;
}