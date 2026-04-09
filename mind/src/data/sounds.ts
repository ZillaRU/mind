// Ambient sound definitions
export interface AmbientSound {
  id: string;
  name: string;
  icon: string;
  description: string;
  // We'll generate these procedurally with Web Audio API
  type: 'rain' | 'fire' | 'cafe' | 'wind' | 'ocean' | 'silence';
}

export const ambientSounds: AmbientSound[] = [
  { id: 'silence', name: '静默', icon: '🤫', description: '什么都没有，也什么都有', type: 'silence' },
  { id: 'rain', name: '雨声', icon: '🌧️', description: '窗外的雨，是最好的白噪音', type: 'rain' },
  { id: 'fire', name: '炉火', icon: '🔥', description: '噼啪作响的温暖', type: 'fire' },
  { id: 'cafe', name: '咖啡馆', icon: '☕', description: '远处的人声和杯碟', type: 'cafe' },
  { id: 'wind', name: '风声', icon: '🍃', description: '穿过树叶的低语', type: 'wind' },
  { id: 'ocean', name: '海浪', icon: '🌊', description: '潮起潮落，永不停歇', type: 'ocean' },
];
