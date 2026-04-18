// 心情标签定义
export interface MoodTag {
  id: string;
  emoji: string;
  label: string;
  color: string; // CSS color variable reference
}

export const moodTags: MoodTag[] = [
  { id: 'peaceful', emoji: '😌', label: '平静', color: 'aurora' },
  { id: 'happy', emoji: '😊', label: '愉悦', color: 'moss' },
  { id: 'tired', emoji: '😔', label: '疲惫', color: 'rain' },
  { id: 'anxious', emoji: '😰', label: '焦虑', color: 'ember' },
  { id: 'grateful', emoji: '🙏', label: '感恩', color: 'warm' },
  { id: 'thoughtful', emoji: '🤔', label: '若有所思', color: 'soft' },
  { id: 'refreshed', emoji: '✨', label: '焕然一新', color: 'glow' },
  { id: 'neutral', emoji: '😐', label: '一般', color: 'muted' },
];

export function getMoodTag(id: string): MoodTag | undefined {
  return moodTags.find(m => m.id === id);
}
