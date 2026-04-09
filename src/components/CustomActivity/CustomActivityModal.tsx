import { useState, useEffect, useRef } from 'react';
import type { Activity } from '../../data/activities';

const emojiOptions = [
  '🎹', '🍳', '✏️', '📝', '🧶', '🔨', '🌱', '🪴', '🎨', '📷',
  '🧘', '🚶', '🏃', '🏊', '🚴', '🤸', '🏋️', '🧗', '🤽', '🧘‍♀️',
  '☕', '📖', '🎵', '🌬️', '🕯️', '🫖', '🌸', '🍂', '🌙', '⭐',
  '🎭', '🪕', '🥁', '🎻', '🧩', '♟️', '🎲', '🪡', '🧹', '🫧',
  '🌿', '🍃', '🌊', '🔥', '🦋', '🐱', '🐕', '🐦', '🐠', '🪷',
];

const categories: { value: Activity['category']; label: string; icon: string }[] = [
  { value: 'hands', label: '动手', icon: '🤲' },
  { value: 'body', label: '身体', icon: '🫧' },
  { value: 'senses', label: '感官', icon: '👁️' },
  { value: 'creative', label: '创造', icon: '✨' },
];

const durationPresets = [
  '5 分钟', '10 分钟', '15 分钟', '20 分钟', '30 分钟', '45 分钟', '60 分钟',
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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [customDuration, setCustomDuration] = useState('');
  const [showCustomDuration, setShowCustomDuration] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  const isEditing = !!activity;

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Auto-focus name input on mount
  useEffect(() => {
    const t = setTimeout(() => nameRef.current?.focus(), 400);
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-fade-in"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0"
        style={{ background: 'color-mix(in srgb, var(--color-midnight) 90%, transparent)', backdropFilter: 'blur(16px)' }}
      />

      {/* Modal — bottom sheet on mobile, centered card on desktop */}
      <div
        className="relative w-full sm:max-w-lg sm:mx-4 rounded-t-3xl sm:rounded-2xl animate-fade-in-scale
          max-h-[92vh] sm:max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
        style={{
          background: 'color-mix(in srgb, var(--color-deep) 96%, transparent)',
          border: '1px solid color-mix(in srgb, var(--color-muted) 18%, transparent)',
          boxShadow: '0 -8px 48px -8px rgba(0,0,0,0.5), 0 0 80px -20px color-mix(in srgb, var(--color-aurora) 6%, transparent)',
        }}
      >
        {/* Mobile drag handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full"
            style={{ background: 'color-mix(in srgb, var(--color-muted) 40%, transparent)' }}
          />
        </div>

        <div className="px-5 sm:px-8 pt-3 sm:pt-7 pb-6 sm:pb-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div>
              <h2 className="text-lg sm:text-xl font-extralight text-whisper/90 tracking-wide">
                {isEditing ? '编辑活动' : '添加活动'}
              </h2>
              <p className="text-xs text-whisper/50 mt-1 font-light">
                {isEditing ? '修改你的慢时光' : '创造一段属于你的慢时光'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center
                text-whisper/60 hover:text-whisper/80 transition-all duration-300 text-sm"
              style={{
                background: 'color-mix(in srgb, var(--color-surface) 40%, transparent)',
                border: '1px solid color-mix(in srgb, var(--color-muted) 15%, transparent)',
              }}
            >
              ✕
            </button>
          </div>

          {/* Live preview card */}
          <div
            className="mb-6 sm:mb-8 rounded-2xl p-4 sm:p-5 flex items-center gap-4 transition-all duration-500"
            style={{
              background: 'color-mix(in srgb, var(--color-surface) 25%, transparent)',
              border: '1px solid color-mix(in srgb, var(--color-muted) 12%, transparent)',
            }}
          >
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-3xl sm:text-4xl shrink-0 transition-all duration-500"
              style={{
                background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-aurora) 12%, transparent), color-mix(in srgb, var(--color-aurora) 4%, transparent))',
                border: '1px solid color-mix(in srgb, var(--color-aurora) 20%, transparent)',
                boxShadow: '0 0 20px color-mix(in srgb, var(--color-aurora) 8%, transparent)',
              }}
            >
              {icon}
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-light text-whisper/80 truncate">
                {name || '未命名活动'}
              </h3>
              <p className="text-xs text-whisper/35 mt-0.5 truncate">
                {description || '添加一段描述...'}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-xs font-mono" style={{ color: 'color-mix(in srgb, var(--color-aurora) 45%, transparent)' }}>
                  {showCustomDuration ? (customDuration || '自定义') : duration}
                </span>
                <span className="text-whisper/40">·</span>
                <span className="text-xs text-whisper/50">
                  {categories.find(c => c.value === category)?.label}
                </span>
              </div>
            </div>
          </div>

          {/* Icon picker */}
          <div className="mb-5 sm:mb-6">
            <label className="block text-xs text-whisper/60 mb-2.5 tracking-wide font-light">选择图标</label>
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all duration-500"
              style={{
                background: 'linear-gradient(135deg, color-mix(in srgb, var(--color-aurora) 15%, transparent), color-mix(in srgb, var(--color-aurora) 5%, transparent))',
                border: '1px solid color-mix(in srgb, var(--color-aurora) 30%, transparent)',
                boxShadow: '0 0 16px color-mix(in srgb, var(--color-aurora) 10%, transparent)',
              }}
            >
              {icon}
            </button>
            {showEmojiPicker && (
              <div
                className="mt-3 p-3 rounded-2xl animate-fade-in max-h-48 overflow-y-auto"
                style={{
                  background: 'color-mix(in srgb, var(--color-surface) 40%, transparent)',
                  border: '1px solid color-mix(in srgb, var(--color-muted) 15%, transparent)',
                }}
              >
                <div className="grid grid-cols-8 sm:grid-cols-10 gap-1">
                  {emojiOptions.map(e => (
                    <button
                      key={e}
                      onClick={() => { setIcon(e); setShowEmojiPicker(false); }}
                      className="aspect-square rounded-lg flex items-center justify-center text-lg sm:text-xl transition-all duration-200"
                      style={{
                        background: icon === e
                          ? 'color-mix(in srgb, var(--color-aurora) 20%, transparent)'
                          : 'transparent',
                        border: icon === e
                          ? '1px solid color-mix(in srgb, var(--color-aurora) 35%, transparent)'
                          : '1px solid transparent',
                        boxShadow: icon === e
                          ? '0 0 8px color-mix(in srgb, var(--color-aurora) 15%, transparent)'
                          : 'none',
                        transform: icon === e ? 'scale(1.1)' : 'scale(1)',
                      }}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Name */}
          <div className="mb-4 sm:mb-5">
            <label className="block text-xs text-whisper/60 mb-2 tracking-wide font-light">活动名称</label>
            <input
              ref={nameRef}
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="比如：折纸、冥想、遛狗..."
              className="input-field"
              maxLength={20}
            />
          </div>

          {/* Description */}
          <div className="mb-4 sm:mb-5">
            <label className="block text-xs text-whisper/60 mb-2 tracking-wide font-light">简短描述</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="一句话说明这个活动"
              className="input-field"
              maxLength={40}
            />
          </div>

          {/* Guide */}
          <div className="mb-5 sm:mb-6">
            <label className="block text-xs text-whisper/60 mb-2 tracking-wide font-light">引导语</label>
            <textarea
              value={guide}
              onChange={e => setGuide(e.target.value)}
              placeholder="活动时的温馨提示..."
              className="input-field h-20 resize-none"
              maxLength={100}
            />
          </div>

          {/* Duration presets */}
          <div className="mb-5 sm:mb-6">
            <label className="block text-xs text-whisper/60 mb-2.5 tracking-wide font-light">建议时长</label>
            <div className="flex flex-wrap gap-2">
              {durationPresets.map(d => (
                <button
                  key={d}
                  onClick={() => handleDurationSelect(d)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-light transition-all duration-400"
                  style={{
                    color: (!showCustomDuration && duration === d) ? 'var(--color-glow)' : 'color-mix(in srgb, var(--color-whisper) 50%, transparent)',
                    background: (!showCustomDuration && duration === d)
                      ? 'linear-gradient(135deg, color-mix(in srgb, var(--color-aurora) 18%, transparent), color-mix(in srgb, var(--color-aurora) 6%, transparent))'
                      : 'color-mix(in srgb, var(--color-surface) 40%, transparent)',
                    border: (!showCustomDuration && duration === d)
                      ? '1px solid color-mix(in srgb, var(--color-aurora) 35%, transparent)'
                      : '1px solid color-mix(in srgb, var(--color-muted) 18%, transparent)',
                    boxShadow: (!showCustomDuration && duration === d)
                      ? '0 2px 8px -2px color-mix(in srgb, var(--color-aurora) 15%, transparent)'
                      : 'none',
                  }}
                >
                  {d}
                </button>
              ))}
              <button
                onClick={() => handleDurationSelect('custom')}
                className="px-3.5 py-1.5 rounded-full text-xs font-light transition-all duration-400"
                style={{
                  color: showCustomDuration ? 'var(--color-glow)' : 'color-mix(in srgb, var(--color-whisper) 35%, transparent)',
                  background: showCustomDuration
                    ? 'linear-gradient(135deg, color-mix(in srgb, var(--color-aurora) 18%, transparent), color-mix(in srgb, var(--color-aurora) 6%, transparent))'
                    : 'transparent',
                  border: showCustomDuration
                    ? '1px solid color-mix(in srgb, var(--color-aurora) 35%, transparent)'
                    : '1px dashed color-mix(in srgb, var(--color-muted) 25%, transparent)',
                }}
              >
                自定义...
              </button>
            </div>
            {showCustomDuration && (
              <input
                type="text"
                value={customDuration}
                onChange={e => setCustomDuration(e.target.value)}
                placeholder="比如：15-30 分钟"
                className="input-field mt-2.5"
                autoFocus
              />
            )}
          </div>

          {/* Category pills */}
          <div className="mb-7 sm:mb-8">
            <label className="block text-xs text-whisper/60 mb-2.5 tracking-wide font-light">分类</label>
            <div className="flex gap-2.5">
              {categories.map(c => (
                <button
                  key={c.value}
                  onClick={() => setCategory(c.value)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-light transition-all duration-500 flex items-center justify-center gap-1.5"
                  style={{
                    color: category === c.value ? 'var(--color-glow)' : 'color-mix(in srgb, var(--color-whisper) 45%, transparent)',
                    background: category === c.value
                      ? 'linear-gradient(135deg, color-mix(in srgb, var(--color-aurora) 18%, transparent), color-mix(in srgb, var(--color-aurora) 6%, transparent))'
                      : 'color-mix(in srgb, var(--color-surface) 35%, transparent)',
                    border: category === c.value
                      ? '1px solid color-mix(in srgb, var(--color-aurora) 35%, transparent)'
                      : '1px solid color-mix(in srgb, var(--color-muted) 15%, transparent)',
                    boxShadow: category === c.value
                      ? '0 2px 12px -2px color-mix(in srgb, var(--color-aurora) 12%, transparent)'
                      : 'none',
                  }}
                >
                  <span className="text-base">{c.icon}</span>
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="divider mb-6 sm:mb-7" />

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={!name.trim()}
              className={`flex-1 py-3 sm:py-3.5 rounded-xl text-sm transition-all duration-500 ${
                name.trim()
                  ? 'btn-primary'
                  : 'opacity-30 cursor-not-allowed'
              }`}
            >
              {isEditing ? '保存修改' : '添加活动'}
            </button>
            <button onClick={onClose} className="btn-ghost px-6">
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
