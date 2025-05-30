import React, { forwardRef } from 'react';

export const Button = forwardRef(({ as: Component = 'button', children, className = '', ...props }, ref) => {
  return (
    <Component
      ref={ref}
      className={`w-full py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
});
