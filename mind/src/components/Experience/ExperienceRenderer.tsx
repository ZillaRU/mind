import { useState, useEffect, useRef, useMemo } from 'react';
import type { ActivityExperience, PoseStep, GuideStep, Prompt } from '../../data/experiences';
import PuddleStomp from '../MiniGames/PuddleStomp';
import FoggyWindow from '../MiniGames/FoggyWindow';
import KiteFly from '../MiniGames/KiteFly';

// ===== Utilities =====
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

// Random visual style for each card — makes every appearance feel different
function randomCardStyle() {
  const sizeVariant = Math.random();
  const spacingVariant = Math.random();
  return {
    titleSize: sizeVariant < 0.3 ? 'text-lg' : sizeVariant < 0.7 ? 'text-xl' : 'text-2xl',
    lineSize: sizeVariant < 0.4 ? 'text-sm' : 'text-base',
    lineSpacing: spacingVariant < 0.3 ? 'space-y-2' : spacingVariant < 0.7 ? 'space-y-3' : 'space-y-4',
    lineOpacity: 0.5 + Math.random() * 0.3, // 0.5 - 0.8
    emojiSize: Math.random() < 0.3 ? 'text-4xl' : Math.random() < 0.6 ? 'text-5xl' : 'text-6xl',
    stagger: 300 + Math.random() * 500, // 300-800ms between lines
  };
}

// ===== Pose Cycle =====
function PoseCycle({ poses }: { poses: PoseStep[] }) {
  const [fadeKey, setFadeKey] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Shuffle on mount, cycle through shuffled order
  const shuffled = useMemo(() => shuffle(poses), [poses]);
  const [currentIndex, setCurrentIndex] = useState(() => Math.floor(Math.random() * shuffled.length));
  const currentPose = shuffled[currentIndex];

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setFadeKey(k => k + 1);
      setCurrentIndex(prev => (prev + 1) % shuffled.length);
    }, randomBetween(15000, 35000));
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [currentIndex, shuffled.length]);

  const style = useMemo(() => randomCardStyle(), [fadeKey]);

  return (
    <div className="w-full max-w-md animate-fade-in" key={fadeKey}>
      {currentPose.art && (
        <pre
          className="text-center text-sm text-aurora/60 font-mono mb-6 leading-relaxed opacity-60 select-none"
          style={{ textShadow: '0 0 20px var(--color-aurora-dim)' }}
        >
          {currentPose.art}
        </pre>
      )}

      <h3 className={`${style.titleSize} font-light text-glow/80 text-center mb-6 tracking-wide`}>
        {currentPose.emoji} {currentPose.name}
      </h3>

      <div className={`${style.lineSpacing} text-center`}>
        {currentPose.lines.map((line, i) => (
          <p
            key={i}
            className={`${style.lineSize} leading-relaxed animate-fade-in`}
            style={{
              animationDelay: `${i * style.stagger}ms`,
              opacity: style.lineOpacity,
            }}
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

// ===== Breathe Guide =====
function BreatheGuide({ inhale, hold, exhale }: { inhale: number; hold: number; exhale: number }) {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [progress, setProgress] = useState(0);
  const [cycles, setCycles] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const phaseDurations = { inhale, hold, exhale };

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        const duration = phaseDurations[phase];
        const next = prev + 1 / duration;
        if (next >= 1) {
          setPhase(p => {
            if (p === 'inhale') return 'hold';
            if (p === 'hold') return 'exhale';
            setCycles(c => c + 1);
            return 'inhale';
          });
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [phase, phaseDurations]);

  const getScale = () => {
    if (phase === 'inhale') return 0.7 + progress * 0.5;
    if (phase === 'hold') return 1.2;
    return 1.2 - progress * 0.5;
  };

  // Random breath poetry per cycle
  const breathPoems = useMemo(() => shuffle([
    { inhale: '空气进来的时候，别想别的', hold: '停在这里，不进不出', exhale: '放掉它，连同今天那些不需要的' },
    { inhale: '吸进来的是新的', hold: '留住它一会儿', exhale: '呼出去的是旧的……大概吧' },
    { inhale: '慢慢来，不赶的', hold: '这里很安全', exhale: '你比刚才轻了一点点' },
    { inhale: '像闻一朵花', hold: '它还在', exhale: '像吹灭一根蜡烛……轻轻的' },
    { inhale: '你值得被填满', hold: '你值得被留住', exhale: '你也值得被放空' },
    { inhale: '吸气的时候什么都不用做', hold: '保持也不需要用力', exhale: '呼气的时候，允许自己松开' },
    { inhale: '这一口空气', hold: '可能路过了一片森林', exhale: '也可能只是你房间的空气……都行' },
    { inhale: '深一点', hold: '再深一点', exhale: '……够了，不要勉强' },
  ]), []);

  const currentPoem = breathPoems[cycles % breathPoems.length];

  return (
    <div className="w-full max-w-sm animate-fade-in flex flex-col items-center">
      <div className="relative w-48 h-48 flex items-center justify-center mb-8">
        <div
          className="absolute inset-0 rounded-full transition-all duration-1000 ease-in-out"
          style={{
            border: `1.5px solid color-mix(in srgb, var(--color-aurora) ${20 + progress * 30}%, transparent)`,
            transform: `scale(${getScale() * 1.15})`,
            boxShadow: `0 0 ${20 + progress * 30}px color-mix(in srgb, var(--color-aurora) ${10 + progress * 15}%, transparent)`,
          }}
        />
        <div
          className="w-32 h-32 rounded-full flex items-center justify-center transition-all duration-1000 ease-in-out"
          style={{
            background: `radial-gradient(circle, color-mix(in srgb, var(--color-aurora) ${15 + getScale() * 15}%, transparent), color-mix(in srgb, var(--color-surface) 60%, transparent))`,
            transform: `scale(${getScale()})`,
          }}
        >
          <span className="text-3xl">
            {phase === 'inhale' && '🌬️'}
            {phase === 'hold' && '🤍'}
            {phase === 'exhale' && '☁️'}
          </span>
        </div>
      </div>

      <h3 className="text-lg font-light text-glow/80 mb-3">
        {phase === 'inhale' && '吸气～'}
        {phase === 'hold' && '保持～'}
        {phase === 'exhale' && '呼气～'}
      </h3>
      <p className="text-sm text-whisper/50 text-center leading-relaxed max-w-xs">
        {currentPoem[phase]}
      </p>
    </div>
  );
}

// ===== Step Guide =====
function StepGuide({ steps }: { steps: GuideStep[] }) {
  const [fadeKey, setFadeKey] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const shuffled = useMemo(() => shuffle(steps), [steps]);
  const [currentIndex, setCurrentIndex] = useState(() => Math.floor(Math.random() * shuffled.length));
  const currentStep = shuffled[currentIndex];

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setFadeKey(k => k + 1);
      setCurrentIndex(prev => (prev + 1) % shuffled.length);
    }, randomBetween(18000, 40000));
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [currentIndex, shuffled.length]);

  const style = useMemo(() => randomCardStyle(), [fadeKey]);

  return (
    <div className="w-full max-w-md animate-fade-in" key={fadeKey}>
      <div className="text-center mb-6">
        <span
          className={style.emojiSize}
          style={{ filter: 'drop-shadow(0 0 16px var(--color-aurora-dim))' }}
        >
          {currentStep.emoji}
        </span>
      </div>

      <h3 className={`${style.titleSize} font-light text-glow/80 text-center mb-6 tracking-wide`}>
        {currentStep.title}
      </h3>

      <div className={`${style.lineSpacing} text-center`}>
        {currentStep.lines.map((line, i) => (
          <p
            key={i}
            className={`${style.lineSize} leading-relaxed animate-fade-in`}
            style={{
              animationDelay: `${i * style.stagger}ms`,
              opacity: style.lineOpacity,
            }}
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

// ===== Prompt Cycle =====
function PromptCycle({ prompts }: { prompts: Prompt[] }) {
  const [fadeKey, setFadeKey] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const shuffled = useMemo(() => shuffle(prompts), [prompts]);
  const [currentIndex, setCurrentIndex] = useState(() => Math.floor(Math.random() * shuffled.length));
  const currentPrompt = shuffled[currentIndex];

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setFadeKey(k => k + 1);
      setCurrentIndex(prev => (prev + 1) % shuffled.length);
    }, randomBetween(15000, 35000));
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [currentIndex, shuffled.length]);

  const style = useMemo(() => randomCardStyle(), [fadeKey]);

  return (
    <div className="w-full max-w-md animate-fade-in" key={fadeKey}>
      {currentPrompt.emoji && (
        <div className="text-center mb-8">
          <span
            className={style.emojiSize}
            style={{ filter: 'drop-shadow(0 0 16px var(--color-aurora-dim))' }}
          >
            {currentPrompt.emoji}
          </span>
        </div>
      )}

      <div className={`${style.lineSpacing} text-center`}>
        {currentPrompt.lines.map((line, i) => (
          <p
            key={i}
            className={`leading-relaxed animate-fade-in ${
              i === 0 ? `${style.lineSize} font-light` : 'text-sm'
            }`}
            style={{
              animationDelay: `${i * style.stagger}ms`,
              opacity: i === 0 ? 0.8 : style.lineOpacity,
            }}
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

// ===== Metronome =====
function Metronome({ bpm }: { bpm: number }) {
  const [beat, setBeat] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const ms = 60000 / bpm;

  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setBeat(b => (b + 1) % 4);
      setElapsed(e => e + 1);
    }, ms);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, bpm, ms]);

  const pianoWhispers = useMemo(() => shuffle([
    '先慢练，让手指记住每一个音',
    '弹错了也没关系，钢琴不会生气的',
    '这个音……再轻一点试试',
    '你听，它在回响呢',
    '不用完美，音乐本来就不完美的',
    '手指在找路，让它慢慢找',
    '这一段，可以弹一百遍的',
    '弹着弹着，你会忘了自己在弹',
    '那就是对了',
    '有些曲子需要一辈子',
    '你有一辈子的',
    '不急',
    '停一下，听听刚才那个音',
    '它还在房间里呢',
    '像一只很小的鸟',
    '飞了一下，又停了',
  ]), []);

  const currentWhisper = pianoWhispers[Math.min(Math.floor(elapsed / 16), pianoWhispers.length - 1)];

  return (
    <div className="w-full max-w-sm animate-fade-in flex flex-col items-center">
      <p className="text-xs font-mono text-whisper/30 mb-8">
        {bpm} BPM
      </p>

      <div className="flex gap-5 mb-10">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className="w-5 h-5 rounded-full transition-all duration-150"
            style={{
              background: isRunning && beat === i
                ? 'var(--color-aurora)'
                : 'color-mix(in srgb, var(--color-muted) 30%, transparent)',
              boxShadow: isRunning && beat === i
                ? '0 0 16px var(--color-aurora), 0 0 32px var(--color-aurora-dim)'
                : 'none',
              transform: isRunning && beat === i ? 'scale(1.4)' : 'scale(1)',
            }}
          />
        ))}
      </div>

      <div className="text-center mb-6">
        <p className="text-sm text-whisper/50 leading-relaxed">
          {currentWhisper}
        </p>
      </div>

      <button
        onClick={() => setIsRunning(!isRunning)}
        className={isRunning ? 'btn-ghost' : 'btn-primary'}
      >
        {isRunning ? '⏸ 暂停' : '▶ 开始'}
      </button>
    </div>
  );
}

// ===== Main =====
interface Props {
  experience: ActivityExperience;
}

export default function ExperienceRenderer({ experience }: Props) {
  switch (experience.type) {
    case 'pose-cycle':
      return experience.poses ? <PoseCycle poses={experience.poses} /> : null;
    case 'breathe-guide':
      return (
        <BreatheGuide
          inhale={experience.inhaleSeconds || 4}
          hold={experience.holdSeconds || 4}
          exhale={experience.exhaleSeconds || 6}
        />
      );
    case 'step-guide':
      return experience.steps ? <StepGuide steps={experience.steps} /> : null;
    case 'prompt-cycle':
      return experience.prompts ? <PromptCycle prompts={experience.prompts} /> : null;
    case 'metronome':
      return <Metronome bpm={experience.bpm || 60} />;
    case 'mini-game':
      switch (experience.gameId) {
        case 'puddle': return <PuddleStomp />;
        case 'foggy': return <FoggyWindow />;
        case 'kite': return <KiteFly />;
        default: return null;
      }
    default:
      return null;
  }
}
