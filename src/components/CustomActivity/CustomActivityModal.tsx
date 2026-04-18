import { useState, useEffect, useRef } from 'react';
import type { Activity } from '../../data/activities';

const emojiGroups = {
  nature: { label: '自然', items: ['🌿', '🍃', '🌊', '🔥', '🌸', '🍂', '🌙', '⭐', '🦋', '🪷', '🌊', '🌅'] },
  hands: { label: '动手', items: ['🎹', '🍳', '🧶', '🔨', '🎨', '📷', '🪕', '🥁', '🧩', '🪡', '🧹', '🫧'] },
  body: { label: '身体', items: ['🧘', '🚶', '🏊', '🚴', '🤸', '🧗', '🧘‍♀️', '🤽', '🌱', '🪴', '🕯️', '🫖'] },
  senses: { label: '感官', items: ['☕', '📖', '🎵', '🌬️', '🦋', '🐱', '🐕', '🐦', '🐠', '🎭', '♟️', '🎲'] },
};

const categories: { value: Activity['category']; label: string; icon: string }[] = [
  { value: 'hands', label: '动手', icon: '🤲' },
  { value: 'body', label: '身体', icon: '🫧' },
  { value: 'senses', label: '感官', icon: '👁️' },
  { value: 'creative', label: '创造', icon: '✨' },
];

const durationPresets = [
  '5 分钟', '10 分钟', '15 分钟', '20 分钟', '30 分钟', '45 分钟', '60 分钟',
];

const guideSuggestions = [
  '不必追求完美，感受过程就好',
  '放下手机，专注当下的感觉',
  '按照自己的节奏来',
  '这是属于你的时间',
];

interface Props {
  activity?: Activity | null;
  onSave: (activity: Activity) => void;
  onClose: () => void;
}

export default function CustomActivityModal({ activity, onSave, onClose }: Props) {
  const [name, setName] = useState(activity?.name || '');
  const [icon, setIcon] = useState(activity?.icon || '🌿');
  const [description, setDescription] = useState(activity?.description || '');
  const [guide, setGuide] = useState(activity?.guide || '');
  const [duration, setDuration] = useState(activity?.duration || '15 分钟');
  const [category, setCategory] = useState<Activity['category']>(activity?.category || 'hands');
  
  const [customDuration, setCustomDuration] = useState('');
  const [showCustomDuration, setShowCustomDuration] = useState(false);
  const [activeGroup, setActiveGroup] = useState<keyof typeof emojiGroups>('nature');
  const nameRef = useRef<HTMLInputElement>(null);

  const isEditing = !!activity;

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  useEffect(() => {
    const t = setTimeout(() => nameRef.current?.focus(), 500);
    return () => clearTimeout(t);
  }, []);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      id: activity?.id || `custom-${Date.now()}`,
      name: name.trim(),
      icon,
      description: description.trim() || '自定义活动',
      guide: guide.trim() || '按照自己的节奏来就好。',
      duration: (showCustomDuration ? customDuration.trim() : duration) || '15 分钟',
      category,
    });
    onClose();
  };

  const handleDurationSelect = (d: string) => {
    if (d === 'custom') {
      setShowCustomDuration(true);
      setCustomDuration(duration);
    } else {
      setDuration(d);
      setShowCustomDuration(false);
    }
  };

  const randomizeIcon = () => {
    const allEmojis = Object.values(emojiGroups).flatMap(g => g.items);
    const random = allEmojis[Math.floor(Math.random() * allEmojis.length)];
    setIcon(random);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 animate-fade-in"
        style={{ 
          background: 'linear-gradient(180deg, color-mix(in srgb, var(--color-midnight) 95%, transparent) 0%, color-mix(in srgb, var(--color-deep) 98%, transparent) 100%)',
          backdropFilter: 'blur(24px)',
        }}
      />

      {/* Modal */}
      <div
        className="relative w-full sm:max-w-xl sm:mx-4 rounded-t-3xl sm:rounded-3xl
          max-h-[92vh] sm:max-h-[88vh] overflow-y-auto animate-slide-up"
        onClick={e => e.stopPropagation()}
        style={{
          background: 'linear-gradient(180deg, color-mix(in srgb, var(--color-deep) 98%, transparent) 0%, color-mix(in srgb, var(--color-midnight) 95%, transparent) 100%)',
          border: '1px solid color-mix(in srgb, var(--color-aurora) 12%, transparent)',
          boxShadow: '0 -16px 64px -16px rgba(0,0,0,0.6), 0 0 120px -40px color-mix(in srgb, var(--color-aurora) 8%, transparent)',
        }}
      >
        {/* Mobile drag handle */}
        <div className="flex justify-center pt-4 pb-2 sm:hidden">
          <div 
            className="w-12 h-1 rounded-full"
            style={{ background: 'color-mix(in srgb, var(--color-aurora) 30%, transparent)' }}
          />
        </div>

        <div className="px-6 sm:px-10 pt-4 sm:pt-8 pb-8 sm:pb-10">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <div 
              className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-2xl text-5xl sm:text-6xl mb-5 transition-all duration-700"
              style={{
                background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-aurora) 18%, transparent), color-mix(in srgb, var(--color-aurora) 6%, transparent))',
                border: '1.5px solid color-mix(in srgb, var(--color-aurora) 28%, transparent)',
                boxShadow: '0 0 40px color-mix(in srgb, var(--color-aurora) 12%, transparent), inset 0 0 20px color-mix(in srgb, var(--color-aurora) 5%, transparent)',
              }}
            >
              {icon}
            </div>
            <h2 className="text-xl sm:text-2xl font-extralight text-whisper/90 tracking-wider mb-2">
              {isEditing ? '编辑活动' : '创造慢时光'}
            </h2>
            <p className="text-sm text-whisper/40 font-light">
              {name || '未命名'}
              <span className="mx-2">·</span>
              {showCustomDuration ? (customDuration || '自定义') : duration}
            </p>
          </div>

          {/* Icon selector */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <label className="text-xs text-whisper/50 tracking-widest uppercase font-light">
                选择图标
              </label>
              <button
                onClick={randomizeIcon}
                className="text-xs text-aurora/60 hover:text-aurora/90 transition-colors font-light flex items-center gap-1.5"
              >
                <span>✦</span>
                随机
              </button>
            </div>
            
            {/* Group tabs */}
            <div className="flex gap-2 mb-4">
              {Object.entries(emojiGroups).map(([key, group]) => (
                <button
                  key={key}
                  onClick={() => setActiveGroup(key as keyof typeof emojiGroups)}
                  className="px-3 py-1.5 rounded-lg text-xs font-light transition-all duration-400"
                  style={{
                    color: activeGroup === key ? 'var(--color-glow)' : 'color-mix(in srgb, var(--color-whisper) 40%, transparent)',
                    background: activeGroup === key
                      ? 'color-mix(in srgb, var(--color-aurora) 12%, transparent)'
                      : 'color-mix(in srgb, var(--color-surface) 20%, transparent)',
                    border: activeGroup === key
                      ? '1px solid color-mix(in srgb, var(--color-aurora) 25%, transparent)'
                      : '1px solid transparent',
                  }}
                >
                  {group.label}
                </button>
              ))}
            </div>
            
            {/* Emoji grid */}
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
              {emojiGroups[activeGroup].items.map(e => (
                <button
                  key={e}
                  onClick={() => setIcon(e)}
                  className="aspect-square rounded-xl flex items-center justify-center text-2xl sm:text-3xl transition-all duration-300"
                  style={{
                    background: icon === e
                      ? 'linear-gradient(135deg, color-mix(in srgb, var(--color-aurora) 20%, transparent), color-mix(in srgb, var(--color-aurora) 8%, transparent))'
                      : 'color-mix(in srgb, var(--color-surface) 15%, transparent)',
                    border: icon === e
                      ? '1.5px solid color-mix(in srgb, var(--color-aurora) 35%, transparent)'
                      : '1px solid color-mix(in srgb, var(--color-muted) 10%, transparent)',
                    boxShadow: icon === e
                      ? '0 4px 20px -4px color-mix(in srgb, var(--color-aurora) 20%, transparent)'
                      : 'none',
                    transform: icon === e ? 'scale(1.08)' : 'scale(1)',
                  }}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Name & Description row */}
          <div className="grid sm:grid-cols-2 gap-5 mb-6">
            <div>
              <label className="block text-xs text-whisper/50 mb-3 tracking-widest uppercase font-light">
                名称
              </label>
              <input
                ref={nameRef}
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="比如：折纸"
                maxLength={16}
                className="w-full px-4 py-3.5 rounded-xl text-base font-light transition-all duration-400
                  focus:outline-none focus:ring-2 focus:ring-aurora/30"
                style={{
                  background: 'color-mix(in srgb, var(--color-surface) 25%, transparent)',
                  border: '1px solid color-mix(in srgb, var(--color-muted) 15%, transparent)',
                  color: 'var(--color-whisper)',
                }}
              />
            </div>
            <div>
              <label className="block text-xs text-whisper/50 mb-3 tracking-widest uppercase font-light">
                描述
              </label>
              <input
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="一句话介绍"
                maxLength={30}
                className="w-full px-4 py-3.5 rounded-xl text-base font-light transition-all duration-400
                  focus:outline-none focus:ring-2 focus:ring-aurora/30"
                style={{
                  background: 'color-mix(in srgb, var(--color-surface) 25%, transparent)',
                  border: '1px solid color-mix(in srgb, var(--color-muted) 15%, transparent)',
                  color: 'var(--color-whisper)',
                }}
              />
            </div>
          </div>

          {/* Duration */}
          <div className="mb-6">
            <label className="block text-xs text-whisper/50 mb-3 tracking-widest uppercase font-light">
              建议时长
            </label>
            <div className="flex flex-wrap gap-2">
              {durationPresets.map(d => (
                <button
                  key={d}
                  onClick={() => handleDurationSelect(d)}
                  className="px-4 py-2 rounded-xl text-sm font-light transition-all duration-400"
                  style={{
                    color: (!showCustomDuration && duration === d) ? 'var(--color-glow)' : 'color-mix(in srgb, var(--color-whisper) 45%, transparent)',
                    background: (!showCustomDuration && duration === d)
                      ? 'linear-gradient(135deg, color-mix(in srgb, var(--color-aurora) 15%, transparent), color-mix(in srgb, var(--color-aurora) 5%, transparent))'
                      : 'color-mix(in srgb, var(--color-surface) 20%, transparent)',
                    border: (!showCustomDuration && duration === d)
                      ? '1px solid color-mix(in srgb, var(--color-aurora) 30%, transparent)'
                      : '1px solid color-mix(in srgb, var(--color-muted) 12%, transparent)',
                    boxShadow: (!showCustomDuration && duration === d)
                      ? '0 4px 16px -4px color-mix(in srgb, var(--color-aurora) 15%, transparent)'
                      : 'none',
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="mb-8">
            <label className="block text-xs text-whisper/50 mb-3 tracking-widest uppercase font-light">
              分类
            </label>
            <div className="grid grid-cols-4 gap-2">
              {categories.map(c => (
                <button
                  key={c.value}
                  onClick={() => setCategory(c.value)}
                  className="py-3 rounded-xl text-sm font-light transition-all duration-400 flex flex-col items-center gap-1"
                  style={{
                    color: category === c.value ? 'var(--color-glow)' : 'color-mix(in srgb, var(--color-whisper) 40%, transparent)',
                    background: category === c.value
                      ? 'linear-gradient(135deg, color-mix(in srgb, var(--color-aurora) 15%, transparent), color-mix(in srgb, var(--color-aurora) 5%, transparent))'
                      : 'color-mix(in srgb, var(--color-surface) 20%, transparent)',
                    border: category === c.value
                      ? '1px solid color-mix(in srgb, var(--color-aurora) 28%, transparent)'
                      : '1px solid color-mix(in srgb, var(--color-muted) 12%, transparent)',
                    boxShadow: category === c.value
                      ? '0 4px 16px -4px color-mix(in srgb, var(--color-aurora) 12%, transparent)'
                      : 'none',
                  }}
                >
                  <span className="text-lg">{c.icon}</span>
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Guide */}
          <div className="mb-8">
            <label className="block text-xs text-whisper/50 mb-3 tracking-widest uppercase font-light">
              引导语
            </label>
            <textarea
              value={guide}
              onChange={e => setGuide(e.target.value)}
              placeholder={guideSuggestions[Math.floor(Math.random() * guideSuggestions.length)]}
              className="w-full px-4 py-4 rounded-xl text-sm font-light resize-none h-24 transition-all duration-400
                focus:outline-none focus:ring-2 focus:ring-aurora/30"
              maxLength={80}
              style={{
                background: 'color-mix(in srgb, var(--color-surface) 25%, transparent)',
                border: '1px solid color-mix(in srgb, var(--color-muted) 15%, transparent)',
                color: 'var(--color-whisper)',
              }}
            />
            <p className="text-xs text-whisper/30 mt-2 font-light italic">
              提示：在活动时显示，给自己一个温柔的提醒
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={!name.trim()}
              className={`flex-1 py-4 rounded-xl text-sm font-light tracking-wide transition-all duration-500 ${
                name.trim()
                  ? 'btn-primary'
                  : 'opacity-30 cursor-not-allowed'
              }`}
            >
              {isEditing ? '保存修改' : '添加活动'}
            </button>
            <button 
              onClick={onClose} 
              className="px-6 py-4 rounded-xl text-sm font-light text-whisper/50 hover:text-whisper/70 transition-colors"
              style={{
                background: 'color-mix(in srgb, var(--color-surface) 20%, transparent)',
              }}
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
