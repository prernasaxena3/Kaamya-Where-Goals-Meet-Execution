import React from 'react';
import { Play, Pause, Square, Timer, Coffee, Zap } from 'lucide-react';
import { usePomodoroContext } from '../contexts/PomodoroContext';

const sessionIcons = {
  work: Zap,
  shortBreak: Coffee,
  longBreak: Coffee
};

const sessionColors = {
  work: 'from-red-500 to-pink-500',
  shortBreak: 'from-green-500 to-emerald-500',
  longBreak: 'from-blue-500 to-indigo-500'
};

const sessionLabels = {
  work: 'Focus Time',
  shortBreak: 'Short Break',
  longBreak: 'Long Break'
};

export const PomodoroTimer = ({ currentTaskId, onStartWithTask, className = '' }) => {
  const {
    currentSession,
    timeLeft,
    isActive,
    sessionsCompleted,
    startSession,
    pauseSession,
    resumeSession,
    stopSession,
    getNextSessionType,
    formatTime
  } = usePomodoroContext();

  const progress = currentSession 
    ? ((currentSession.duration - timeLeft) / currentSession.duration) * 100
    : 0;

  const handleStartSession = () => {
    const sessionType = currentSession ? currentSession.type : 'work';
    startSession(sessionType, currentTaskId);
  };

  const SessionIcon = currentSession ? sessionIcons[currentSession.type] : Timer;
  const gradientClass = currentSession ? sessionColors[currentSession.type] : 'from-gray-400 to-gray-500';
  const sessionLabel = currentSession ? sessionLabels[currentSession.type] : 'Ready to Focus';

  return (
    <div className={`bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg border border-gray-200 ${className}`}>
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <SessionIcon className="w-6 h-6 text-gray-600" />
          <h2 className="text-xl font-bold text-gray-800">Pomodoro Timer</h2>
        </div>

        <div className="mb-6">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full bg-gray-200">
              <div 
                className={`absolute inset-0 rounded-full bg-gradient-to-r ${gradientClass} transition-all duration-1000 ease-out`}
                style={{
                  background: `conic-gradient(from 0deg, transparent ${100 - progress}%, currentColor ${100 - progress}%)`
                }}
              />
            </div>
            <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-800">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-2">{sessionLabel}</p>
          <p className="text-xs text-gray-500">
            Sessions completed: {sessionsCompleted}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 mb-4">
          {!currentSession ? (
            <button
              onClick={handleStartSession}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
            >
              <Play className="w-5 h-5" />
              Start Focus
            </button>
          ) : (
            <>
              <button
                onClick={isActive ? pauseSession : resumeSession}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isActive ? 'Pause' : 'Resume'}
              </button>
              
              <button
                onClick={stopSession}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Square className="w-4 h-4" />
                Stop
              </button>
            </>
          )}
        </div>

        <div className="text-xs text-gray-500">
          Next: {getNextSessionType() === 'work' ? 'Focus Time' : 
                 getNextSessionType() === 'shortBreak' ? 'Short Break' : 'Long Break'}
        </div>
      </div>
    </div>
  );
};
