import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/button';
import { LoadingOverlay } from '../components/ui/LoadingOverlay';

const MotionButton = motion.create(Button);

const VerPublicacion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [publicacion, setPublicacion] = useState(null);
  const [vendedor, setVendedor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imgSeleccionada, setImgSeleccionada] = useState(0);
  const [modalAbierto, setModalAbierto] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`https://web-autopartes-backend.onrender.com/publicaciones/${id}`)
      .then(res => res.json())
      .then(async data => {
        setPublicacion(data);
        // Traer datos del usuario creador
        if (data.user_id) {
          const resUser = await fetch(`https://web-autopartes-backend.onrender.com/usuarios/${data.user_id}`);
          if (resUser.ok) {
            const userData = await resUser.json();
            setVendedor(userData);
          }
        }
      })
      .catch(() => alert('Error al cargar la publicación'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading || !publicacion) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <LoadingOverlay loading={true} />
        <div className="text-center py-10 text-gray-600 dark:text-gray-400">Cargando publicación...</div>
      </div>
    );
  }

  const {
    nombre_producto,
    marca,
    modelo,
    precio,
    ubicacion,
    estado,
    categoria,
    envio,
    tipo_envio,
    fotos = [],
    descripcion,
    compatibilidad = [],
    codigo_serie,
    marca_repuesto,
  } = publicacion;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4"
    >
      <LoadingOverlay loading={loading} />
      {/* Modal de imagen ampliada */}
      <AnimatePresence>
        {modalAbierto && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalAbierto(false)}
          >
            <motion.img
              src={fotos[imgSeleccionada]}
              alt="Imagen ampliada"
              className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-2xl border-4 border-white dark:border-gray-800"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={e => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-0 overflow-hidden"
      >
        {/* Header con imagen principal y título */}
        <div className="relative group">
          {fotos.length > 0 ? (
            <motion.img
              key={imgSeleccionada}
              src={fotos[imgSeleccionada]}
              alt={`Imagen ${imgSeleccionada + 1}`}
              className="w-full h-96 object-contain bg-black cursor-zoom-in transition-all duration-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              onClick={() => setModalAbierto(true)}
              title="Click para ampliar"
            />
          ) : (
            <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-2xl text-gray-600 dark:text-gray-400 select-none">
              Sin imagen
            </div>
          )}
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent px-8 pt-8 pb-4">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white drop-shadow-lg mb-2 leading-tight">
              {nombre_producto}
            </h2>
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
              <span className="inline-block text-2xl md:text-3xl font-extrabold text-green-400 bg-white/90 dark:bg-gray-900/90 px-6 py-2 rounded-xl shadow-2xl border-4 border-green-400 drop-shadow-lg mb-2 md:mb-0">
                ${precio?.toLocaleString('es-AR')}
              </span>
              <span className="inline-block text-base bg-blue-600 text-white px-4 py-2 rounded-full shadow font-semibold uppercase tracking-wider">
                {categoria}
              </span>
            </div>
          </div>
          {/* Miniaturas */}
          {fotos.length > 1 && (
            <div className="absolute bottom-6 right-8 flex gap-2">
              {fotos.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Miniatura ${idx + 1}`}
                  className={`w-14 h-14 object-cover rounded border-2 cursor-pointer transition
                    ${imgSeleccionada === idx
                      ? 'border-blue-600 dark:border-blue-400 ring-2 ring-blue-400'
                      : 'border-gray-300 dark:border-gray-600 opacity-70 hover:opacity-100'}
                  `}
                  onClick={e => {
                    e.stopPropagation();
                    setImgSeleccionada(idx);
                  }}
                  title="Ver imagen"
                />
              ))}
            </div>
          )}
        </div>

        {/* Detalles */}
        <div className="p-8 pt-6 flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2 space-y-4 text-gray-900 dark:text-gray-100">
            <div className="flex flex-wrap gap-2">
              <span className="bg-gray-200 dark:bg-gray-700 rounded px-3 py-1 text-sm">
                <strong>Marca:</strong> {marca}
              </span>
              <span className="bg-gray-200 dark:bg-gray-700 rounded px-3 py-1 text-sm">
                <strong>Modelo:</strong> {modelo}
              </span>
              <span className="bg-gray-200 dark:bg-gray-700 rounded px-3 py-1 text-sm">
                <strong>Estado:</strong> {estado?.charAt(0).toUpperCase() + estado?.slice(1)}
              </span>
              <span className="bg-gray-200 dark:bg-gray-700 rounded px-3 py-1 text-sm">
                <strong>Ubicación:</strong> {ubicacion}
              </span>
              <span className="bg-gray-200 dark:bg-gray-700 rounded px-3 py-1 text-sm">
                <strong>Envío:</strong> {envio === 'si' ? tipo_envio : 'No'}
              </span>
            </div>
            {codigo_serie && (
              <div>
                <span className="font-semibold">Código de serie:</span> {codigo_serie}
              </div>
            )}
            {marca_repuesto && (
              <div>
                <span className="font-semibold">Marca/Fabricante del repuesto:</span> {marca_repuesto}
              </div>
            )}
            {descripcion && (
              <div>
                <span className="font-semibold">Descripción:</span>
                <p className="mt-1 text-gray-700 dark:text-gray-300">{descripcion}</p>
              </div>
            )}
            {compatibilidad.length > 0 && (
              <div>
                <span className="font-semibold">Compatibilidad:</span>
                <ul className="list-disc list-inside text-sm mt-1">
                  {compatibilidad.map((c, i) => (
                    <li key={i}>
                      {c.marca ? c.marca.charAt(0).toUpperCase() + c.marca.slice(1) : ''} {c.modelo}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="md:w-1/2 flex flex-col gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/40 rounded-lg p-4 shadow">
              <span className="font-semibold text-blue-700 dark:text-blue-300">Vendedor</span>
              <div className="ml-2 mt-1">
                {vendedor?.nombre_local && (
                  <p className="text-sm text-blue-800 dark:text-blue-200 font-bold">
                    <strong></strong> {vendedor.nombre_local}
                  </p>
                )}
                {/* No mostrar nombre, apellido ni email */}
              </div>
            </div>
            <MotionButton
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg text-lg shadow-lg"
              onClick={() => alert('Funcionalidad de compra próximamente')}
            >
              Comprar
            </MotionButton>
          </div>
        </div>

        <div className="flex gap-3 mt-4 mb-4 justify-end px-8">
          <MotionButton
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded"
            onClick={() => navigate(-1)}
          >
            Volver
          </MotionButton>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VerPublicacion;