import { useState, useEffect } from 'react'
import { HomeScreen } from './screens/HomeScreen'
import { ActiveTrainingScreen } from './screens/ActiveTrainingScreen'
import { RestScreen } from './screens/RestScreen'
import { SettingsScreen } from './screens/SettingsScreen'
import { WorkoutCompleteScreen } from './screens/WorkoutCompleteScreen'
import { DifficultyScreen } from './screens/DifficultyScreen'

function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('thaimerSettings');
      if (saved)      return JSON.parse(saved);
    } catch (e) { console.warn(e); }
    return {
      roundDuration: 60,
      restDuration: 30,
      totalRounds: 5,
      tenSecondWarning: true,
      difficulty: 'beginner'
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem('thaimerSettings', JSON.stringify(settings));
    } catch (e) { console.warn(e); }
  }, [settings]);

  const [currentRound, setCurrentRound] = useState(1);
  
  return (
    <div className="min-h-screen bg-brand-background text-brand-on-surface flex items-center justify-center">
      <div className="w-full max-w-md h-full min-h-screen bg-brand-background shadow-2xl relative overflow-hidden flex flex-col">
        {currentScreen === 'home' && (
          <HomeScreen 
            onNavigate={setCurrentScreen} 
            onStartTraining={() => {
              setCurrentRound(1);
              setCurrentScreen('difficulty');
            }} 
          />
        )}
        {currentScreen === 'difficulty' && (
          <DifficultyScreen 
            onNavigate={setCurrentScreen} 
            onSelectDifficulty={(diff) => {
              setSettings(s => ({...s, difficulty: diff}));
              setCurrentScreen('active');
            }}
          />
        )}
        {currentScreen === 'active' && (
          <ActiveTrainingScreen 
            onNavigate={setCurrentScreen} 
            settings={settings}
            currentRound={currentRound}
          />
        )}
        {currentScreen === 'rest' && (
          <RestScreen 
            onNavigate={setCurrentScreen} 
            settings={settings}
            onNextRound={() => {
              setCurrentRound(r => r + 1);
              setCurrentScreen('active');
            }}
          />
        )}
        {currentScreen === 'settings' && (
          <SettingsScreen 
            onNavigate={setCurrentScreen} 
            settings={settings}
            onSaveSettings={setSettings}
          />
        )}
        {currentScreen === 'complete' && (
          <WorkoutCompleteScreen 
            onNavigate={setCurrentScreen} 
            settings={settings}
            currentRound={currentRound}
            onAddRound={() => {
              setSettings(s => ({ ...s, totalRounds: s.totalRounds + 1 }));
              setCurrentRound(r => r + 1);
              setCurrentScreen('active');
            }}
          />
        )}
      </div>
    </div>
  )
}

export default App
