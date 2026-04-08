import { themes } from '../../data/themes';
import { useTheme } from '../../hooks/useTheme';

export default function ThemePicker() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex gap-1.5 flex-wrap">
      {themes.map(t => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          title={`${t.name} — ${t.description}`}
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm
            transition-all duration-700"
          style={{
            backgroundColor: t.colors.aurora,
            transform: theme.id === t.id ? 'scale(1.25)' : 'scale(1)',
            opacity: theme.id === t.id ? 1 : 0.5,
            boxShadow: theme.id === t.id
              ? `0 0 0 2px var(--color-midnight), 0 0 0 3.5px ${t.colors.glow}, 0 0 16px ${t.colors.aurora}50`
              : 'none',
          }}
        >
          {t.icon}
        </button>
      ))}
    </div>
  );
}
