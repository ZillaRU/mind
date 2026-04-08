import { useVibeScreen } from '../../hooks/useVibeScreen';
import type { VibeLine } from '../../hooks/useVibeScreen';
import { useTheme } from '../../hooks/useTheme';

function VibeLineView({ line }: { line: VibeLine }) {
  if (line.type === 'blank') {
    return <div className="h-3" />;
  }

  const colorClass = line.type === 'comment' || line.type === 'prose'
    ? 'text-glow/80'
    : line.type === 'code'
      ? 'text-whisper/70'
      : 'text-whisper/50';

  const proseClass = line.type === 'prose'
    ? 'italic text-warm/70'
    : '';

  return (
    <div
      className={`font-mono text-xs leading-relaxed ${colorClass} ${proseClass} transition-opacity duration-1000`}
      style={{ opacity: line.opacity }}
    >
      {line.text || '\u00A0'}
    </div>
  );
}

export default function VibeScreen() {
  const { lines } = useVibeScreen();
  const { theme } = useTheme();

  return (
    <div className="relative h-full overflow-hidden">
      {/* Subtle scan line effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
        }}
      />
      {/* Code lines container */}
      <div className="absolute bottom-0 left-0 right-0 p-6 pb-8 space-y-0.5 overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to top, black 30%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to top, black 30%, transparent 100%)',
        }}
      >
        {lines.map((line, i) => (
          <VibeLineView key={i} line={line} />
        ))}
      </div>

      {/* Top label */}
      <div className="absolute top-6 left-6 flex items-center gap-2 opacity-50">
        <div className="w-2 h-2 rounded-full bg-aurora animate-pulse" />
        <span className="font-mono text-xs text-glow/80">
          {theme.vibeLabel}
        </span>
      </div>
    </div>
  );
}
