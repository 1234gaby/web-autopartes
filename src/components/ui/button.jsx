export function Button({ children, className, ...props }) {
  return (
    <button
      className={`w-full py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
