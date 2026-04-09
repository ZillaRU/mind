import { useGentleTimer } from '../../hooks/useGentleTimer';
import type { ActivityExperience } from '../../data/experiences';
import ExperienceRenderer from '../Experience/ExperienceRenderer';

interface Props {
  activityName: string;
  activityIcon: string;
  guide: string;
  experience: ActivityExperience | null;
  onFinish: (duration: string) => void;
}

export default function GentleTimer({ activityName, activityIcon, guide, experience, onFinish }: Props) {
  const { isRunning, formatted, toggle, reset } = useGentleTimer();
  const hasExperience = experience && experience.type !== 'default';
  const hasOwnControls = experience?.type === 'metronome';
  const isMiniGame = experience?.type === 'mini-game';

  return (
    <div className="h-full flex flex-col animate-fade-in">
      {isMiniGame ? (
        /* Full-screen game mode */
        <div className="flex-1 relative overflow-hidden">
          <ExperienceRenderer experience={experience} />
          {/* Floating controls */}
          <div
            className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-6 pt-8 z-10"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.25), transparent)' }}
          >
            <div className="flex gap-4 items-center">
              <button onClick={toggle} className="btn-ghost text-xs">
                {isRunning ? '暂停' : '开始'}
              </button>
              {isRunning && (
                <span className="font-mono text-sm text-white/50 tracking-wider">{formatted}</span>
              )}
              {formatted !== '0:00' && (
                <button
                  onClick={() => { const dur = formatted; reset(); onFinish(dur); }}
                  className="btn-ghost text-xs"
                >
                  结束
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
      <>
      /* Normal layout */
      <div className="flex-1 flex flex-col items-center justify-center px-10 py-16">
        {/* Activity icon + name */}
        <div className={`text-center ${hasExperience ? 'mb-12' : 'mb-16'}`}>
          <div className={`mb-6 ${hasExperience ? 'text-5xl' : 'text-7xl'} ${isRunning ? 'animate-breathe' : 'animate-float'}`}
            style={{ filter: 'drop-shadow(0 0 16px var(--color-aurora-dim))' }}
          >
            {activityIcon}
          </div>
          <h2 className={`font-light text-whisper/90 tracking-wide ${hasExperience ? 'text-xl' : 'text-2xl'}`}>
            {activityName}
          </h2>
          {!hasExperience && (
            <p className="text-sm text-warm/70 italic max-w-sm text-center mt-8 leading-loose font-light">
              {guide}
            </p>
          )}
        </div>

        {/* Experience content */}
        {hasExperience && (
          <div className="flex items-center justify-center w-full">
            <ExperienceRenderer experience={experience} />
          </div>
        )}

        {/* Big timer when no experience */}
        {!hasExperience && (
          <div className="relative mt-4">
            <div
              className="absolute rounded-full transition-all duration-[4000ms]"
              style={{
                width: '180px',
                height: '180px',
                top: '-12px',
                left: '-12px',
                border: isRunning ? '1.5px solid var(--color-aurora)' : '1px solid var(--color-muted)',
                opacity: isRunning ? 0.4 : 0.15,
              }}
            />
            <div className="w-36 h-36 rounded-full flex items-center justify-center"
              style={{
                background: 'radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--color-surface) 80%, transparent), color-mix(in srgb, var(--color-deep) 60%, transparent))',
                border: '1px solid color-mix(in srgb, var(--color-muted) 25%, transparent)',
              }}
            >
              <span
                className={`font-mono text-4xl font-extralight tracking-widest transition-all duration-1000 ${isRunning ? 'text-glow' : 'text-whisper/70'}`}
                style={isRunning ? { textShadow: '0 0 20px var(--color-aurora-dim)' } : {}}
              >
                {formatted}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Controls — fixed at bottom */}
      <div className="flex flex-col items-center pb-12 pt-6">
        <div className="flex gap-4 items-center">
          {!hasOwnControls && (
            <button
              onClick={toggle}
              className={`transition-all duration-500 ${isRunning ? 'btn-ghost' : 'btn-primary animate-pulse-glow'}`}
            >
              {isRunning ? '暂停一下' : '开始'}
            </button>
          )}

          {hasExperience && !hasOwnControls && (
            <span className="font-mono text-sm text-whisper/50 tracking-wider">
              {formatted}
            </span>
          )}

          {!hasOwnControls && formatted !== '0:00' && (
            <button
              onClick={() => { const dur = formatted; reset(); onFinish(dur); }}
              className="btn-ghost"
            >
              结束
            </button>
          )}

          {hasOwnControls && formatted !== '0:00' && (
            <button
              onClick={() => { const dur = formatted; reset(); onFinish(dur); }}
              className="btn-ghost"
            >
              结束
            </button>
          )}
        </div>

        <p className="text-xs text-whisper/55 mt-6 font-mono animate-soft-pulse">
          {isRunning ? '没有倒计时，只有此刻' : '准备好了就点开始'}
        </p>
      </div>
      </>
      )}
    </div>
  );
}
