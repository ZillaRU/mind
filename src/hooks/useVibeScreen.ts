import { useState, useEffect, useRef, useCallback } from 'react';
import { codeSnippets, proseSnippets } from '../data/snippets';

export interface VibeLine {
  text: string;
  type: 'code' | 'comment' | 'blank' | 'prose';
  opacity: number;
}

function getRandomSnippet() {
  return codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
}

function getRandomProse() {
  return proseSnippets[Math.floor(Math.random() * proseSnippets.length)];
}

export function useVibeScreen() {
  const [lines, setLines] = useState<VibeLine[]>([]);
  const snippetRef = useRef(getRandomSnippet());
  const lineIndexRef = useRef(0);
  const proseTimerRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const addLine = useCallback(() => {
    const snippet = snippetRef.current;
    
    // Every ~20 lines, insert a prose quote
    proseTimerRef.current++;
    if (proseTimerRef.current > 18 + Math.floor(Math.random() * 8)) {
      proseTimerRef.current = 0;
      const prose = getRandomProse();
      setLines(prev => {
        const next = [...prev, {
          text: `// ${prose.text} — ${prose.author}`,
          type: 'prose' as const,
          opacity: 0,
        }];
        // Keep max 60 lines visible
        return next.length > 60 ? next.slice(-60) : next;
      });
      return;
    }

    if (lineIndexRef.current >= snippet.lines.length) {
      // Pick a new snippet
      snippetRef.current = getRandomSnippet();
      lineIndexRef.current = 0;
      // Add a separator
      setLines(prev => {
        const next = [...prev, {
          text: '',
          type: 'blank' as const,
          opacity: 0,
        }, {
          text: `// ── ${snippetRef.current.filename} ──`,
          type: 'comment' as const,
          opacity: 0,
        }];
        return next.length > 60 ? next.slice(-60) : next;
      });
      return;
    }

    const line = snippet.lines[lineIndexRef.current];
    lineIndexRef.current++;

    const type = line.trimStart().startsWith('//') || line.trimStart().startsWith('#') || line.trimStart().startsWith('--')
      ? 'comment' as const
      : line.trim() === ''
        ? 'blank' as const
        : 'code' as const;

    setLines(prev => {
      const next = [...prev, { text: line, type, opacity: 0 }];
      return next.length > 60 ? next.slice(-60) : next;
    });
  }, []);

  useEffect(() => {
    // Start with the first snippet header
    setLines([{
      text: `// ── ${snippetRef.current.filename} ──`,
      type: 'comment',
      opacity: 0,
    }]);

    // Add lines at varying speeds to feel organic
    const scheduleNext = () => {
      const delay = 800 + Math.random() * 2200; // 0.8s - 3s per line
      intervalRef.current = setTimeout(() => {
        addLine();
        scheduleNext();
      }, delay);
    };

    scheduleNext();

    return () => {
      if (intervalRef.current !== null) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [addLine]);

  // Fade in new lines
  useEffect(() => {
    const fadeInterval = setInterval(() => {
      setLines(prev => prev.map(line => {
        if (line.opacity < 1) {
          return { ...line, opacity: Math.min(1, line.opacity + 0.05) };
        }
        return line;
      }));
    }, 50);

    return () => clearInterval(fadeInterval);
  }, []);

  return { lines };
}
