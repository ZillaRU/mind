// 慢 mind · 体验内容
// 允许所有情绪，只要是真的在体内流淌着的
// 萌一点，朦胧一点，像半梦半醒时听到的声音

export type ExperienceType =
  | 'pose-cycle'
  | 'breathe-guide'
  | 'step-guide'
  | 'prompt-cycle'
  | 'metronome'
  | 'default';

export interface PoseStep {
  emoji: string;
  name: string;
  lines: string[];
  art?: string;
}

export interface GuideStep {
  title: string;
  lines: string[];
  emoji: string;
}

export interface Prompt {
  lines: string[];
  emoji?: string;
}

export interface ActivityExperience {
  type: ExperienceType;
  poses?: PoseStep[];
  inhaleSeconds?: number;
  holdSeconds?: number;
  exhaleSeconds?: number;
  steps?: GuideStep[];
  prompts?: Prompt[];
  bpm?: number;
}

// ===== 拉伸 =====
const stretchPoses: PoseStep[] = [
  {
    emoji: '🦒',
    name: '脖子',
    lines: [
      '你的脖子……低了一整天了吧',
      '它大概在偷偷叹气',
      '慢慢、慢慢往一边倒～',
      '不用倒到标准角度啦',
      '倒到它觉得"嗯～舒服"的地方就好',
    ],
    art: `
      ╭───╮
      │   │
     ╱    │
    ╱     │
          │
          │
      ╰───╯`,
  },
  {
    emoji: '🦅',
    name: '肩膀',
    lines: [
      '肩膀提起来～',
      '……再放下去',
      '啊，你刚才是不是才发现',
      '它们一直、一直紧绷着呀',
      '辛苦了哦',
    ],
    art: `
     ╭──╮   ╭──╮
     │  │   │  │
     ╰┬─╯   ╰─┬╯
      │  ↑↓  │
      ╰──────╯`,
  },
  {
    emoji: '🤲',
    name: '手腕',
    lines: [
      '双手交叉，转一转～',
      '你今天打了好多好多字吧',
      '手腕知道的',
      '只是你忘了问它',
      '"嘿，你还好吗？"',
    ],
    art: `
      ╭─╮  ╭─╮
      │ ╰──╯ │
      ╰──────╯
        ↻`,
  },
  {
    emoji: '🐱',
    name: '猫式伸展',
    lines: [
      '像猫一样弓起背～',
      '猫从来不赶时间的',
      '猫觉得伸懒腰是正经事',
      '……其实猫觉得什么都是正经事',
      '你也可以的',
    ],
    art: `
          ∧_∧
         ( •_•)
         / >🧶
        ～～～`,
  },
  {
    emoji: '🌳',
    name: '侧弯',
    lines: [
      '手臂往上伸～',
      '身体往一边倒',
      '像被风吹的树',
      '树不会觉得自己歪',
      '它只是在很认真地、歪着',
    ],
    art: `
          │
         ╱│╲
        ╱ │ ╲
       ╱  │  ╲
          │`,
  },
  {
    emoji: '🦋',
    name: '蝴蝶式',
    lines: [
      '脚底并拢，膝盖像翅膀～',
      '小时候你也这样坐过吧',
      '那时候没有 KPI 呢',
      '也没有"我应该"',
      '只有"我想"',
    ],
    art: `
      ╭──╮   ╭──╮
      │  ╰───╯  │
      ╰─╮   ╭─╯
        │   │
       ╱     ╲`,
  },
  {
    emoji: '🌀',
    name: '转腰',
    lines: [
      '双手叉腰，慢慢转圈～',
      '你的腰撑了你一整天',
      '它值得被温柔地转一转',
      '就像你值得被温柔地对待',
      '嗯，你值得的',
    ],
    art: `
        ╭─╮
      ╭─╯ ╰─╮
      │  ●  │
      ╰─╮ ╭─╯
        ╰─╯
         ↻`,
  },
  {
    emoji: '🌙',
    name: '前屈',
    lines: [
      '弯腰～',
      '够不到脚也没关系的',
      '够不到的事情……多了去了',
      '但弯下去本身',
      '就已经是一种到达了呀',
    ],
    art: `
      ╭───╮
      │   │
      ╰┬──┬╯
       │  │
      ╱    ╲
     ╱      ╲`,
  },
  {
    emoji: '🦩',
    name: '单腿站立',
    lines: [
      '抬起一只脚～',
      '晃也没关系的',
      '站稳这件事',
      '本来就不容易呀',
      '晃着晃着，反而站住了',
    ],
    art: `
         O
        /|\\
         |
        ╱ ╲
        ╱  ╲
         ╱
        ╱`,
  },
  {
    emoji: '🐙',
    name: '全身抖一抖',
    lines: [
      '对，就是抖',
      '像小狗甩水那样',
      '把今天所有的……',
      '都抖掉',
      '不用优雅',
      '没人看你的',
    ],
    art: `
      ~  O  ~
     ~ /|\\ ~
    ~  /|\\  ~
       / \\
      /   \\
     ～～～～`,
  },
];

// ===== 呼吸 =====
const breatheExperience: ActivityExperience = {
  type: 'breathe-guide',
  inhaleSeconds: 4,
  holdSeconds: 4,
  exhaleSeconds: 6,
};

// ===== 手冲咖啡 =====
const coffeeSteps: GuideStep[] = [
  {
    emoji: '🫘',
    title: '磨豆',
    lines: [
      '听豆子碎掉的声音～',
      '每一颗去过不一样的地方呢',
      '现在它们要变成同一种味道了',
      '……有点像人呀',
    ],
  },
  {
    emoji: '💧',
    title: '烧水',
    lines: [
      '水在慢慢变热',
      '你不用一直盯着它',
      '但盯着也挺好的',
      '有些等待，本身就是意义呀',
    ],
  },
  {
    emoji: '🌸',
    title: '闷蒸',
    lines: [
      '倒一点点热水',
      '看咖啡粉慢慢鼓起来～',
      '它在呼吸呢',
      '比你刚才……认真一点点',
    ],
  },
  {
    emoji: '⏳',
    title: '注水',
    lines: [
      '画圈圈～慢慢地～',
      '急不出好咖啡的',
      '急不出好任何东西的',
      '但有时候急了也就急了',
      '那也没关系啦',
    ],
  },
  {
    emoji: '☕',
    title: '等',
    lines: [
      '现在什么都不用做',
      '就坐着',
      '闻一闻',
      '今天的水温刚好',
      '或者不刚好',
      '都可以的',
    ],
  },
  {
    emoji: '✨',
    title: '喝',
    lines: [
      '第一口总是烫烫的',
      '第二口开始能尝到味道了',
      '第三口你会忘了自己在喝咖啡',
      '那就是对了～',
    ],
  },
  {
    emoji: '🫧',
    title: '洗杯子',
    lines: [
      '杯子要洗的',
      '就像有些事情要翻篇的',
      '不洗的话，下一杯会串味',
      '……人也一样呢',
    ],
  },
  {
    emoji: '🪟',
    title: '发呆',
    lines: [
      '喝完了？',
      '别急着走',
      '杯子里还有咖啡的香气',
      '窗户外面有什么',
      '你有多久没看过窗外了',
    ],
  },
];

// ===== 做饭 =====
const cookingSteps: GuideStep[] = [
  {
    emoji: '🔪',
    title: '备料',
    lines: [
      '切菜的时候可以什么都不想哦',
      '刀和砧板的声音很治愈的',
      '如果你今天很烦',
      '切得碎碎的也没关系',
      '菜不会介意的',
    ],
  },
  {
    emoji: '🔥',
    title: '热锅',
    lines: [
      '等锅热～',
      '不要急',
      '锅会告诉你的',
      '水珠跳起来的时候',
      '它准备好了',
      '你也是',
    ],
  },
  {
    emoji: '🫕',
    title: '烹饪',
    lines: [
      '翻炒翻炒～',
      '或者不翻炒',
      '有些菜需要耐心',
      '有些菜需要勇气',
      '有些菜需要承认——',
      '今天就是不想做饭呀',
    ],
  },
  {
    emoji: '🧂',
    title: '调味',
    lines: [
      '少一点点～',
      '再少一点点',
      '之后可以再加的',
      '但加多了就拿不回来了',
      '说话也是这样呢',
    ],
  },
  {
    emoji: '🍽️',
    title: '摆盘',
    lines: [
      '随便摆也行',
      '认真摆也行',
      '反正最后都要吃掉的',
      '好看的东西不一定要长久',
      '存在过，就够了呀',
    ],
  },
  {
    emoji: '🧽',
    title: '洗碗',
    lines: [
      '洗碗的时候',
      '手是热的，水是热的',
      '这个世界上',
      '有些温暖是免费的',
      '比如热水',
      '比如你还在',
    ],
  },
];

// ===== 随手画 =====
const sketchPrompts: Prompt[] = [
  { lines: ['画你的左手', '不用像', '你又不是照相机', '你是你呀'], emoji: '✋' },
  { lines: ['闭上眼睛，画一条线', '睁开眼看看它去了哪里', '有时候不知道要去哪', '反而去了有意思的地方呢'], emoji: '〰️' },
  { lines: ['画一个圆', '然后把它弄乱', '完美很无聊的', '乱一点才像活着'], emoji: '⭕' },
  { lines: ['你今天看到了什么颜色', '不一定是彩虹哦', '灰色也算', '灰色很诚实的'], emoji: '🎨' },
  { lines: ['画一个你讨厌的东西', '画着画着', '可能就没那么讨厌了', '也可能还是讨厌', '都行啦'], emoji: '😤' },
  { lines: ['用一只手画', '另一只手放在心上', '感受它跳', '它一直在跳哦', '你只是忘了听'], emoji: '💓' },
  { lines: ['画今天的天气', '不是天气预报那种', '是你心里的那种', '可能外面晴天', '但你心里在下雨', '那就画雨吧'], emoji: '🌧️' },
  { lines: ['画一个字', '你今天最想说的一个字', '不用告诉任何人', '纸知道就好了'], emoji: '📝' },
  { lines: ['把笔放下', '用手指画', '感受纸的纹理', '有些东西呀', '工具反而挡住了'], emoji: '👆' },
  { lines: ['画一个门', '不用画门后面有什么', '门本身就是答案', '打开或不开', '都是你的选择'], emoji: '🚪' },
  { lines: ['画一个你记得的梦', '不用完整', '梦本来就不完整的', '画那个最模糊的部分', '模糊才是真的'], emoji: '💭' },
  { lines: ['画一个你喜欢的人', '不用画脸', '画你想到ta时的感觉', '是什么颜色的', '什么形状的'], emoji: '💗' },
  { lines: ['画一条路', '不用画终点', '路的意义不在终点', '在于你走在上面', '脚底踩到的每一寸'], emoji: '🛤️' },
  { lines: ['涂满一整页', '什么颜色都行', '黑色也行', '有时候就是想涂黑', '涂黑也是一种表达呀'], emoji: '⬛' },
  { lines: ['画水', '水没有形状', '你画不出来', '但试试看', '画不出来的东西', '往往最值得画'], emoji: '💧' },
];

// ===== 散步 =====
const walkPrompts: Prompt[] = [
  { lines: ['感受脚底～', '每一步', '大地都接住了你', '它从来没有拒绝过你哦'], emoji: '👣' },
  { lines: ['抬头看看', '你有多久没看过天空了', '它一直在那里的', '一直在等你抬头'], emoji: '☁️' },
  { lines: ['停下来', '就站一会儿', '不用去任何地方', '你已经到了呀'], emoji: '🛑' },
  { lines: ['听～', '三种声音', '不用找它们', '它们会来找你的', '世界一直在说话呢'], emoji: '👂' },
  { lines: ['找一个你从没注意过的东西', '它可能一直都在', '就像有些人', '一直在你身边', '你只是……没看见'], emoji: '🔍' },
  { lines: ['走慢一点', '再慢一点', '你在赶什么呀', '终点又不会跑掉'], emoji: '🐌' },
  { lines: ['如果这条路有记忆', '它会记住什么呢', '你在这里笑过吗', '哭过吗', '还是只是经过'], emoji: '🛤️' },
  { lines: ['风吹过来的时候', '不要躲', '让它穿过你', '你又不是纸', '不会散的'], emoji: '🌬️' },
  { lines: ['看看你的影子', '它比你安静', '它不焦虑', '它只是跟着你', '什么都不说'], emoji: '👤' },
  { lines: ['走回去吧', '或者继续走', '或者找个地方坐着', '没有正确的选择', '只有你正在做的那个'], emoji: '🏠' },
  { lines: ['踩影子', '小时候踩过吧', '现在也可以', '谁说大人不能踩影子', '大人也是从小孩长大的呀'], emoji: '🧸' },
  { lines: ['今天月亮出来了吗', '没有也没关系', '月亮也有不想上班的时候', '……你懂的'], emoji: '🌙' },
  { lines: ['路过一棵树', '摸一下它的树皮', '粗糙的', '但它站了很多很多年', '比你的烦恼久多了'], emoji: '🌲' },
  { lines: ['如果可以变成一只动物', '你想变成什么', '不用回答', '想想就好', '想想也是一种自由'], emoji: '🦊' },
];

// ===== 读纸质书 =====
const readPrompts: Prompt[] = [
  { lines: ['不要赶～', '这本书不会跑的', '它等了你这么久', '不差这一页啦'], emoji: '📖' },
  { lines: ['翻页的声音', '是世界上最安静的声音之一', '比沉默多一点', '比噪音少很多', '刚刚好'], emoji: '📄' },
  { lines: ['有没有哪句话', '让你停下来了', '不用急着继续', '停在那里', '让那句话住一会儿'], emoji: '📌' },
  { lines: ['你为什么选了这本书', '是因为封面好看', '还是别人推荐', '还是因为……', '你当时刚好需要'], emoji: '📚' },
  { lines: ['如果作者知道你在读', '他会高兴的吧', '他写的时候', '大概也一个人', '在某个夜晚', '和你现在一样'], emoji: '✍️' },
  { lines: ['跳过也行', '看不懂也行', '不好看也行', '不是每本书都要读完', '不是每件事都要有结果呀'], emoji: '⏭️' },
  { lines: ['折一个角吧', '或者不折', '折了说明你来过', '不折说明你记得', '都行'], emoji: '📖' },
  { lines: ['合上书', '闭上眼', '想想刚才读了什么', '能想起来的', '就是属于你的了'], emoji: '🙈' },
  { lines: ['读到一半', '突然不想读了', '那就放下', '书不会生气的', '它最怕的是你', '假装在读'], emoji: '🫣' },
  { lines: ['有没有一个字', '你看了好几遍', '不是因为不懂', '是因为它好看', '一个字也可以好看的'], emoji: '🔤' },
  { lines: ['这本书的味道', '你闻到了吗', '纸和墨的味道', '是时间在发酵', '越老越香', '人也一样呢'], emoji: '👃' },
  { lines: ['如果这本书有脾气', '它大概是个慢性子', '不急不躁', '一章一章地', '慢慢说', '像你现在的样子'], emoji: '🐢' },
];

// ===== 练琴 =====
const pianoExperience: ActivityExperience = {
  type: 'metronome',
  bpm: 60,
};

// ===== 照顾植物 =====
const gardenPrompts: Prompt[] = [
  { lines: ['摸摸叶子～', '它的纹理', '是独一无二的', '就像你的指纹', '但没人会给叶子做身份证明呢'], emoji: '🍃' },
  { lines: ['看看土', '是湿的还是干的', '植物不会说话', '但它会变黄', '变黄就是它在说——', '"我渴了"'], emoji: '🪴' },
  { lines: ['有没有新芽呀', '可能昨天还没有', '今天就有了', '有些事情', '就是会在你不知道的时候发生'], emoji: '🌱' },
  { lines: ['转一下花盆', '让另一面也晒到太阳', '人也一样', '不能一直只朝一个方向的'], emoji: '☀️' },
  { lines: ['摘掉枯叶吧', '它已经黄了', '放手', '新的会长出来的', '……或者不会', '但留着黄的', '新的也没有空间呀'], emoji: '🍂' },
  { lines: ['浇水～', '不要浇太多', '爱也是', '太多会溺死的', '刚刚好很难', '但值得试试'], emoji: '💧' },
  { lines: ['和它说说话吧', '认真的', '植物听不懂的', '但你说了之后', '自己会好一点', '不信你试试'], emoji: '🗣️' },
  { lines: ['就坐在旁边', '什么都不做', '植物最好的陪伴', '就是有人在旁边', '什么都不做'], emoji: '🪑' },
  { lines: ['你的植物今天长大了吗', '可能看不出来', '但它在长', '有些成长呀', '就是肉眼看不见的', '就像你'], emoji: '📏' },
  { lines: ['如果植物会发消息', '它大概只会发', '"."', '一个句号', '但那个句号的意思是', '"我在呢"'], emoji: '📱' },
  { lines: ['给它起个名字吧', '如果还没有的话', '有了名字', '就是家人了', '虽然它不会叫你', '但你知道的'], emoji: '🏷️' },
  { lines: ['植物不刷手机', '不看消息', '不焦虑明天', '它只是', '站在那里', '晒太阳', '喝水', '活着', '……好羡慕'], emoji: '🪷' },
];

// ===== 写手账 =====
const journalPrompts: Prompt[] = [
  { lines: ['今天最诚实的一句话是什么', '不是最正确的', '是最诚实的', '这两件事呀', '经常不一样'], emoji: '💭' },
  { lines: ['你现在是什么感觉', '如果不知道', '就写"不知道"', '不知道也是一种知道呢'], emoji: '❓' },
  { lines: ['今天有没有一瞬间', '你觉得', '活着……还行', '记下来吧', '以后难的时候翻翻看'], emoji: '🌟' },
  { lines: ['写一个你不想原谅的人', '不用原谅', '写下来就好', '纸不会评判你的'], emoji: '😤' },
  { lines: ['如果今天是一首歌', '什么歌', '不用是好听的', '难听的也算', '有些日子就是难听的呀'], emoji: '🎵' },
  { lines: ['你最近在逃避什么', '写下来', '看看它', '它可能没有你以为的那么大', '也可能更大', '但看着它', '就是开始了'], emoji: '👁️' },
  { lines: ['三件好事', '如果想不到三件', '一件也行', '如果一件也想不出', '那就写——', '"今天我还在写"'], emoji: '📝' },
  { lines: ['给明天的自己写一句话', '不用是鼓励的话', '可以是"明天再说"', '也可以是"明天不想起床"', '都行的', '明天的自己会看到的'], emoji: '💌' },
  { lines: ['你上一次哭是什么时候', '不用分析原因', '有时候就是想哭', '想哭就哭', '这是权利，不是弱点'], emoji: '💧' },
  { lines: ['写到这里就够了', '不用写满', '不用写得好看', '你来了', '你写了', '够了呀'], emoji: '✨' },
  { lines: ['写一个你撒过的谎', '不用是大谎', '小谎也算', '"我没事"', '这个算吗', '……算了，写了也没人看'], emoji: '🤫' },
  { lines: ['你今天笑了几次', '真笑', '不是那种礼貌的', '是那种', '忍不住的', '如果有，真好呀'], emoji: '😊' },
  { lines: ['写一个你想去但没去的地方', '为什么没去', '写下来', '也许有一天', '你会去的', '也许不会', '但写下来', '它就存在了'], emoji: '🗺️' },
  { lines: ['今天有没有什么', '让你突然安静了一下', '不用解释', '安静就是安静', '不需要理由的'], emoji: '🤫' },
  { lines: ['最后写一句', '写给谁都可以', '写给自己也行', '写给今天的自己——', '"辛苦了"'], emoji: '🫂' },
];

// ===== Experience Map =====
export const activityExperiences: Record<string, ActivityExperience> = {
  stretch: { type: 'pose-cycle', poses: stretchPoses },
  breathe: breatheExperience,
  coffee: { type: 'step-guide', steps: coffeeSteps },
  sketch: { type: 'prompt-cycle', prompts: sketchPrompts },
  walk: { type: 'prompt-cycle', prompts: walkPrompts },
  read: { type: 'prompt-cycle', prompts: readPrompts },
  piano: pianoExperience,
  cooking: { type: 'step-guide', steps: cookingSteps },
  garden: { type: 'prompt-cycle', prompts: gardenPrompts },
  journal: { type: 'prompt-cycle', prompts: journalPrompts },
};

export function getExperience(activityId: string): ActivityExperience | null {
  return activityExperiences[activityId] || null;
}

// ===== 新活动的 prompts =====

// ===== 看星星 =====
const stargazingPrompts: Prompt[] = [
  { lines: ['找到最亮的那颗星～', '它可能是一颗行星', '也可能是一颗卫星', '或者只是飞机'], emoji: '⭐' },
  { lines: ['闭上眼睛，数三秒', '睁开，找一个新的点', '每一颗星星都在那里', '等了你很久'], emoji: '🌟' },
  { lines: ['有没有看到会动的？', '那是卫星', '或者国际空间站', '上面有人正在看你'], emoji: '🛰️' },
  { lines: ['如果云来了', '就等一下', '云会走的', '星星还在那里'], emoji: '☁️' },
  { lines: ['你现在看到的星光', '是很多年前发出的', '那颗星可能已经不在了', '但它的光还在'], emoji: '✨' },
  { lines: ['宇宙在膨胀', '但你感觉不到', '你只是站在这里', '看星星'], emoji: '🌌' },
  { lines: ['不需要认识每一颗星', '知道它们在那里就够了', '就像有些人', '不需要常见面'], emoji: '👁️' },
];

// ===== 听音乐 =====
const musicPrompts: Prompt[] = [
  { lines: ['选一首歌', '不要看歌词', '只是听'], emoji: '🎧' },
  { lines: ['注意鼓点', '它像心跳', '你跟上它', '或者它跟上你'], emoji: '🥁' },
  { lines: ['有没有哪个音符', '让你停了一下', '就停在那里', '让它住一会儿'], emoji: '🎵' },
  { lines: ['如果音乐有颜色', '这首是什么颜色', '不是红橙黄绿那种', '是心里的那种'], emoji: '🎨' },
  { lines: ['音乐停了', '不要急着切', '让余音还在房间里', '再待一会儿'], emoji: '🔇' },
];

// ===== 泡澡 =====
const bathPrompts: Prompt[] = [
  { lines: ['慢慢坐进去', '让热水包住你', '从脚开始', '一点一点'], emoji: '🛁' },
  { lines: ['什么都不想', '或者想什么都行', '热水会帮你', '把思绪泡软'], emoji: '💭' },
  { lines: ['听水的声音', '动一动的时候', '哗啦哗啦的', '很安静'], emoji: '🌊' },
  { lines: ['如果累了', '就把头也靠进去', '听不到外面的声音', '只有水和你'], emoji: '🫧' },
  { lines: ['泡完了不要急', '让身体慢慢适应', '冷空气进来的时候', '会有一点点清醒'], emoji: '❄️' },
];

// ===== 看日出 =====
const sunrisePrompts: Prompt[] = [
  { lines: ['天在亮了', '你看到了吗', '不是太阳', '是天空在变'], emoji: '🌅' },
  { lines: ['它很慢', '但一直在', '不会停的', '总会到达'], emoji: '⏰' },
  { lines: ['云会被染成橙色', '然后粉色', '然后金色', '每一天都不一样'], emoji: '🌈' },
  { lines: ['你是第几个看日出的人', '从古到今', '有多少人', '站在这里'], emoji: '👥' },
  { lines: ['太阳升起来了', '新的一天', '从这一刻开始'], emoji: '☀️' },
];

// ===== 听雨 =====
const rainPrompts: Prompt[] = [
  { lines: ['听～', '雨打在什么地方', '窗户？屋顶？树叶？', '每个地方声音不一样'], emoji: '👂' },
  { lines: ['有没有规律', '其实没有', '雨声就是', '没有规律才安静'], emoji: '🌧️' },
  { lines: ['如果雨变大了', '就离窗户近一点', '看雨滴滑下去', '每一滴路径都不一样'], emoji: '💧' },
  { lines: ['你上次听雨是什么时候', '有没有很久了', '雨一直在下', '只是我们太忙'], emoji: '⏳' },
];

// ===== 看火 =====
const firePrompts: Prompt[] = [
  { lines: ['看火焰的顶端', '蓝色的那里', '那是火最热的地方', '但看起来最冷静'], emoji: '🔥' },
  { lines: ['火焰会跳', '不是随机的', '是风在说话', '很小很小的风'], emoji: '🍃' },
  { lines: ['有没有听到', '噼啪声', '那是木头的记忆', '在燃烧之前的样子'], emoji: '🌲' },
  { lines: ['火会变小', '变弱', '但不会突然消失', '慢慢来'], emoji: '⏳' },
  { lines: ['如果火灭了', '不要急着点火', '让黑暗待一会儿', '也是一种完整'], emoji: '🌑' },
];

// ===== 摄影 =====
const photoPrompts: Prompt[] = [
  { lines: ['找光线', '光在哪里', '让它照在你觉得美的地方', '按下快门'], emoji: '📷' },
  { lines: ['不要想太多', '看到什么拍什么', '回来再看', '也许会有惊喜'], emoji: '✨' },
  { lines: ['低头看看', '地上有没有影子', '影子也可以拍'], emoji: '👣' },
  { lines: ['你今天穿什么颜色', '和环境搭吗', '试试看'], emoji: '🎨' },
  { lines: ['把镜头对着一朵花', '靠近一点', '再近一点', '直到你看不到它是什么花'], emoji: '🌸' },
];

// ===== 写作 =====
const writePrompts: Prompt[] = [
  { lines: ['写一个句子', '不需要是完整的', '不一定要有意义', '只是写'], emoji: '✍️' },
  { lines: ['如果不知道写什么', '就写"我不知道写什么"', '这也是写作'], emoji: '🤷' },
  { lines: ['写今天', '不是日记那种', '就是今天', '此时此刻'], emoji: '📅' },
  { lines: ['写一个人', '不需要写真名', '用代号', '或者只是一个"他"'], emoji: '👤' },
  { lines: ['写完了？', '读一遍', '改一个字', '或者不改'], emoji: '📖' },
];

// ===== 做手工 =====
const diyPrompts: Prompt[] = [
  { lines: ['先看看你的材料', '摸一摸', '感受它们的重量', '然后再开始'], emoji: '🔧' },
  { lines: ['做坏了也没关系', '手工的意义', '不在于完美', '在于亲手'], emoji: '💪' },
  { lines: ['慢一点', '不是比赛', '没有时间限制', '慢慢来'], emoji: '🐢' },
  { lines: ['你做的东西', '全世界只有这一件', '因为是你做的', '不管什么样'], emoji: '🌟' },
];

// ===== 整理收藏 =====
const collectionPrompts: Prompt[] = [
  { lines: ['慢慢翻', '不要急', '每一件东西都有故事', '等你想起来'], emoji: '📦' },
  { lines: ['这张照片是什么时候', '你还记得吗', '那天你在想什么'], emoji: '📷' },
  { lines: ['这张票根', '你去了吗', '去了的话', '玩得开心吗'], emoji: '🎫' },
  { lines: ['有些东西可以扔了', '有些不可以', '你知道的', '相信你的感觉'], emoji: '🗑️' },
  { lines: ['整理完了', '把它们放好', '不是收起来', '是给它们一个家'], emoji: '🏠' },
];

// ===== 尝试新菜 =====
const cookingNewPrompts: Prompt[] = [
  { lines: ['先读一遍菜谱', '不是要记住', '是知道要做什么'], emoji: '📖' },
  { lines: ['材料准备好了吗', '切好了吗', '等一下再开始', '准备好了再开始'], emoji: '🥗' },
  { lines: ['不好吃也没关系', '下次改进', '好不好的', '反正没人知道'], emoji: '😄' },
  { lines: ['摆盘的时候', '摆好看一点', '虽然要吃掉', '但好看会让它更好吃'], emoji: '🍽️' },
];

// ===== 发呆 =====
const daydreamPrompts: Prompt[] = [
  { lines: ['看窗外', '随便哪里', '不要想', '只是看'], emoji: '🪟' },
  { lines: ['你的脑子', '有没有停下来', '没有也没关系', '发呆不需要脑子安静'], emoji: '💭' },
  { lines: ['时间在走', '但你', '就坐在这里', '什么都不做'], emoji: '⏰' },
  { lines: ['发呆也是', '一种活着', '不是浪费', '是休息'], emoji: '🌸' },
  { lines: ['差不多了？', '还是继续？', '都可以', '你决定'], emoji: '✨' },
];

// ===== 骑行 =====
const cyclingPrompts: Prompt[] = [
  { lines: ['踩下去', '感受踏板', '一圈又一圈', '世界在后退'], emoji: '🚴' },
  { lines: ['风迎面吹来', '不要躲', '让它吹过你的脸', '这就是自由'], emoji: '🍃' },
  { lines: ['不用快', '快不是目的', '只是路过', '让风景流过'], emoji: '🌳' },
  { lines: ['累了就停', '路边站一会儿', '看看刚才骑过的路'], emoji: '🛤️' },
];

// ===== 游泳 =====
const swimPrompts: Prompt[] = [
  { lines: ['水是凉的', '还是暖的', '感受一下', '然后适应它'], emoji: '🌊' },
  { lines: ['浮在水面上', '什么都不做', '让水托住你', '你不需要用力'], emoji: '🫧' },
  { lines: ['听声音', '在水面上下不一样', '在水下听', '像是另一个世界'], emoji: '👂' },
  { lines: ['游的时候不要想', '只想水', '怎么划', '怎么呼吸'], emoji: '💭' },
];

// ===== 瑜伽 =====
const yogaPrompts: Prompt[] = [
  { lines: ['从呼吸开始', '深深地', '慢慢地', '让呼吸带着你'], emoji: '🌬️' },
  { lines: ['身体会说话', '哪里紧了', '哪里疼', '那是它的语言'], emoji: '🗣️' },
  { lines: ['不需要做到位', '做到自己能做的', '明天可能会更好', '也可能不会'], emoji: '🌱' },
  { lines: ['最后躺下来', '摊尸式', '什么都不做', '让身体记住刚才的一切'], emoji: '🧘' },
];

// ===== 折纸 =====
const origamiPrompts: Prompt[] = [
  { lines: ['把纸对折', '对齐', '压平', '这一步很简单'], emoji: '📄' },
  { lines: ['跟着折痕', '一步一步', '不需要快', '每一步都稳'], emoji: '✂️' },
  { lines: ['折错了？', '打开重来', '纸不会碎的', '碎了也没关系'], emoji: '🔄' },
  { lines: ['折完了', '看看它', '全世界只有这一张', '因为你折的'], emoji: '🌟' },
];

// ===== 捏陶 =====
const potteryPrompts: Prompt[] = [
  { lines: ['感受泥土', '凉凉的', '有点湿', '它们在等你'], emoji: '🏺' },
  { lines: ['不要急着成型', '先感受', '让它在你手里', '认识你'], emoji: '🤲' },
  { lines: ['压下去', '拉起来', '泥土会告诉你', '它想变成什么'], emoji: '✨' },
  { lines: ['做坏了', '重新来过', '泥土可以重塑', '你也可以'], emoji: '🔄' },
];

// ===== 添加新活动到映射 =====
activityExperiences.stargazing = { type: 'prompt-cycle', prompts: stargazingPrompts };
activityExperiences.music = { type: 'prompt-cycle', prompts: musicPrompts };
activityExperiences.bath = { type: 'prompt-cycle', prompts: bathPrompts };
activityExperiences.sunrise = { type: 'prompt-cycle', prompts: sunrisePrompts };
activityExperiences.rain = { type: 'prompt-cycle', prompts: rainPrompts };
activityExperiences.fire = { type: 'prompt-cycle', prompts: firePrompts };
activityExperiences.photo = { type: 'prompt-cycle', prompts: photoPrompts };
activityExperiences.write = { type: 'prompt-cycle', prompts: writePrompts };
activityExperiences.diy = { type: 'prompt-cycle', prompts: diyPrompts };
activityExperiences.collection = { type: 'prompt-cycle', prompts: collectionPrompts };
activityExperiences.cooking_new = { type: 'prompt-cycle', prompts: cookingNewPrompts };
activityExperiences.dream = { type: 'prompt-cycle', prompts: daydreamPrompts };
activityExperiences.cycling = { type: 'prompt-cycle', prompts: cyclingPrompts };
activityExperiences.swim = { type: 'prompt-cycle', prompts: swimPrompts };
activityExperiences.yoga = { type: 'prompt-cycle', prompts: yogaPrompts };
activityExperiences.origami = { type: 'prompt-cycle', prompts: origamiPrompts };
activityExperiences.pottery = { type: 'prompt-cycle', prompts: potteryPrompts };
