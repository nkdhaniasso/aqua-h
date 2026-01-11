
export type WaterQuality = 'fresh' | 'normal' | 'hazardous';

export interface Lake {
  id: string;
  name: string;
  location: string;
  lat: number;
  lon: number;
  type: WaterQuality;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface LocationState {
  lat: number;
  lng: number;
}
