import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Read initial preference (either from storage or system fallback, default light)
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem('hrms_theme');
      if (stored === 'dark' || stored === 'light') {
        return stored;
      }
    } catch (e) {
      console.warn('LocalStorage is not accessible:', e);
    }
    return 'light';
  });

  // Apply the theme class to documentElement whenever it changes
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    try {
      localStorage.setItem('hrms_theme', theme);
    } catch (e) {
      console.warn('Failed to persist theme preference:', e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
