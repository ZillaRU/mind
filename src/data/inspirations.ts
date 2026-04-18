// Curated public domain inspirations
// All content is either public domain or freely usable
// Music: composed before 1928
// Poetry: classical Chinese poetry + pre-1928 Western poetry
// Art: artists deceased >70 years

export type InspirationType = 'music' | 'poetry' | 'art' | 'prose';

export interface Inspiration {
  type: InspirationType;
  title: string;
  author: string;
  era?: string;
  description: string;
  imageUrl?: string;
  emoji?: string;
  text?: string;
  listenHint?: string;
}

export const inspirations: Inspiration[] = [
  // === Music (public domain) ===
  {
    type: 'music',
    title: 'Gymnopédie No.1',
    author: 'Erik Satie',
    era: '1888',
    description: '缓慢、简约、几乎静止的旋律。像是一个人在深夜独自坐在钢琴前，什么都不想，只是让手指自己走。',
    listenHint: '搜索 "Gymnopédie No.1 Satie"',
  },
  {
    type: 'music',
    title: '月光',
    author: 'Claude Debussy',
    era: '1905',
    description: '月光洒在水面上的声音。德彪西用音符画了一幅画，每个音符都像月光一样轻柔地落在琴键上。',
    listenHint: '搜索 "Clair de Lune Debussy"',
  },
  {
    type: 'music',
    title: '夜曲 Op.9 No.2',
    author: 'Frédéric Chopin',
    era: '1832',
    description: '肖邦写给夜晚的情书。左手如水波般流动，右手唱着无人打扰的旋律。',
    listenHint: '搜索 "Nocturne Op.9 No.2 Chopin"',
  },
  {
    type: 'music',
    title: '哥德堡变奏曲',
    author: 'J.S. Bach',
    era: '1741',
    description: '巴赫据说为一位失眠的伯爵写的。三十个变奏，像三十种安静的姿势，最后回到最初的咏叹调——一切如初。',
    listenHint: '搜索 "Goldberg Variations Bach"',
  },
  {
    type: 'music',
    title: 'G弦上的咏叹调',
    author: 'J.S. Bach',
    era: '1730s',
    description: '只用一根G弦演奏的旋律。限制反而成就了它——有时候少即是多。',
    listenHint: '搜索 "Air on the G String Bach"',
  },
  {
    type: 'music',
    title: '月光奏鸣曲 第一乐章',
    author: 'Ludwig van Beethoven',
    era: '1801',
    description: '贝多芬失聪后写的。三连音像月光下的脚步，缓慢而坚定。最深的悲伤里，藏着最温柔的力量。',
    listenHint: '搜索 "Moonlight Sonata 1st movement"',
  },
  {
    type: 'music',
    title: '前奏曲 E小调 Op.28 No.4',
    author: 'Frédéric Chopin',
    era: '1839',
    description: '肖邦要求"极慢地"演奏。左手不断重复同一个和弦，像心跳，像潮汐，像时间本身。',
    listenHint: '搜索 "Prelude Op.28 No.4 Chopin"',
  },
  {
    type: 'music',
    title: '四季·冬',
    author: 'Antonio Vivaldi',
    era: '1725',
    description: '维瓦尔第的冬天不冷。窗外下着雪，屋里有火，有人在拉琴。寒冷中的温暖，才是真正的温暖。',
    listenHint: '搜索 "Vivaldi Winter Four Seasons"',
  },
  {
    type: 'music',
    title: '圣母颂',
    author: 'Franz Schubert',
    era: '1825',
    description: '舒伯特根据席勒的诗谱曲。旋律像一条缓缓上升的线，越走越高，越走越安静。',
    listenHint: '搜索 "Ave Maria Schubert"',
  },
  {
    type: 'music',
    title: '致爱丽丝',
    author: 'Ludwig van Beethoven',
    era: '1810',
    description: '贝多芬写给学生的练习曲，却成了全世界最温柔的旋律。简单的音符，反复的温柔。',
    listenHint: '搜索 "Für Elise Beethoven"',
  },

  // === Poetry (public domain) ===
  {
    type: 'poetry',
    title: '饮酒·其五',
    author: '陶渊明',
    era: '东晋',
    text: '结庐在人境，而无车马喧。\n问君何能尔？心远地自偏。\n采菊东篱下，悠然见南山。\n山气日夕佳，飞鸟相与还。\n此中有真意，欲辨已忘言。',
    description: '在喧嚣中找到安静，不是逃离，而是心远了。',
  },
  {
    type: 'poetry',
    title: '春江花月夜（节选）',
    author: '张若虚',
    era: '唐',
    text: '春江潮水连海平，海上明月共潮生。\n滟滟随波千万里，何处春江无月明！\n\n江畔何人初见月？江月何年初照人？\n人生代代无穷已，江月年年望相似。',
    description: '被誉为"孤篇盖全唐"。月亮照了千年，问题问了千年，答案始终是同一个。',
  },
  {
    type: 'poetry',
    title: '枫桥夜泊',
    author: '张继',
    era: '唐',
    text: '月落乌啼霜满天，\n江枫渔火对愁眠。\n姑苏城外寒山寺，\n夜半钟声到客船。',
    description: '一个落榜书生的失眠之夜，却写出了最温柔的夜晚。',
  },
  {
    type: 'poetry',
    title: '行路难·其一（节选）',
    author: '李白',
    era: '唐',
    text: '行路难，行路难，多歧路，今安在？\n长风破浪会有时，直挂云帆济沧海。',
    description: '李白也会迷茫。但迷茫之后，他选择继续走。',
  },
  {
    type: 'poetry',
    title: '鸟鸣涧',
    author: '王维',
    era: '唐',
    text: '人闲桂花落，夜静春山空。\n月出惊山鸟，时鸣春涧中。',
    description: '王维的诗里没有"我"。只有桂花在落，月亮在升，鸟在叫。人闲了，世界就满了。',
  },
  {
    type: 'poetry',
    title: '定风波（节选）',
    author: '苏轼',
    era: '宋',
    text: '莫听穿林打叶声，何妨吟啸且徐行。\n竹杖芒鞋轻胜马，谁怕？\n一蓑烟雨任平生。',
    description: '下雨了。别人跑，他走。不是不怕淋湿，是淋湿了也无所谓。',
  },
  {
    type: 'poetry',
    title: '如梦令',
    author: '李清照',
    era: '宋',
    text: '常记溪亭日暮，沉醉不知归路。\n兴尽晚回舟，误入藕花深处。\n争渡，争渡，惊起一滩鸥鹭。',
    description: '李清照喝醉了，把船划进了荷花丛里。那种尽兴，很久没有过了吧。',
  },
  {
    type: 'poetry',
    title: '竹里馆',
    author: '王维',
    era: '唐',
    text: '独坐幽篁里，弹琴复长啸。\n深林人不知，明月来相照。',
    description: '一个人在竹林里弹琴，没人听。但月亮会听。',
  },
  {
    type: 'poetry',
    title: '登幽州台歌',
    author: '陈子昂',
    era: '唐',
    text: '前不见古人，后不见来者。\n念天地之悠悠，独怆然而涕下。',
    description: '站在高台上，往前看往后看都是空白。有时候孤独不是因为没人，是因为天地太大了。',
  },
  {
    type: 'poetry',
    title: '临江仙',
    author: '晏几道',
    era: '宋',
    text: '梦后楼台高锁，酒醒帘幕低垂。\n去年春恨却来时。\n落花人独立，微雨燕双飞。',
    description: '落花时节，一个人站着。雨很小，燕子成双。孤独有时候也是一种美。',
  },

  // === Art (public domain - no external images, use gradient + emoji) ===
  {
    type: 'art',
    title: '星月夜',
    author: 'Vincent van Gogh',
    era: '1889',
    description: '梵高在精神病院里画的夜空。漩涡般的星空下有一个安静的村庄。他看到的夜空，比任何人都热烈。',
    emoji: '🌌',
  },
  {
    type: 'art',
    title: '睡莲',
    author: 'Claude Monet',
    era: '1906',
    description: '莫奈晚年几乎只画睡莲。他不是在画花，是在画光落在水面上的样子。同一片池塘，他画了三百多次。',
    emoji: '🪷',
  },
  {
    type: 'art',
    title: '神奈川冲浪里',
    author: '葛饰北斋',
    era: '1831',
    description: '北斋画这幅画时已经七十多岁了。巨浪要吞没一切，但远处的富士山纹丝不动。大浪之下，有恒常。',
    emoji: '🌊',
  },
  {
    type: 'art',
    title: '向日葵',
    author: 'Vincent van Gogh',
    era: '1888',
    description: '梵高用最浓烈的黄色画向日葵。它们在花瓶里，有的盛开，有的枯萎。每一朵都是生命的某个瞬间。',
    emoji: '🌻',
  },
  {
    type: 'art',
    title: '日出·印象',
    author: 'Claude Monet',
    era: '1872',
    description: '这幅画给了"印象派"这个名字。雾气中的港口，太阳只是一个橙色的圆。莫奈画的不是风景，是印象——你第一眼看到的东西。',
    emoji: '🌅',
  },
  {
    type: 'art',
    title: '凯风快晴',
    author: '葛饰北斋',
    era: '1830',
    description: '也叫"赤富士"。夏天的清晨，富士山被朝霞染成红色。北斋画了三十六次富士山，每一次都不一样。重复不是无聊，是深入。',
    emoji: '🗻',
  },
  {
    type: 'art',
    title: '呐喊',
    author: 'Edvard Munch',
    era: '1893',
    description: '蒙克说："我和两个朋友一起散步，太阳下山了——突然间，天空变得血红。"焦虑的尽头，是承认它。',
    emoji: '🌫️',
  },
  {
    type: 'art',
    title: '大碗岛的星期天下午',
    author: 'Georges Seurat',
    era: '1886',
    description: '修拉用了两年的点彩画法完成这幅画。几百万个色点，远处看才是一幅画。有时候，退后一步才能看清全貌。',
    emoji: '🎨',
  },

  // === Prose (public domain) ===
  {
    type: 'prose',
    title: '瓦尔登湖（节选）',
    author: 'Henry David Thoreau',
    era: '1854',
    text: '我步入丛林，因为我希望生活得有意义，我希望活得深刻，吸取生命中所有的精华，把非生命的一切都击溃。',
    description: '梭罗在瓦尔登湖边住了两年。他说，简单的生活才能触及本质。',
  },
  {
    type: 'prose',
    title: '道德经（节选）',
    author: '老子',
    era: '春秋',
    text: '致虚极，守静笃。\n万物并作，吾以观复。\n夫物芸芸，各复归其根。\n归根曰静，是谓复命。',
    description: '静下来，才能看见事物的本来面目。',
  },
  {
    type: 'prose',
    title: '逍遥游（节选）',
    author: '庄子',
    era: '战国',
    text: '北冥有鱼，其名为名为鲲。鲲之大，不知其几千里也；化而为鸟，其名为鹏。',
    description: '庄子眼里的世界很大。大到你不需要担心迷路，因为到处都是路。',
  },
  {
    type: 'prose',
    title: '心经',
    author: '玄奘译',
    era: '唐',
    text: '观自在菩萨，行深般若波罗蜜多时，照见五蕴皆空，度一切苦厄。',
    description: '空不是虚无，是不执着。放下了，心就自由了。',
  },
];
