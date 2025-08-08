import { useState, useEffect, useCallback, useRef } from 'react';

export function usePomodoro(settings) {
  const [currentSession, setCurrentSession] = useState(null);
  const [timeLeft, setTimeLeft] = useState(settings?.workDuration * 60 || 1500);
  const [isActive, setIsActive] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const isActiveRef = useRef(isActive);

  // Keep ref updated with latest isActive
  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  const createSession = useCallback((type, taskId) => {
    const duration = type === 'work' 
      ? settings.workDuration 
      : type === 'shortBreak' 
      ? settings.shortBreakDuration 
      : settings.longBreakDuration;

    return {
      id: Date.now().toString(),
      type,
      duration: duration * 60,
      startTime: new Date(),
      completed: false,
      taskId
    };
  }, [settings]);

  const startSession = useCallback((type, taskId) => {
    const session = createSession(type, taskId);
    setCurrentSession(session);
    setTimeLeft(session.duration);
    setIsActive(true);
  }, [createSession]);

  const pauseSession = useCallback(() => {
    setIsActive(false);
  }, []);

  const resumeSession = useCallback(() => {
    setIsActive(true);
  }, []);

  const stopSession = useCallback(() => {
    if (currentSession) {
      setCurrentSession({
        ...currentSession,
        endTime: new Date(),
        completed: false
      });
    }
    setIsActive(false);
    setTimeLeft(settings?.workDuration * 60 || 1500);
    setCurrentSession(null);
  }, [currentSession, settings]);

  const completeSession = useCallback(() => {
    if (currentSession) {
      setCurrentSession({
        ...currentSession,
        endTime: new Date(),
        completed: true
      });

      if (currentSession.type === 'work') {
        setSessionsCompleted(prev => prev + 1);
      }
    }
    setIsActive(false);
  }, [currentSession]);

  const getNextSessionType = useCallback(() => {
    if (!currentSession) return 'work';

    if (currentSession.type === 'work') {
      return (sessionsCompleted + 1) % settings.longBreakInterval === 0 
        ? 'longBreak' 
        : 'shortBreak';
    }

    return 'work';
  }, [currentSession, sessionsCompleted, settings]);

  // 🧠 Core timer logic
  useEffect(() => {
    const interval = setInterval(() => {
      if (isActiveRef.current && currentSession && timeLeft > 0) {
        setTimeLeft(prev => prev - 1);
      } else if (timeLeft === 0 && currentSession) {
        completeSession();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, currentSession, completeSession]);

  const formatTime = useCallback((seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  return {
    currentSession,
    timeLeft,
    isActive,
    sessionsCompleted,
    startSession,
    pauseSession,
    resumeSession,
    stopSession,
    completeSession,
    getNextSessionType,
    formatTime
  };
}
