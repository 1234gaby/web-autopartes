// src/components/DarkModeToggle.jsx
import React from 'react';
import { useDarkMode } from '../context/DarkModeContext';

export function DarkModeToggle() {
  const { darkMode, setDarkMode } = useDarkMode();

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition"
      aria-label="Toggle Dark Mode"
    >
      {darkMode ? '🌙 Modo oscuro' : '☀️ Modo claro'}
    </button>
  );
}
