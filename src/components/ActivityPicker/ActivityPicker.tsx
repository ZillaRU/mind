import { useState } from 'react';
import { activities, type Activity } from '../../data/activities';

interface Props {
  customActivities: Activity[];
  onAddCustom: () => void;
  onEditCustom: (activity: Activity) => void;
  onDeleteCustom: (activity: Activity) => void;
  onSelect: (activity: Activity) => void;
}

const categoryMeta: Record<string, { label: string; icon: string }> = {
  all: { label: '全部', icon: '✦' },
  hands: { label: '动手', icon: '🤲' },
  body: { label: '身体', icon: '🫧' },
  senses: { label: '感官', icon: '👁️' },
  creative: { label: '创造', icon: '✨' },
};

export default function ActivityPicker({
  customActivities,
  onAddCustom,
  onEditCustom,
  onDeleteCustom,
  onSelect,
}: Props) {
  const [selectedCategory, setSelectedCategory] = useState<Activity['category'] | 'all'>('all');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const allActivities = [...activities, ...customActivities];
  const categories: (Activity['category'] | 'all')[] = ['all', 'hands', 'body', 'senses', 'creative'];
  const filtered = selectedCategory === 'all'
    ? allActivities
    : allActivities.filter(a => a.category === selectedCategory);

  const isCustom = (id: string) => customActivities.some(a => a.id === id);

  return (
    <div className="animate-fade-in">
      {/* Category tabs — larger touch targets, more spacing */}
      <div className="flex gap-2.5 sm:gap-3 mb-8 sm:mb-10 flex-wrap justify-center">
        {categories.map(cat => {
          const active = selectedCategory === cat;
          const meta = categoryMeta[cat];
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm sm:text-[15px] font-light transition-all duration-500"
              style={{
                color: active ? 'var(--color-glow)' : 'color-mix(in srgb, var(--color-whisper) 45%, transparent)',
                background: active
                  ? 'linear-gradient(135deg, color-mix(in srgb, var(--color-aurora) 18%, transparent), color-mix(in srgb, var(--color-aurora) 6%, transparent))'
                  : 'color-mix(in srgb, var(--color-surface) 35%, transparent)',
                border: active
                  ? '1.5px solid color-mix(in srgb, var(--color-aurora) 35%, transparent)'
                  : '1.5px solid color-mix(in srgb, var(--color-muted) 18%, transparent)',
                boxShadow: active
                  ? '0 2px 16px -2px color-mix(in srgb, var(--color-aurora) 15%, transparent)'
                  : 'none',
              }}
            >
              <span className="text-sm sm:text-base">{meta.icon}</span>
              <span>{meta.label}</span>
            </button>
          );
        })}
      </div>

      {/* Activity grid — uniform card height */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-5">
        {filtered.map((activity, index) => (
          <button
            key={activity.id}
            onClick={() => onSelect(activity)}
            onMouseEnter={() => setHoveredId(activity.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="card-hover relative rounded-2xl text-center group animate-fade-in"
            style={{
              background: 'color-mix(in srgb, var(--color-surface) 30%, transparent)',
              border: '1px solid color-mix(in srgb, var(--color-muted) 15%, transparent)',
              animationDelay: `${index * 50}ms`,
              // Uniform height: padding + min-height
              minHeight: '160px',
              padding: '1.25rem 0.75rem',
            }}
          >
            {/* Custom activity menu */}
            {isCustom(activity.id) && (
              <div className="absolute top-2.5 right-2.5 z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpenId(menuOpenId === activity.id ? null : activity.id);
                  }}
                  className="w-7 h-7 rounded-full flex items-center justify-center
                    text-whisper/60 hover:text-whisper/80 hover:bg-surface/60
                    transition-all duration-300 text-xs"
                >
                  ···
                </button>
                {menuOpenId === activity.id && (
                  <div
                    className="absolute right-0 top-8 w-24 rounded-xl overflow-hidden
                      border shadow-xl z-20"
                    style={{
                      background: 'var(--color-deep)',
                      borderColor: 'color-mix(in srgb, var(--color-muted) 25%, transparent)',
                      boxShadow: '0 8px 32px -8px rgba(0,0,0,0.5)',
                    }}
                  >
                    <button
                      onClick={(e) => { e.stopPropagation(); onEditCustom(activity); setMenuOpenId(null); }}
                      className="w-full px-3 py-2.5 text-xs text-whisper/70 hover:text-glow hover:bg-surface/50
                        transition-colors text-left"
                    >
                      编辑
                    </button>
                    <div className="divider" />
                    <button
                      onClick={(e) => { e.stopPropagation(); onDeleteCustom(activity); setMenuOpenId(null); }}
                      className="w-full px-3 py-2.5 text-xs text-whisper/50 hover:text-ember hover:bg-surface/50
                        transition-colors text-left"
                    >
                      删除
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Hover glow */}
            <div
              className="absolute inset-0 rounded-2xl transition-opacity duration-500 pointer-events-none"
              style={{
                opacity: hoveredId === activity.id ? 1 : 0,
                background: 'radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--color-aurora) 8%, transparent), transparent 70%)',
              }}
            />

            <div className="relative flex flex-col items-center justify-center h-full gap-3">
              <span className="text-4xl sm:text-5xl block group-hover:scale-110 transition-transform duration-500">
                {activity.icon}
              </span>
              <div>
                <h3 className="text-sm sm:text-base font-light text-whisper/80 group-hover:text-glow transition-colors duration-500 mb-1">
                  {activity.name}
                </h3>
                <p className="text-xs font-mono"
                  style={{ color: 'color-mix(in srgb, var(--color-aurora) 40%, transparent)' }}
                >
                  {activity.duration}
                </p>
              </div>
            </div>
          </button>
        ))}

        {/* Add custom activity card — same uniform height */}
        <button
          onClick={onAddCustom}
          className="card-hover rounded-2xl flex flex-col items-center justify-center animate-fade-in group"
          style={{
            border: '2px dashed color-mix(in srgb, var(--color-muted) 25%, transparent)',
            minHeight: '160px',
            animationDelay: `${filtered.length * 50}ms`,
          }}
        >
          <span className="text-3xl text-whisper/50 group-hover:text-aurora/60 transition-all duration-500 mb-3 group-hover:scale-110">
            +
          </span>
          <span className="text-sm text-whisper/60 group-hover:text-whisper/70 transition-colors duration-500 font-light">
            添加你的活动
          </span>
        </button>
      </div>
    </div>
  );
}
