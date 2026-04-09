import { useState, useCallback } from 'react';
import { inspirations, type Inspiration } from '../../data/inspirations';

interface Props {
  onClose: () => void;
}

function getRandomInspiration(exclude?: Inspiration): Inspiration {
  const filtered = exclude ? inspirations.filter(i => i !== exclude) : inspirations;
  return filtered[Math.floor(Math.random() * filtered.length)];
}

function ArtCard({ item, onNext }: { item: Inspiration; onNext: () => void }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="w-full max-w-lg animate-fade-in">
      <div className="relative rounded-2xl overflow-hidden mb-6 aspect-[4/3]"
        style={{
          background: 'color-mix(in srgb, var(--color-surface) 40%, transparent)',
          border: '1px solid color-mix(in srgb, var(--color-muted) 15%, transparent)',
          boxShadow: '0 8px 32px -8px rgba(0,0,0,0.4)',
        }}
      >
        {!imgError ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl opacity-40">🖼️</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-midnight/80 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="text-xl font-normal text-white/95 mb-1">{item.title}</h3>
          <p className="text-sm text-white/70">{item.author} · {item.era}</p>
        </div>
      </div>
      <p className="text-sm text-whisper/70 leading-relaxed mb-6">{item.description}</p>
      <button onClick={onNext} className="btn-ghost">
        换一幅
      </button>
    </div>
  );
}

function PoetryCard({ item, onNext }: { item: Inspiration; onNext: () => void }) {
  return (
    <div className="w-full max-w-lg animate-fade-in">
      <div className="mb-6 p-6 rounded-2xl"
        style={{
          background: 'color-mix(in srgb, var(--color-surface) 40%, transparent)',
          border: '1px solid color-mix(in srgb, var(--color-muted) 15%, transparent)',
          boxShadow: '0 8px 32px -8px rgba(0,0,0,0.4)',
        }}
      >
        <h3 className="text-lg font-normal text-glow/90 mb-1">{item.title}</h3>
        <p className="text-xs font-mono mb-5" style={{ color: 'color-mix(in srgb, var(--color-aurora) 50%, transparent)' }}>
          {item.author} · {item.era}
        </p>
        <div className="text-base text-whisper/80 leading-loose whitespace-pre-line font-light"
          style={{ textShadow: '0 0 1px var(--color-whisper)' }}
        >
          {item.text}
        </div>
      </div>
      <p className="text-sm text-whisper/60 leading-relaxed mb-6">{item.description}</p>
      <button onClick={onNext} className="btn-ghost">
        换一首
      </button>
    </div>
  );
}

function MusicCard({ item, onNext }: { item: Inspiration; onNext: () => void }) {
  return (
    <div className="w-full max-w-lg animate-fade-in">
      <div className="mb-6 p-6 rounded-2xl text-center"
        style={{
          background: 'color-mix(in srgb, var(--color-surface) 40%, transparent)',
          border: '1px solid color-mix(in srgb, var(--color-muted) 15%, transparent)',
          boxShadow: '0 8px 32px -8px rgba(0,0,0,0.4)',
        }}
      >
        <div className="text-5xl mb-4" style={{ filter: 'drop-shadow(0 0 16px var(--color-aurora-dim))' }}>🎵</div>
        <h3 className="text-xl font-normal text-glow/90 mb-1">{item.title}</h3>
        <p className="text-xs font-mono mb-4" style={{ color: 'color-mix(in srgb, var(--color-aurora) 50%, transparent)' }}>
          {item.author} · {item.era}
        </p>
        <p className="text-sm text-whisper/70 leading-relaxed">{item.description}</p>
      </div>
      <p className="text-xs text-whisper/60 font-mono mb-6 text-center">{item.listenHint}</p>
      <div className="flex justify-center">
        <button onClick={onNext} className="btn-ghost">
          换一首
        </button>
      </div>
    </div>
  );
}

function ProseCard({ item, onNext }: { item: Inspiration; onNext: () => void }) {
  return (
    <div className="w-full max-w-lg animate-fade-in">
      <div className="mb-6 p-6 rounded-2xl"
        style={{
          background: 'color-mix(in srgb, var(--color-surface) 40%, transparent)',
          border: '1px solid color-mix(in srgb, var(--color-muted) 15%, transparent)',
          boxShadow: '0 8px 32px -8px rgba(0,0,0,0.4)',
        }}
      >
        <h3 className="text-lg font-normal text-glow/90 mb-1">{item.title}</h3>
        <p className="text-xs font-mono mb-5" style={{ color: 'color-mix(in srgb, var(--color-aurora) 50%, transparent)' }}>
          {item.author} · {item.era}
        </p>
        <div className="text-sm text-whisper/80 leading-loose whitespace-pre-line font-light"
          style={{ textShadow: '0 0 1px var(--color-whisper)' }}
        >
          {item.text}
        </div>
      </div>
      <p className="text-sm text-whisper/60 leading-relaxed mb-6">{item.description}</p>
      <button onClick={onNext} className="btn-ghost">
        换一篇
      </button>
    </div>
  );
}

export default function InspirationCard({ onClose }: Props) {
  const [current, setCurrent] = useState<Inspiration>(() => getRandomInspiration());
  const [key, setKey] = useState(0);

  const handleNext = useCallback(() => {
    setCurrent(getRandomInspiration(current));
    setKey(k => k + 1);
  }, [current]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in"
      onClick={onClose}
    >
      <div className="absolute inset-0"
        style={{ background: 'color-mix(in srgb, var(--color-midnight) 88%, transparent)', backdropFilter: 'blur(12px)' }}
      />

      <div
        className="relative w-full max-w-xl mx-4 px-4"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <div className="flex justify-end mb-4">
          <button onClick={onClose} className="btn-text text-base">
            ✕
          </button>
        </div>

        {/* Content */}
        <div key={key}>
          {current.type === 'art' && <ArtCard item={current} onNext={handleNext} />}
          {current.type === 'poetry' && <PoetryCard item={current} onNext={handleNext} />}
          {current.type === 'music' && <MusicCard item={current} onNext={handleNext} />}
          {current.type === 'prose' && <ProseCard item={current} onNext={handleNext} />}
        </div>

        {/* Bottom hint */}
        <p className="text-center text-xs text-whisper/35 mt-8 font-mono">
          所有内容均为公共领域，无版权风险
        </p>
      </div>
    </div>
  );
}
