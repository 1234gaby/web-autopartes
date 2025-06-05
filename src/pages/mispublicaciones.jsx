import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LoadingOverlay } from '../components/ui/LoadingOverlay';
import axios from 'axios';

const MisPublicaciones = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    axios.get('https://web-autopartes-backend.onrender.com/publicaciones')
      .then(res => {
        // Filtrar solo las publicaciones del usuario logueado
        const mias = res.data.filter(pub => String(pub.user_id) === String(userId));
        setPublicaciones(mias);
      })
      .catch(err => {
        console.error('Error al cargar publicaciones', err);
        setPublicaciones([]);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700 transition-all duration-500 min-h-screen"
    >
      <LoadingOverlay loading={loading} />

      <button
        onClick={() => navigate('/micuenta')}
        className="mb-6 px-5 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300 flex items-center space-x-2"
        aria-label="Volver a Mi Cuenta"
      >
        <span className="text-xl font-semibold select-none">←</span>
        <span>Volver a Mi Cuenta</span>
      </button>

      <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-gray-100 mb-8">
        Mis Publicaciones
      </h2>

      {publicaciones.length === 0 && !loading && (
        <div className="text-center text-gray-600 dark:text-gray-300">
          No tienes publicaciones creadas.
        </div>
      )}

      <div className="grid gap-6">
        {publicaciones.map(pub => (
          <motion.div
            key={pub.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-5 bg-gray-50 dark:bg-gray-700 rounded-lg shadow border border-gray-200 dark:border-gray-600"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{pub.nombre_producto}</h3>
            <div className="text-gray-700 dark:text-gray-200 mb-1">
              <strong>Marca:</strong> {pub.marca} &nbsp; <strong>Modelo:</strong> {pub.modelo}
            </div>
            <div className="text-gray-700 dark:text-gray-200 mb-1">
              <strong>Precio:</strong> ${pub.precio}
            </div>
            <div className="text-gray-700 dark:text-gray-200 mb-1">
              <strong>Ubicación:</strong> {pub.ubicacion}
            </div>
            <div className="text-gray-700 dark:text-gray-200 mb-1">
              <strong>Categoría:</strong> {pub.categoria}
            </div>
            <div className="text-gray-700 dark:text-gray-200 mb-1">
              <strong>Estado:</strong> {pub.estado}
            </div>
            {pub.fotos && Array.isArray(pub.fotos) && pub.fotos.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {pub.fotos.map((foto, idx) => (
                  <img
                    key={idx}
                    src={foto}
                    alt="foto publicación"
                    className="w-24 h-24 object-cover rounded border border-gray-300 dark:border-gray-600"
                  />
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default MisPublicaciones;