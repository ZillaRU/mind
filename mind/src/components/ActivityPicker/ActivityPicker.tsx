import { useState } from 'react';
import { activities, categoryLabels, type Activity } from '../../data/activities';

interface Props {
  customActivities: Activity[];
  onAddCustom: () => void;
  onEditCustom: (activity: Activity) => void;
  onDeleteCustom: (activity: Activity) => void;
  onSelect: (activity: Activity) => void;
}

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
      {/* Category pills */}
      <div className="flex gap-4 mb-14 flex-wrap justify-center">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-7 py-2.5 rounded-full text-sm font-light transition-all duration-500 ${
              selectedCategory === cat
                ? 'text-glow'
                : 'text-whisper/50 hover:text-whisper/80'
            }`}
            style={{
              background: selectedCategory === cat
                ? 'linear-gradient(135deg, color-mix(in srgb, var(--color-aurora) 20%, transparent), color-mix(in srgb, var(--color-aurora) 8%, transparent))'
                : 'color-mix(in srgb, var(--color-surface) 40%, transparent)',
              border: selectedCategory === cat
                ? '1px solid color-mix(in srgb, var(--color-aurora) 35%, transparent)'
                : '1px solid color-mix(in srgb, var(--color-muted) 20%, transparent)',
              boxShadow: selectedCategory === cat
                ? '0 2px 12px -2px color-mix(in srgb, var(--color-aurora) 15%, transparent)'
                : 'none',
            }}
          >
            {cat === 'all' ? '全部' : categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* Activity grid — generous breathing room */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-7 sm:gap-8">
        {filtered.map((activity, index) => (
          <button
            key={activity.id}
            onClick={() => onSelect(activity)}
            onMouseEnter={() => setHoveredId(activity.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="card-hover relative py-10 px-5 rounded-2xl text-center group animate-fade-in"
            style={{
              background: 'color-mix(in srgb, var(--color-surface) 30%, transparent)',
              border: '1px solid color-mix(in srgb, var(--color-muted) 15%, transparent)',
              animationDelay: `${index * 60}ms`,
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
                  className="w-6 h-6 rounded-full flex items-center justify-center
                    text-whisper/40 hover:text-whisper/80 hover:bg-surface/60
                    transition-all duration-300 text-xs"
                >
                  ···
                </button>
                {menuOpenId === activity.id && (
                  <div
                    className="absolute right-0 top-7 w-24 rounded-xl overflow-hidden
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

            <div className="relative flex flex-col items-center">
              <span className="text-5xl mb-5 block group-hover:scale-110 transition-transform duration-500"
                style={{ filter: 'drop-shadow(0 0 8px transparent)' }}
              >
                {activity.icon}
              </span>
              <h3 className="text-base font-light text-whisper/80 group-hover:text-glow transition-colors duration-500 mb-2">
                {activity.name}
              </h3>
              <p className="text-xs font-mono"
                style={{ color: 'color-mix(in srgb, var(--color-aurora) 40%, transparent)' }}
              >
                {activity.duration}
              </p>
            </div>
          </button>
        ))}

        {/* Add custom activity card */}
        <button
          onClick={onAddCustom}
          className="card-hover py-10 px-5 rounded-2xl flex flex-col items-center justify-center min-h-[180px] animate-fade-in group"
          style={{
            border: '2px dashed color-mix(in srgb, var(--color-muted) 25%, transparent)',
            animationDelay: `${filtered.length * 60}ms`,
          }}
        >
          <span className="text-4xl text-whisper/30 group-hover:text-aurora/60 transition-all duration-500 mb-4 group-hover:scale-110">
            +
          </span>
          <span className="text-sm text-whisper/40 group-hover:text-whisper/70 transition-colors duration-500 font-light">
            添加你的活动
          </span>
        </button>
      </div>
    </div>
  );
}
