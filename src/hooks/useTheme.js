import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    // Always use dark mode
    setTheme('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  const toggleTheme = () => {
    // No-op function since we only use dark mode
    return;
  };

  return { theme, toggleTheme };
};

