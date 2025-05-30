// src/components/Spinner.jsx
import { useState, useEffect } from 'react';

export function Spinner() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000); // Cambiar a tiempo real en base a tu lógica
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 border-solid rounded-full animate-spin"></div>
        <p className="mt-4 text-lg">Cargando...</p>
      </div>
    );
  }

  return <div>Contenido cargado</div>;
}
