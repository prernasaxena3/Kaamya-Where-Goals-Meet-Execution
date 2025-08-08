import React, { createContext, useContext } from 'react';
import { usePomodoro } from '../hooks/usePomodoro';

const PomodoroContext = createContext();

export const PomodoroProvider = ({ children, settings }) => {
  const pomodoro = usePomodoro(settings);
  return (
    <PomodoroContext.Provider value={pomodoro}>
      {children}
    </PomodoroContext.Provider>
  );
};

export const usePomodoroContext = () => useContext(PomodoroContext);
