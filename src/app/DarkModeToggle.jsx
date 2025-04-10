'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDark(prev => !prev);
    const newMode = !isDark ? 'dark' : 'light';
    if (newMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', newMode);
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="fixed bottom-4 right-4 z-50 p-2 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
      aria-label="Toggle dark mode"
    >
      {isDark ? (
        <Moon className="w-6 h-6" stroke="currentColor" />
      ) : (
        <Sun className="w-6 h-6" stroke="currentColor" />
      )}
    </button>
  );
}