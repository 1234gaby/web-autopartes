import React from 'react';
import { useDarkMode } from '../context/DarkModeContext';

export function DarkModeToggle() {
  const { darkMode, setDarkMode } = useDarkMode();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-lg transition"
        aria-label="Toggle Dark Mode"
      >
        {darkMode ? '🌙 Modo oscuro' : '☀️ Modo claro'}
      </button>
    </div>
  );
}

export default DarkModeToggle;