import { useState } from 'react';
import { moodTags } from '../../data/moods';

interface Props {
  activityName: string;
  duration: string;
  onComplete: (entry: string, mood?: string) => void;
  onSkip: () => void;
}

export default function Journal({ activityName, duration, onComplete, onSkip }: Props) {
  const [text, setText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const handleSubmit = () => {
    onComplete(text, selectedMood || undefined);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full animate-fade-in px-6">
      {/* Completion message */}
      <div className="text-center mb-10">
        <div className="text-5xl mb-5" style={{ filter: 'drop-shadow(0 0 16px var(--color-aurora-dim))' }}>✨</div>
        <h2 className="text-2xl font-light text-whisper/90 mb-3">
          {activityName} 结束了
        </h2>
        <p className="text-sm text-whisper/60">
          你慢了 <span className="text-glow/80 font-mono">{duration}</span>
        </p>
      </div>

      {/* Mood selector */}
      <div className="w-full max-w-lg mb-6">
        <p className="text-xs text-whisper/60 mb-3 text-center tracking-wide">此刻的心情</p>
        <div className="flex gap-2 flex-wrap justify-center">
          {moodTags.map(mood => (
            <button
              key={mood.id}
              onClick={() => setSelectedMood(selectedMood === mood.id ? null : mood.id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm transition-all duration-400"
              style={{
                color: selectedMood === mood.id ? 'var(--color-glow)' : 'color-mix(in srgb, var(--color-whisper) 45%, transparent)',
                background: selectedMood === mood.id
                  ? 'linear-gradient(135deg, color-mix(in srgb, var(--color-aurora) 18%, transparent), color-mix(in srgb, var(--color-aurora) 6%, transparent))'
                  : 'color-mix(in srgb, var(--color-surface) 35%, transparent)',
                border: selectedMood === mood.id
                  ? '1px solid color-mix(in srgb, var(--color-aurora) 35%, transparent)'
                  : '1px solid color-mix(in srgb, var(--color-muted) 18%, transparent)',
                boxShadow: selectedMood === mood.id
                  ? '0 2px 12px -2px color-mix(in srgb, var(--color-aurora) 15%, transparent)'
                  : 'none',
                transform: selectedMood === mood.id ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              <span className="text-base">{mood.emoji}</span>
              <span className="text-xs">{mood.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Journal area */}
      <div className={`w-full max-w-lg transition-all duration-700 ${isExpanded ? 'max-h-[400px]' : 'max-h-[200px]'}`}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          onBlur={() => setIsExpanded(false)}
          placeholder="此刻有什么感受？写什么都好，也可以什么都不写。"
          className="input-field h-44 resize-none font-light leading-relaxed"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-4 mt-8">
        <button onClick={handleSubmit} className="btn-primary">
          保存感受
        </button>
        <button onClick={onSkip} className="btn-ghost">
          下次再写
        </button>
      </div>

      <p className="text-xs text-whisper/35 mt-8 font-mono">
        只存在你的浏览器里，不会上传
      </p>
    </div>
  );
}
