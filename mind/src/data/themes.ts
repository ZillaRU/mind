// Theme system for 慢 mind
// Each theme defines colors, particle hues, and copy variations

export interface Theme {
  id: string;
  name: string;
  icon: string;
  description: string;
  colors: {
    midnight: string;
    deep: string;
    surface: string;
    muted: string;
    soft: string;
    whisper: string;
    glow: string;
    warm: string;
    aurora: string;
    auroraDim: string;
    ember: string;
    moss: string;
    rain: string;
  };
  particleHueMin: number;
  particleHueMax: number;
  copy: {
    tagline: string;
    enterButton: string;
    bottomHint: string;
  };
  vibeLabel: string;
}

export const themes: Theme[] = [
  {
    id: 'aurora',
    name: '极光',
    icon: '🌌',
    description: '紫蓝色的深夜，代码在安静生长',
    colors: {
      midnight: '#0a0a0f',
      deep: '#12121a',
      surface: '#1a1a26',
      muted: '#2a2a3a',
      soft: '#6a6a7a',
      whisper: '#b0b0c0',
      glow: '#d8ccff',
      warm: '#ffe0b8',
      aurora: '#9080ff',
      auroraDim: '#5a4faa',
      ember: '#ff7b5a',
      moss: '#5aae7e',
      rain: '#7b9cde',
    },
    particleHueMin: 240,
    particleHueMax: 300,
    copy: {
      tagline: 'AI 在飞速流淌，你在慢慢生活',
      enterButton: '开始慢下来',
      bottomHint: '不需要登录 · 不收集数据 · 不会通知你',
    },
    vibeLabel: 'AI is flowing...',
  },
  {
    id: 'leaf',
    name: '绿叶',
    icon: '🍃',
    description: '淡绿与水绿，像清晨的窗台',
    colors: {
      midnight: '#060f0a',
      deep: '#0a1a10',
      surface: '#12261a',
      muted: '#1e3a28',
      soft: '#4a7a5a',
      whisper: '#90c0a0',
      glow: '#c8ffd8',
      warm: '#f8f0d0',
      aurora: '#5aba7a',
      auroraDim: '#3a7a4a',
      ember: '#f0b050',
      moss: '#7aca8a',
      rain: '#6aba9a',
    },
    particleHueMin: 100,
    particleHueMax: 160,
    copy: {
      tagline: '像一片叶子，不急不忙地生长',
      enterButton: '慢慢来',
      bottomHint: '不需要登录 · 不收集数据 · 不会通知你',
    },
    vibeLabel: 'growing...',
  },
  {
    id: 'water',
    name: '水波',
    icon: '💧',
    description: '蓝与白，像雨后的湖面',
    colors: {
      midnight: '#060a10',
      deep: '#0a1220',
      surface: '#101e30',
      muted: '#1a3048',
      soft: '#4a7090',
      whisper: '#90b8d8',
      glow: '#c0e0f8',
      warm: '#f8ecd0',
      aurora: '#5aa0d0',
      auroraDim: '#3a6a90',
      ember: '#f0b060',
      moss: '#6aba9a',
      rain: '#7ac0f0',
    },
    particleHueMin: 190,
    particleHueMax: 230,
    copy: {
      tagline: '水不争，善利万物',
      enterButton: '如水一般',
      bottomHint: '不需要登录 · 不收集数据 · 不会通知你',
    },
    vibeLabel: 'flowing...',
  },
  {
    id: 'twilight',
    name: '暮色',
    icon: '🌅',
    description: '暖橙与柔粉，像黄昏的最后一刻',
    colors: {
      midnight: '#100a08',
      deep: '#1a1210',
      surface: '#261c18',
      muted: '#3a2e28',
      soft: '#7a6a5a',
      whisper: '#c0a898',
      glow: '#f8e0c8',
      warm: '#ffeab0',
      aurora: '#e09060',
      auroraDim: '#aa6040',
      ember: '#f07050',
      moss: '#9aba7a',
      rain: '#ba9a7a',
    },
    particleHueMin: 15,
    particleHueMax: 45,
    copy: {
      tagline: '日落之后，世界才真正安静下来',
      enterButton: '等天黑',
      bottomHint: '不需要登录 · 不收集数据 · 不会通知你',
    },
    vibeLabel: 'fading...',
  },
  {
    id: 'ink',
    name: '墨',
    icon: '🪭',
    description: '黑白灰，像宣纸上晕开的墨',
    colors: {
      midnight: '#080808',
      deep: '#0e0e0e',
      surface: '#181818',
      muted: '#282828',
      soft: '#585858',
      whisper: '#a0a0a0',
      glow: '#d0d0d0',
      warm: '#b0a090',
      aurora: '#707070',
      auroraDim: '#484848',
      ember: '#b06050',
      moss: '#709070',
      rain: '#8090a0',
    },
    particleHueMin: 0,
    particleHueMax: 0,
    copy: {
      tagline: '大音希声，大象无形',
      enterButton: '留白',
      bottomHint: '不需要登录 · 不收集数据 · 不会通知你',
    },
    vibeLabel: '...',
  },
];

export function getTheme(id: string): Theme {
  return themes.find(t => t.id === id) || themes[0];
}
