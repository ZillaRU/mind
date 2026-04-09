import { useState } from 'react';

interface Props {
  activityName: string;
  duration: string;
  onComplete: (entry: string) => void;
  onSkip: () => void;
}

export default function Journal({ activityName, duration, onComplete, onSkip }: Props) {
  const [text, setText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = () => {
    onComplete(text);
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
