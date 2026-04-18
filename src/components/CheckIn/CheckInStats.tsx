import { useMemo } from 'react';
import type { JournalEntry } from '../../App';
import { getMoodTag } from '../../data/moods';

interface Props {
  journal: JournalEntry[];
}

export default function CheckInStats({ journal }: Props) {
  const stats = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Filter entries by time range
    const last7Days = journal.filter(e => new Date(e.timestamp) >= weekAgo);
    const last30Days = journal.filter(e => new Date(e.timestamp) >= monthAgo);
    
    // Calculate total time
    const parseDuration = (dur: string): number => {
      const match = dur.match(/(\d+):(\d+)/);
      if (match) {
        return parseInt(match[1]) * 60 + parseInt(match[2]);
      }
      const minMatch = dur.match(/(\d+)\s*分钟/);
      if (minMatch) return parseInt(minMatch[1]);
      return 0;
    };

    const totalMinutes7 = last7Days.reduce((acc, e) => acc + parseDuration(e.duration), 0);
    const totalMinutes30 = last30Days.reduce((acc, e) => acc + parseDuration(e.duration), 0);

    // Streak calculation (consecutive days)
    let currentStreak = 0;
    const checkDate = new Date(today);
    while (true) {
      const dateStr = checkDate.toDateString();
      const hasEntry = journal.some(e => new Date(e.timestamp).toDateString() === dateStr);
      if (hasEntry) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Mood distribution
    const moodCounts: Record<string, number> = {};
    journal.forEach(e => {
      if (e.mood) {
        moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
      }
    });

    // Most used activities
    const activityCounts: Record<string, { name: string; count: number }> = {};
    journal.forEach(e => {
      if (!activityCounts[e.activity]) {
        activityCounts[e.activity] = { name: e.activity, count: 0 };
      }
      activityCounts[e.activity].count++;
    });
    const topActivities = Object.values(activityCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    // Last 7 days heatmap data
    const last7DaysData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today.getTime() - (6 - i) * 24 * 60 * 60 * 1000);
      const dateStr = date.toDateString();
      const dayEntries = journal.filter(e => new Date(e.timestamp).toDateString() === dateStr);
      return {
        date,
        count: dayEntries.length,
        label: ['日', '一', '二', '三', '四', '五', '六'][date.getDay()],
        shortDate: `${date.getMonth() + 1}/${date.getDate()}`,
      };
    });

    return {
      total7: last7Days.length,
      total30: last30Days.length,
      totalMinutes7,
      totalMinutes30,
      currentStreak,
      moodCounts,
      topActivities,
      last7DaysData,
    };
  }, [journal]);

  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes} 分钟`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours} 小时 ${mins} 分钟` : `${hours} 小时`;
  };

  // Find dominant mood
  const dominantMood = useMemo(() => {
    const entries = Object.entries(stats.moodCounts);
    if (entries.length === 0) return null;
    const [moodId, count] = entries.sort((a, b) => b[1] - a[1])[0];
    const mood = getMoodTag(moodId);
    return { mood, count };
  }, [stats.moodCounts]);

  return (
    <div className="animate-fade-in">
      <h3 className="text-sm font-normal text-whisper/80 mb-5">慢时光统计</h3>
      
      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="p-3 rounded-xl" style={{ background: 'color-mix(in srgb, var(--color-surface) 30%, transparent)' }}>
          <div className="text-2xl font-light text-glow/80">{stats.total7}</div>
          <div className="text-xs text-whisper/50 mt-1">本周打卡</div>
        </div>
        <div className="p-3 rounded-xl" style={{ background: 'color-mix(in srgb, var(--color-surface) 30%, transparent)' }}>
          <div className="text-2xl font-light text-glow/80">{stats.currentStreak}</div>
          <div className="text-xs text-whisper/50 mt-1">连续天数</div>
        </div>
      </div>

      {/* Time summary */}
      <div className="mb-5 p-3 rounded-xl" style={{ background: 'color-mix(in srgb, var(--color-surface) 30%, transparent)' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-whisper/60">本周慢时光</span>
          <span className="text-sm text-glow/70">{formatTime(stats.totalMinutes7)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-whisper/60">本月累计</span>
          <span className="text-sm text-whisper/70">{formatTime(stats.totalMinutes30)}</span>
        </div>
      </div>

      {/* Week heatmap */}
      <div className="mb-5">
        <p className="text-xs text-whisper/60 mb-2">最近 7 天</p>
        <div className="flex gap-1.5 justify-between">
          {stats.last7DaysData.map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-all duration-500"
                style={{
                  background: day.count > 0
                    ? `color-mix(in srgb, var(--color-aurora) ${Math.min(100, day.count * 25)}%, transparent)`
                    : 'color-mix(in srgb, var(--color-surface) 20%, transparent)',
                  boxShadow: day.count > 0
                    ? `0 0 ${8 + day.count * 4}px color-mix(in srgb, var(--color-aurora) ${20 + day.count * 10}%, transparent)`
                    : 'none',
                }}
              >
                {day.count > 0 && (
                  <span className="text-whisper/80">{day.count}</span>
                )}
              </div>
              <span className="text-xs text-whisper/40">{day.shortDate}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top activities */}
      {stats.topActivities.length > 0 && (
        <div className="mb-5">
          <p className="text-xs text-whisper/60 mb-2">最常做的事</p>
          <div className="space-y-1.5">
            {stats.topActivities.map((a, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="text-whisper/70">{a.name}</span>
                <span className="text-whisper/40 font-mono">{a.count} 次</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dominant mood */}
      {dominantMood && dominantMood.mood && (
        <div className="p-3 rounded-xl" style={{ background: 'color-mix(in srgb, var(--color-surface) 30%, transparent)' }}>
          <p className="text-xs text-whisper/60 mb-1.5">最常见的心情</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{dominantMood.mood.emoji}</span>
            <div>
              <div className="text-sm text-whisper/80">{dominantMood.mood.label}</div>
              <div className="text-xs text-whisper/40">{dominantMood.count} 次</div>
            </div>
          </div>
        </div>
      )}

      {journal.length === 0 && (
        <p className="text-xs text-whisper/50 text-center py-4">
          还没有记录，开始你的第一次慢时光吧 ✨
        </p>
      )}
    </div>
  );
}
