import { useState, useCallback } from 'react';
import type { Activity } from './data/activities';
import type { AmbientSound } from './data/sounds';
import ParticleBackground from './components/ParticleBackground';
import VibeScreen from './components/VibeScreen/VibeScreen';
import Welcome from './components/Welcome/Welcome';
import ActivityPicker from './components/ActivityPicker/ActivityPicker';
import GentleTimer from './components/GentleTimer/GentleTimer';
import Journal from './components/Journal/Journal';
import AmbientSoundPicker from './components/AmbientSound/AmbientSoundPicker';
import CustomActivityModal from './components/CustomActivity/CustomActivityModal';
import InspirationCard from './components/Inspiration/InspirationCard';
import ThemePicker from './components/ThemePicker/ThemePicker';
import { useAmbientSound } from './hooks/useAmbientSound';
import { getExperience } from './data/experiences';

type Phase = 'welcome' | 'pick' | 'timer' | 'journal';

interface JournalEntry {
  activity: string;
  duration: string;
  entry: string;
  timestamp: number;
}

function loadJournal(): JournalEntry[] {
  try {
    const data = localStorage.getItem('mind-journal');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveJournal(entries: JournalEntry[]) {
  localStorage.setItem('mind-journal', JSON.stringify(entries));
}

function loadCustomActivities(): Activity[] {
  try {
    const data = localStorage.getItem('mind-custom-activities');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveCustomActivities(activities: Activity[]) {
  localStorage.setItem('mind-custom-activities', JSON.stringify(activities));
}

export default function App() {
  const [phase, setPhase] = useState<Phase>('welcome');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [currentSound, setCurrentSound] = useState('silence');
  const [journal, setJournal] = useState<JournalEntry[]>(loadJournal);
  const [showJournal, setShowJournal] = useState(false);
  const [timerDuration, setTimerDuration] = useState('');
  const [customActivities, setCustomActivities] = useState<Activity[]>(loadCustomActivities);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [showInspiration, setShowInspiration] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { play } = useAmbientSound();

  const handleEnter = useCallback(() => {
    setPhase('pick');
  }, []);

  const handleSelectActivity = useCallback((activity: Activity) => {
    setSelectedActivity(activity);
    setPhase('timer');
  }, []);

  const handleTimerFinish = useCallback((duration: string) => {
    setTimerDuration(duration);
    if (selectedActivity) {
      setPhase('journal');
    }
  }, [selectedActivity]);

  const handleJournalComplete = useCallback((entry: string) => {
    if (selectedActivity) {
      const newEntry: JournalEntry = {
        activity: selectedActivity.name,
        duration: timerDuration,
        entry,
        timestamp: Date.now(),
      };
      const updated = [newEntry, ...journal].slice(0, 100);
      setJournal(updated);
      saveJournal(updated);
    }
    setSelectedActivity(null);
    setPhase('pick');
  }, [selectedActivity, timerDuration, journal]);

  const handleJournalSkip = useCallback(() => {
    setSelectedActivity(null);
    setPhase('pick');
  }, []);

  const handleSoundSelect = useCallback((sound: AmbientSound) => {
    setCurrentSound(sound.id);
    play(sound.type);
  }, [play]);

  const handleBack = useCallback(() => {
    if (phase === 'timer' || phase === 'journal') {
      setSelectedActivity(null);
      setPhase('pick');
    } else if (phase === 'pick') {
      setPhase('welcome');
    }
  }, [phase]);

  // Custom activity handlers
  const handleAddCustom = useCallback(() => {
    setEditingActivity(null);
    setShowCustomModal(true);
  }, []);

  const handleEditCustom = useCallback((activity: Activity) => {
    setEditingActivity(activity);
    setShowCustomModal(true);
  }, []);

  const handleDeleteCustom = useCallback((activity: Activity) => {
    const updated = customActivities.filter(a => a.id !== activity.id);
    setCustomActivities(updated);
    saveCustomActivities(updated);
  }, [customActivities]);

  const handleSaveCustom = useCallback((activity: Activity) => {
    const exists = customActivities.find(a => a.id === activity.id);
    let updated: Activity[];
    if (exists) {
      updated = customActivities.map(a => a.id === activity.id ? activity : a);
    } else {
      updated = [...customActivities, activity];
    }
    setCustomActivities(updated);
    saveCustomActivities(updated);
    setShowCustomModal(false);
    setEditingActivity(null);
  }, [customActivities]);

  const handleCloseCustomModal = useCallback(() => {
    setShowCustomModal(false);
    setEditingActivity(null);
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-midnight">
      {/* Particle background - always visible */}
      <ParticleBackground />

      {/* Vibe screen - always visible as background */}
      <div className="absolute inset-0 opacity-40">
        <VibeScreen />
      </div>

      {/* Top bar */}
      {phase !== 'welcome' && (
        <div className="absolute top-0 left-0 right-0 z-20 animate-fade-in">
          <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4">
            <div className="flex items-center gap-3 sm:gap-5">
              <button onClick={handleBack} className="btn-text text-sm sm:text-base">
                ← 返回
              </button>
              <h1 className="text-sm font-light text-whisper/70 tracking-[0.2em]">
                慢 <span className="text-glow/60 font-mono text-xs">mind</span>
              </h1>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="btn-text text-sm sm:text-base"
                style={showSettings ? { opacity: 1, color: 'var(--color-glow)' } : {}}
              >
                ⚙️
              </button>
              <button
                onClick={() => setShowInspiration(true)}
                className="btn-text text-sm sm:text-base"
              >
                ✨
              </button>
              <button
                onClick={() => setShowJournal(!showJournal)}
                className="btn-text text-sm sm:text-base"
                style={showJournal ? { opacity: 1, color: 'var(--color-glow)' } : {}}
              >
                📝
              </button>
            </div>
          </div>

          {/* Collapsible settings panel */}
          {showSettings && (
            <div
              className="absolute top-full right-2 sm:right-5 mt-1 z-30 animate-fade-in"
              style={{
                background: 'color-mix(in srgb, var(--color-deep) 92%, transparent)',
                backdropFilter: 'blur(20px)',
                border: '1px solid color-mix(in srgb, var(--color-muted) 20%, transparent)',
                borderRadius: '1rem',
                padding: '1rem 1.25rem',
                boxShadow: '0 8px 32px -8px rgba(0,0,0,0.4)',
              }}
            >
              <div className="mb-3">
                <p className="text-xs text-whisper/40 mb-2 tracking-wide">氛围</p>
                <AmbientSoundPicker currentSound={currentSound} onSelect={handleSoundSelect} />
              </div>
              <div>
                <p className="text-xs text-whisper/40 mb-2 tracking-wide">主题</p>
                <ThemePicker />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Journal history panel */}
      {showJournal && phase !== 'welcome' && (
        <div className="absolute top-14 sm:top-16 right-2 sm:right-5 z-30 w-[calc(100%-1rem)] sm:w-80 max-h-[60vh] overflow-y-auto animate-fade-in"
          style={{
            background: 'color-mix(in srgb, var(--color-deep) 92%, transparent)',
            backdropFilter: 'blur(20px)',
            border: '1px solid color-mix(in srgb, var(--color-muted) 20%, transparent)',
            borderRadius: '1rem',
            padding: '1.25rem',
            boxShadow: '0 8px 32px -8px rgba(0,0,0,0.4)',
          }}
        >
          <h3 className="text-sm font-normal text-whisper/80 mb-5">过去的慢时光</h3>
          {journal.length === 0 ? (
            <p className="text-xs text-whisper/40">还没有记录</p>
          ) : (
            <div className="space-y-4">
              {journal.map((entry, i) => (
                <div key={i} className="pb-3" style={{ borderBottom: '1px solid color-mix(in srgb, var(--color-muted) 10%, transparent)' }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-glow/70">{entry.activity}</span>
                    <span className="text-xs text-whisper/40 font-mono">{entry.duration}</span>
                  </div>
                  {entry.entry && (
                    <p className="text-xs text-whisper/40 leading-relaxed">{entry.entry}</p>
                  )}
                  <p className="text-xs text-whisper/15 mt-1 font-mono">
                    {new Date(entry.timestamp).toLocaleDateString('zh-CN', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main content */}
      <div className="relative z-10 h-full">
        {phase === 'welcome' && (
          <div className="h-full flex flex-col items-center justify-center relative">
            <Welcome onEnter={handleEnter} />
            {/* Theme picker on welcome screen */}
            <div className="absolute bottom-16">
              <ThemePicker />
            </div>
          </div>
        )}
        {phase === 'pick' && (
          <div className="h-full flex items-center justify-center px-12 pt-28 pb-12">
            <div className="w-full max-w-4xl">
              <div className="text-center mb-16">
                <h2 className="text-2xl font-extralight text-whisper/80 mb-4 tracking-widest">
                  此刻，想做什么？
                </h2>
                <p className="text-sm text-whisper/35 font-light tracking-wide">
                  选一个不能被 AI 加速的事
                </p>
              </div>
              <ActivityPicker
                customActivities={customActivities}
                onAddCustom={handleAddCustom}
                onEditCustom={handleEditCustom}
                onDeleteCustom={handleDeleteCustom}
                onSelect={handleSelectActivity}
              />
            </div>
          </div>
        )}
        {phase === 'timer' && selectedActivity && (
          <GentleTimer
            activityName={selectedActivity.name}
            activityIcon={selectedActivity.icon}
            guide={selectedActivity.guide}
            experience={getExperience(selectedActivity.id)}
            onFinish={handleTimerFinish}
          />
        )}
        {phase === 'journal' && selectedActivity && (
          <Journal
            activityName={selectedActivity.name}
            duration={timerDuration}
            onComplete={handleJournalComplete}
            onSkip={handleJournalSkip}
          />
        )}
      </div>

      {/* Custom Activity Modal */}
      {showCustomModal && (
        <CustomActivityModal
          activity={editingActivity}
          onSave={handleSaveCustom}
          onClose={handleCloseCustomModal}
        />
      )}

      {/* Inspiration Card */}
      {showInspiration && (
        <InspirationCard onClose={() => setShowInspiration(false)} />
      )}
    </div>
  );
}
