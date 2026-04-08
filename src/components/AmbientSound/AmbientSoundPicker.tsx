import { ambientSounds, type AmbientSound } from '../../data/sounds';

interface Props {
  currentSound: string;
  onSelect: (sound: AmbientSound) => void;
}

export default function AmbientSoundPicker({ currentSound, onSelect }: Props) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {ambientSounds.map(sound => (
        <button
          key={sound.id}
          onClick={() => onSelect(sound)}
          title={sound.description}
          className="w-9 h-9 rounded-full flex items-center justify-center text-base
            transition-all duration-500"
          style={{
            background: currentSound === sound.id
              ? 'linear-gradient(135deg, color-mix(in srgb, var(--color-aurora) 25%, transparent), color-mix(in srgb, var(--color-aurora) 10%, transparent))'
              : 'color-mix(in srgb, var(--color-surface) 40%, transparent)',
            border: currentSound === sound.id
              ? '1px solid color-mix(in srgb, var(--color-aurora) 40%, transparent)'
              : '1px solid color-mix(in srgb, var(--color-muted) 15%, transparent)',
            boxShadow: currentSound === sound.id
              ? `0 0 12px color-mix(in srgb, var(--color-aurora) 20%, transparent), 0 2px 8px -2px rgba(0,0,0,0.3)`
              : 'none',
            transform: currentSound === sound.id ? 'scale(1.15)' : 'scale(1)',
          }}
        >
          {sound.icon}
        </button>
      ))}
    </div>
  );
}
