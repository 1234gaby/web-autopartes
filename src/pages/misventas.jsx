import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const MisVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [compradores, setCompradores] = useState({});
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    if (!userId) {
      navigate('/');
      return;
    }
    setLoading(true);
    axios
      .get(`https://web-autopartes-backend.onrender.com/usuarios/${userId}/ventas`)
      .then(async res => {
        const ventasData = res.data || [];
        setVentas(ventasData);

        // Traer datos completos de compradores
        const compradoresIds = [
          ...new Set(ventasData.map(v => v.comprador_id).filter(Boolean))
        ];
        const compradoresObj = {};
        await Promise.all(
          compradoresIds.map(async (id) => {
            try {
              const resUser = await axios.get(`https://web-autopartes-backend.onrender.com/usuarios/${id}`);
              compradoresObj[id] = {
                nombre: resUser.data?.nombre || '',
                apellido: resUser.data?.apellido || '',
                email: resUser.data?.email || '',
                telefono: resUser.data?.telefono || '',
                dni: resUser.data?.dni || '',
              };
            } catch {
              compradoresObj[id] = {
                nombre: '',
                apellido: '',
                email: '',
                telefono: '',
                dni: '',
              };
            }
          })
        );
        setCompradores(compradoresObj);
      })
      .catch(() => setVentas([]))
      .finally(() => setLoading(false));
  }, [userId, navigate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col items-center py-10 px-4"
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-extrabold mb-6 text-blue-900 dark:text-blue-200 drop-shadow"
      >
        Mis Ventas
      </motion.h1>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate('/micuenta')}
        className="mb-6 px-4 py-2 rounded bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-800 dark:to-blue-600 text-white font-bold shadow-lg transition-all duration-200"
      >
        Volver a mi cuenta
      </motion.button>

      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-700 dark:text-gray-200"
        >
          Cargando...
        </motion.div>
      ) : ventas.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-700 dark:text-gray-200"
        >
          No tienes ventas registradas.
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-3xl flex flex-col gap-6"
        >
          {ventas.map((venta, idx) => {
            const fechaObj = venta.fecha ? new Date(venta.fecha) : null;
            const comprador = compradores[venta.comprador_id] || {};
            const tieneEnvio = venta.envio === true || venta.envio === 'true' ||
              venta.envio === 'si' || venta.envio === 'sí' || venta.envio === 'SI' || venta.envio === 'Sí';
            return (
              <motion.div
                key={venta.id}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + idx * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col gap-2 border border-blue-100 dark:border-gray-700"
              >
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <div>
                    <span className="font-bold text-blue-800 dark:text-blue-200 text-lg">{venta.nombre_producto}</span>
                    <span className="ml-3 text-xs text-gray-500 dark:text-gray-400">ID: {venta.id}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-green-700 dark:text-green-400">
                      ${Number(venta.monto).toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-700 dark:text-gray-200">
                  <div><b>Cantidad:</b> {venta.cantidad}</div>
                  <div><b>Fecha:</b> {fechaObj ? fechaObj.toLocaleDateString() : '-'}</div>
                  <div><b>Hora:</b> {fechaObj ? fechaObj.toLocaleTimeString() : '-'}</div>
                  <div>
                    <b>Pago recibido:</b>{' '}
                    {venta.pago_recibido ? (
                      <span className="text-green-700 dark:text-green-400 font-bold">Sí</span>
                    ) : (
                      <span className="text-red-700 dark:text-red-400 font-bold">No</span>
                    )}
                  </div>
                  <div>
                    <b>Envío:</b>{' '}
                    {tieneEnvio ? (venta.tipo_envio || 'Sí') : 'No'}
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
                    onClick={() => setVentaSeleccionada({ ...venta, comprador })}
                  >
                    Ver detalles
                  </button>
                  <button
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm"
                    onClick={() => navigate(`/publicacion/${venta.publicacion_id}`)}
                  >
                    Ver publicación
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Modal de detalles */}
      {ventaSeleccionada && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          onClick={() => setVentaSeleccionada(null)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-8 max-w-lg w-full relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
              onClick={() => setVentaSeleccionada(null)}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4 text-blue-800 dark:text-blue-200">
              Detalles de la venta
            </h2>
            <div className="mb-2"><b>ID Venta:</b> {ventaSeleccionada.id}</div>
            <div className="mb-2"><b>Producto:</b> {ventaSeleccionada.nombre_producto}</div>
            <div className="mb-2"><b>Cantidad:</b> {ventaSeleccionada.cantidad}</div>
            <div className="mb-2"><b>Monto:</b> ${Number(ventaSeleccionada.monto).toFixed(2)}</div>
            <div className="mb-2"><b>Fecha:</b> {ventaSeleccionada.fecha ? new Date(ventaSeleccionada.fecha).toLocaleString() : '-'}</div>
            <div className="mb-2">
              <b>Pago recibido:</b>{' '}
              {ventaSeleccionada.pago_recibido ? (
                <span className="text-green-700 dark:text-green-400 font-bold">Sí</span>
              ) : (
                <span className="text-red-700 dark:text-red-400 font-bold">No</span>
              )}
            </div>
            <div className="mb-2">
              <b>Envío:</b>{' '}
              {ventaSeleccionada.envio === true || ventaSeleccionada.envio === 'true' ||
              ventaSeleccionada.envio === 'si' || ventaSeleccionada.envio === 'sí' ||
              ventaSeleccionada.envio === 'SI' || ventaSeleccionada.envio === 'Sí'
                ? (ventaSeleccionada.tipo_envio || 'Sí')
                : 'No'}
            </div>
            {(ventaSeleccionada.envio === true || ventaSeleccionada.envio === 'true' ||
              ventaSeleccionada.envio === 'si' || ventaSeleccionada.envio === 'sí' ||
              ventaSeleccionada.envio === 'SI' || ventaSeleccionada.envio === 'Sí') && (
              <>
                <div className="mb-2"><b>Localidad de envío:</b> {ventaSeleccionada.localidad_envio || '-'}</div>
                <div className="mb-2"><b>Dirección:</b> {ventaSeleccionada.direccion_envio || '-'} {ventaSeleccionada.altura_envio || ''}</div>
                <div className="mb-2"><b>Entrecalles:</b> {ventaSeleccionada.entrecalles_envio || '-'}</div>
              </>
            )}
            <hr className="my-4" />
            <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Datos del comprador</h3>
            <div className="mb-1"><b>Nombre:</b> {ventaSeleccionada.comprador.nombre} {ventaSeleccionada.comprador.apellido}</div>
            <div className="mb-1"><b>Email:</b> {ventaSeleccionada.comprador.email}</div>
            <div className="mb-1"><b>Teléfono:</b> {ventaSeleccionada.comprador.telefono}</div>
            <div className="mb-1"><b>DNI:</b> {ventaSeleccionada.comprador.dni}</div>
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                onClick={() => setVentaSeleccionada(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MisVentas;