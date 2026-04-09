import { useState, useEffect } from 'react';
import type { Activity } from '../../data/activities';

const emojiOptions = [
  '🎹', '🍳', '✏️', '📝', '🧶', '🔨', '🌱', '🪴', '🎨', '📷',
  '🧘', '🚶', '🏃', '🏊', '🚴', '🤸', '🏋️', '🧗', '🤽', '🧘‍♀️',
  '☕', '📖', '🎵', '🌬️', '🕯️', '🫖', '🌸', '🍂', '🌙', '⭐',
  '🎭', '🪕', '🥁', '🎻', '🧩', '♟️', '🎲', '🪡', '🧹', '🫧',
  '🌿', '🍃', '🌊', '🔥', '🦋', '🐱', '🐕', '🐦', '🐠', '🪷',
];

const categories = [
  { value: 'hands' as const, label: '动手' },
  { value: 'body' as const, label: '身体' },
  { value: 'senses' as const, label: '感官' },
  { value: 'creative' as const, label: '创造' },
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
  const [duration, setDuration] = useState(activity?.duration || '15-30 分钟');
  const [category, setCategory] = useState<Activity['category']>(activity?.category || 'creative');
  const [showCustomDuration, setShowCustomDuration] = useState(false);
  const [customDuration, setCustomDuration] = useState('');
  const isEditing = !!activity;

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      id: activity?.id || `custom-${Date.now()}`,
      name: name.trim(),
      icon,
      description: description.trim() || '自定义活动',
      guide: guide.trim() || '享受这段时光',
      duration: showCustomDuration ? (customDuration || '自定义') : duration,
      category,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-6 py-10"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-3xl p-8 sm:p-10 animate-fade-in-scale"
        style={{
          background: 'var(--color-deep)',
          border: '1px solid color-mix(in srgb, var(--color-muted) 20%, transparent)',
          boxShadow: '0 24px 80px -12px rgba(0,0,0,0.5)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-extralight text-whisper/90 tracking-wide">
              {isEditing ? '编辑活动' : '添加活动'}
            </h2>
            <p className="text-sm text-whisper/50 mt-1.5 font-light">
              {isEditing ? '修改你的慢时光' : '创造一段属于你的慢时光'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center
              text-whisper/60 hover:text-whisper/80 transition-all duration-300 text-base"
            style={{
              background: 'color-mix(in srgb, var(--color-surface) 40%, transparent)',
              border: '1px solid color-mix(in srgb, var(--color-muted) 15%, transparent)',
            }}
          >
            ✕
          </button>
        </div>

        {/* Icon picker */}
        <div className="mb-7">
          <label className="block text-sm text-whisper/60 mb-3 tracking-wide font-light">
            选择图标
          </label>
          <div className="flex flex-wrap gap-3">
            {emojiOptions.map((emoji) => (
              <button
                key={emoji}
                onClick={() => setIcon(emoji)}
                className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl
                  transition-all duration-300 ${
                  icon === emoji
                    ? 'scale-110'
                    : 'hover:scale-105 opacity-60 hover:opacity-100'
                }`}
                style={{
                  background: icon === emoji
                    ? 'color-mix(in srgb, var(--color-aurora) 15%, transparent)'
                    : 'color-mix(in srgb, var(--color-surface) 30%, transparent)',
                  border: icon === emoji
                    ? '1px solid color-mix(in srgb, var(--color-aurora) 30%, transparent)'
                    : '1px solid transparent',
                  boxShadow: icon === emoji
                    ? '0 0 12px -2px color-mix(in srgb, var(--color-aurora) 20%, transparent)'
                    : 'none',
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Form fields */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm text-whisper/60 mb-2.5 tracking-wide font-light">
              活动名称
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="给这段时光起个名字"
              className="input-field"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm text-whisper/60 mb-2.5 tracking-wide font-light">
              简短描述
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="一句话描述它"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm text-whisper/60 mb-2.5 tracking-wide font-light">
              引导语
            </label>
            <textarea
              value={guide}
              onChange={(e) => setGuide(e.target.value)}
              placeholder="开始前给自己的一句话"
              className="input-field resize-none"
              rows={3}
            />
          </div>

          <div className="flex gap-5">
            <div className="flex-1">
              <label className="block text-sm text-whisper/60 mb-2.5 tracking-wide font-light">
                建议时长
              </label>
              <select
                value={showCustomDuration ? 'custom' : duration}
                onChange={(e) => {
                  if (e.target.value === 'custom') {
                    setShowCustomDuration(true);
                  } else {
                    setShowCustomDuration(false);
                    setDuration(e.target.value);
                  }
                }}
                className="input-field appearance-none cursor-pointer pr-10"
              >
                <option value="5-10 分钟">5-10 分钟</option>
                <option value="10-20 分钟">10-20 分钟</option>
                <option value="15-30 分钟">15-30 分钟</option>
                <option value="20-40 分钟">20-40 分钟</option>
                <option value="30-60 分钟">30-60 分钟</option>
                <option value="随意">随意</option>
                <option value="custom">自定义...</option>
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-whisper/50 pointer-events-none text-sm">
                ▾
              </span>
            </div>

            {showCustomDuration && (
              <div className="flex-1">
                <label className="block text-sm text-whisper/60 mb-2.5 tracking-wide font-light">
                  自定义时长
                </label>
                <input
                  type="text"
                  value={customDuration}
                  onChange={(e) => setCustomDuration(e.target.value)}
                  placeholder="比如：一杯茶的时间"
                  className="input-field"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm text-whisper/60 mb-2.5 tracking-wide font-light">
              分类
            </label>
            <div className="flex gap-3">
              {categories.map(c => (
                <button
                  key={c.value}
                  onClick={() => setCategory(c.value)}
                  className={`px-5 py-2.5 rounded-xl text-sm transition-all duration-300 ${
                    category === c.value
                      ? 'text-glow'
                      : 'text-whisper/50 hover:text-whisper/70'
                  }`}
                  style={{
                    background: category === c.value
                      ? 'color-mix(in srgb, var(--color-aurora) 12%, transparent)'
                      : 'color-mix(in srgb, var(--color-surface) 30%, transparent)',
                    border: category === c.value
                      ? '1px solid color-mix(in srgb, var(--color-aurora) 25%, transparent)'
                      : '1px solid color-mix(in srgb, var(--color-muted) 15%, transparent)',
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className={`flex-1 py-4 rounded-xl text-base transition-all duration-500 ${
              name.trim()
                ? 'btn-primary'
                : 'opacity-40 cursor-not-allowed'
            }`}
          >
            {isEditing ? '保存修改' : '添加活动'}
          </button>
          <button onClick={onClose} className="btn-ghost">
            取消
          </button>
        </div>
      </div>
    </div>
  );
}
