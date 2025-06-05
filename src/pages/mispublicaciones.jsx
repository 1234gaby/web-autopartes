import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LoadingOverlay } from '../components/ui/LoadingOverlay';
import axios from 'axios';

const MisPublicaciones = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem('user_id');

  // Traer publicaciones del usuario
  const fetchPublicaciones = () => {
    setLoading(true);
    axios.get('https://web-autopartes-backend.onrender.com/publicaciones')
      .then(res => {
        const mias = res.data.filter(pub => String(pub.user_id) === String(userId));
        setPublicaciones(mias);
      })
      .catch(() => setPublicaciones([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (userId) fetchPublicaciones();
    // eslint-disable-next-line
  }, [userId]);

  // Pausar o volver a publicar
  const handlePausar = async (id, pausada) => {
    setLoading(true);
    try {
      await axios.put(`https://web-autopartes-backend.onrender.com/publicaciones/${id}/pausar`, { pausada: !pausada });
      fetchPublicaciones();
    } catch {
      alert('Error al cambiar el estado de la publicación');
      setLoading(false);
    }
  };

  // Borrar publicación
  const handleBorrar = async (id) => {
    if (!window.confirm('¿Seguro que deseas borrar esta publicación?')) return;
    setLoading(true);
    try {
      await axios.delete(`https://web-autopartes-backend.onrender.com/publicaciones/${id}`);
      fetchPublicaciones();
    } catch {
      alert('Error al borrar la publicación');
      setLoading(false);
    }
  };

  // Ir a editar
  const handleEditar = (id) => {
    navigate(`/editar-publicacion/${id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700 transition-all duration-500 min-h-screen"
    >
      <LoadingOverlay loading={loading} />

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/micuenta')}
        className="mb-6 px-5 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300 flex items-center space-x-2"
        aria-label="Volver a Mi Cuenta"
      >
        <span className="text-xl font-semibold select-none">←</span>
        <span>Volver a Mi Cuenta</span>
      </motion.button>

      <motion.h2
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-3xl font-extrabold text-center text-gray-900 dark:text-gray-100 mb-8"
      >
        Mis Publicaciones
      </motion.h2>

      {publicaciones.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-600 dark:text-gray-300"
        >
          No tienes publicaciones creadas.
        </motion.div>
      )}

      <div className="grid gap-6">
        <AnimatePresence>
          {publicaciones.map(pub => (
            <motion.div
              key={pub.id}
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.3 }}
              className="p-5 bg-gray-50 dark:bg-gray-700 rounded-lg shadow border border-gray-200 dark:border-gray-600"
              layout
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
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-wrap gap-2 mt-2"
                >
                  {pub.fotos.map((foto, idx) => (
                    <motion.img
                      key={idx}
                      src={foto}
                      alt="foto publicación"
                      className="w-24 h-24 object-cover rounded border border-gray-300 dark:border-gray-600"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 * idx }}
                    />
                  ))}
                </motion.div>
              )}

              <motion.div
                className="flex gap-2 mt-4 flex-wrap"
                initial={false}
                animate={{ opacity: 1 }}
              >
                <motion.button
                  whileHover={{ scale: 1.07 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleEditar(pub.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Editar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.07 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handlePausar(pub.id, pub.pausada)}
                  className={`px-4 py-2 rounded text-white transition ${pub.pausada ? 'bg-green-600 hover:bg-green-700' : 'bg-yellow-600 hover:bg-yellow-700'}`}
                >
                  {pub.pausada ? 'Volver a publicar' : 'Pausar'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.07 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleBorrar(pub.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Borrar
                </motion.button>
              </motion.div>
              {pub.pausada && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 text-sm text-yellow-600 font-semibold"
                >
                  (Publicación pausada, no visible en el Home)
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default MisPublicaciones;