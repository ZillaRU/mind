export interface Activity {
  id: string;
  name: string;
  icon: string;
  description: string;
  guide: string;
  duration: string; // suggested duration like "15-30 分钟"
  category: 'hands' | 'body' | 'senses' | 'creative';
}

export const activities: Activity[] = [
  {
    id: 'piano',
    name: '练琴',
    icon: '🎹',
    description: '让手指找到记忆',
    guide: '不需要完美，只需要重复。让肌肉自己记住每一个音符。',
    duration: '15-30 分钟',
    category: 'hands',
  },
  {
    id: 'cooking',
    name: '做饭',
    icon: '🍳',
    description: '用双手创造温度',
    guide: '感受食材的纹理，闻一闻香料的味道。刀工不需要快，稳就好。',
    duration: '30-60 分钟',
    category: 'hands',
  },
  {
    id: 'stretch',
    name: '拉伸',
    icon: '🧘',
    description: '听听身体在说什么',
    guide: '不要追求柔韧度，只追求感受。哪里紧，就在那里多停留一会儿。',
    duration: '10-20 分钟',
    category: 'body',
  },
  {
    id: 'walk',
    name: '散步',
    icon: '🚶',
    description: '让脚决定方向',
    guide: '不带目的地走。看看路边的树，听听风声。手机留在桌上。',
    duration: '20-40 分钟',
    category: 'body',
  },
  {
    id: 'coffee',
    name: '手冲咖啡',
    icon: '☕',
    description: '等待也是一种仪式',
    guide: '听水流的声音，看咖啡粉膨胀。每一秒都是味道的一部分。',
    duration: '10-15 分钟',
    category: 'senses',
  },
  {
    id: 'sketch',
    name: '随手画',
    icon: '✏️',
    description: '不需要画得好看',
    guide: '画你看到的任何东西。线条不需要直，颜色不需要对。只是画。',
    duration: '15-30 分钟',
    category: 'creative',
  },
  {
    id: 'read',
    name: '读纸质书',
    icon: '📖',
    description: '纸张的温度',
    guide: '不是学习，不是获取信息。只是让文字带着你走。',
    duration: '20-40 分钟',
    category: 'senses',
  },
  {
    id: 'journal',
    name: '写手账',
    icon: '📝',
    description: '把脑子里的东西倒出来',
    guide: '不需要文笔，不需要逻辑。写你想写的任何东西。',
    duration: '10-20 分钟',
    category: 'creative',
  },
  {
    id: 'garden',
    name: '照顾植物',
    icon: '🌱',
    description: '和安静的生命相处',
    guide: '摸摸叶子，看看有没有新芽。浇水的时候感受水的温度。',
    duration: '10-20 分钟',
    category: 'hands',
  },
  {
    id: 'breathe',
    name: '只是呼吸',
    icon: '🌬️',
    description: '什么都不做也可以',
    guide: '闭上眼睛。吸气 4 秒，屏住 4 秒，呼气 6 秒。重复。',
    duration: '5-15 分钟',
    category: 'body',
  },
];

export const categoryLabels: Record<Activity['category'], string> = {
  hands: '动手',
  body: '身体',
  senses: '感官',
  creative: '创造',
};
