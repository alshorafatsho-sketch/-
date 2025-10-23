
export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export type TawjihiStream =
  | 'Scientific'
  | 'Literary'
  | 'IT'
  | 'Health'
  | 'Industrial'
  | 'Hospitality'
  | 'HomeEconomics';

export interface Subject {
  name: string;
  prompt: string;
}

export interface AttachedFile {
    name: string;
    content: string;
}
