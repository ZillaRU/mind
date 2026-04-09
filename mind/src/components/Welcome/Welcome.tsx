import { useTheme } from '../../hooks/useTheme';

interface Props {
  onEnter: () => void;
}

export default function Welcome({ onEnter }: Props) {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col items-center justify-center h-full animate-fade-in">
      {/* Logo / Title */}
      <div className="mb-14 text-center">
        <h1 className="text-7xl font-extralight text-whisper/90 mb-4 tracking-[0.4em]"
          style={{ textShadow: '0 0 60px var(--color-aurora-dim)' }}
        >
          慢
        </h1>
        <p className="text-sm font-mono text-glow/50 tracking-[0.6em] uppercase">
          mind
        </p>
      </div>

      {/* Tagline */}
      <p className="text-base text-whisper/60 max-w-md text-center leading-relaxed mb-14 font-light">
        {theme.copy.tagline}
      </p>

      {/* Enter button */}
      <button
        onClick={onEnter}
        className="btn-primary animate-pulse-glow text-base px-12 py-4"
      >
        <span className="relative z-10">{theme.copy.enterButton}</span>
      </button>

      {/* Bottom hint */}
      <div className="absolute bottom-8 text-center">
        <p className="text-xs text-whisper/35 font-mono leading-relaxed">
          {theme.copy.bottomHint}
        </p>
      </div>
    </div>
  );
}
