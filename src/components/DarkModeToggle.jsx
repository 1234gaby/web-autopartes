// src/components/DarkModeToggle.jsx
import React from 'react';
import { useDarkMode } from './DarkModeProvider';

export default function DarkModeToggle() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={toggleDarkMode}
        className="bg-gray-200 dark:bg-gray-700 rounded-full p-3 shadow-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        aria-label="Cambiar modo oscuro"
      >
        {isDarkMode ? '🌙' : '☀️'}
      </button>
    </div>
  );
}