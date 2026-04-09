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
      midnight: '#0e0e14',
      deep: '#16161f',
      surface: '#1e1e2a',
      muted: '#2e2e3e',
      soft: '#8888a0',
      whisper: '#d0d0e0',
      glow: '#e8e0ff',
      warm: '#ffe8c8',
      aurora: '#a090ff',
      auroraDim: '#6a5ac0',
      ember: '#ff8866',
      moss: '#6abe8e',
      rain: '#88a8e0',
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
      midnight: '#0a1410',
      deep: '#0e1e16',
      surface: '#162e20',
      muted: '#224232',
      soft: '#5a9a70',
      whisper: '#a8d8b8',
      glow: '#d0ffd8',
      warm: '#f8f4d8',
      aurora: '#68ca88',
      auroraDim: '#489a60',
      ember: '#f0c060',
      moss: '#88da98',
      rain: '#78caaa',
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
      midnight: '#0a1018',
      deep: '#0e1824',
      surface: '#162838',
      muted: '#1e3850',
      soft: '#5a88a8',
      whisper: '#a8c8e0',
      glow: '#d0e8ff',
      warm: '#f8f0d8',
      aurora: '#68b0e0',
      auroraDim: '#4880a8',
      ember: '#f0c068',
      moss: '#78c8a8',
      rain: '#88d0f8',
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
      midnight: '#140e0c',
      deep: '#1e1614',
      surface: '#2a201c',
      muted: '#3e322c',
      soft: '#9a8a78',
      whisper: '#d8c8b8',
      glow: '#ffe8d0',
      warm: '#fff0c0',
      aurora: '#e8a878',
      auroraDim: '#b88058',
      ember: '#f08868',
      moss: '#a8c888',
      rain: '#c8a890',
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
      midnight: '#0c0c0c',
      deep: '#141414',
      surface: '#1c1c1c',
      muted: '#2c2c2c',
      soft: '#686868',
      whisper: '#b8b8b8',
      glow: '#e0e0e0',
      warm: '#c8b8a0',
      aurora: '#888888',
      auroraDim: '#585858',
      ember: '#c07060',
      moss: '#789878',
      rain: '#8898a8',
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
