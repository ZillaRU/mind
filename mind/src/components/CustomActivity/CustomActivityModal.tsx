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
  const [category, setCategory] = useState<Activity['category']>(activity?.category || 'hands');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const isEditing = !!activity;

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
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
      guide: guide.trim() || '按照自己的节奏来就好。',
      duration: duration.trim() || '15-30 分钟',
      category,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in"
      onClick={onClose}
    >
      <div className="absolute inset-0"
        style={{ background: 'color-mix(in srgb, var(--color-midnight) 88%, transparent)', backdropFilter: 'blur(12px)' }}
      />

      <div
        className="relative w-full max-w-md mx-4 p-6 rounded-2xl animate-fade-in"
        onClick={e => e.stopPropagation()}
        style={{
          background: 'color-mix(in srgb, var(--color-deep) 95%, transparent)',
          border: '1px solid color-mix(in srgb, var(--color-muted) 20%, transparent)',
          boxShadow: '0 12px 48px -12px rgba(0,0,0,0.5)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-normal text-whisper/90">
            {isEditing ? '编辑活动' : '添加活动'}
          </h2>
          <button onClick={onClose} className="btn-text text-base">✕</button>
        </div>

        {/* Icon picker */}
        <div className="mb-5">
          <label className="block text-xs text-whisper/50 mb-2">图标</label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all duration-300"
              style={{
                background: 'color-mix(in srgb, var(--color-surface) 50%, transparent)',
                border: '1px solid color-mix(in srgb, var(--color-muted) 20%, transparent)',
              }}
            >
              {icon}
            </button>
            {showEmojiPicker && (
              <div className="flex flex-wrap gap-1.5 max-w-[280px] animate-fade-in">
                {emojiOptions.map(e => (
                  <button
                    key={e}
                    onClick={() => { setIcon(e); setShowEmojiPicker(false); }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-base transition-all duration-200"
                    style={{
                      background: icon === e
                        ? 'color-mix(in srgb, var(--color-aurora) 20%, transparent)'
                        : 'transparent',
                      border: icon === e
                        ? '1px solid color-mix(in srgb, var(--color-aurora) 30%, transparent)'
                        : '1px solid transparent',
                    }}
                  >
                    {e}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-xs text-whisper/50 mb-2">名称</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="比如：折纸、冥想、遛狗..."
            className="input-field"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-xs text-whisper/50 mb-2">简短描述</label>
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="一句话说明这个活动"
            className="input-field"
          />
        </div>

        {/* Guide */}
        <div className="mb-4">
          <label className="block text-xs text-whisper/50 mb-2">引导语</label>
          <textarea
            value={guide}
            onChange={e => setGuide(e.target.value)}
            placeholder="活动时的温馨提示..."
            className="input-field h-20 resize-none"
          />
        </div>

        {/* Duration + Category */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1">
            <label className="block text-xs text-whisper/50 mb-2">建议时长</label>
            <input
              type="text"
              value={duration}
              onChange={e => setDuration(e.target.value)}
              placeholder="15-30 分钟"
              className="input-field"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-whisper/50 mb-2">分类</label>
            <div className="relative">
              <select
                value={category}
                onChange={e => setCategory(e.target.value as Activity['category'])}
                className="input-field appearance-none cursor-pointer pr-10"
              >
                {categories.map(c => (
                  <option key={c.value} value={c.value} className="bg-deep text-whisper">
                    {c.label}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-whisper/50 pointer-events-none text-xs">
                ▾
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className={`flex-1 py-3.5 rounded-xl text-sm transition-all duration-500 ${
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
