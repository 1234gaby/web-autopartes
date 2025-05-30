import React from 'react';

export function Select({
  name,
  value,
  onChange,
  children,
  label,
  className = '',
  disabled = false,
}) {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`p-2 border border-gray-300 rounded bg-white text-gray-900
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 dark:focus:ring-blue-400
          transition duration-200 ease-in-out
          ${disabled ? 'cursor-not-allowed bg-gray-100 dark:bg-gray-700' : ''}
        `}
      >
        {children}
      </select>
    </div>
  );
}
