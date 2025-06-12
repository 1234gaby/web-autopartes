import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const MisCompras = () => {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comprobanteFiles, setComprobanteFiles] = useState({});
  const [subiendo, setSubiendo] = useState({});
  const navigate = useNavigate();
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    if (!userId) {
      navigate('/');
      return;
    }
    setLoading(true);
    axios
      .get(`https://web-autopartes-backend.onrender.com/usuarios/${userId}/compras`)
      .then(res => setCompras(res.data || []))
      .catch(() => setCompras([]))
      .finally(() => setLoading(false));
  }, [userId, navigate]);

  const handleFileChange = (ventaId, file) => {
    setComprobanteFiles(prev => ({ ...prev, [ventaId]: file }));
  };

  const handleSubirComprobante = async (ventaId) => {
    if (!comprobanteFiles[ventaId]) return;
    setSubiendo(prev => ({ ...prev, [ventaId]: true }));
    const formData = new FormData();
    formData.append('comprobante', comprobanteFiles[ventaId]);
    try {
      await axios.post(
        `https://web-autopartes-backend.onrender.com/ventas/${ventaId}/comprobante`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      // Refrescar compras
      const res = await axios.get(`https://web-autopartes-backend.onrender.com/usuarios/${userId}/compras`);
      setCompras(res.data || []);
      setComprobanteFiles(prev => ({ ...prev, [ventaId]: undefined }));
    } catch (e) {
      alert('Error al subir comprobante');
    }
    setSubiendo(prev => ({ ...prev, [ventaId]: false }));
  };

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
        Mis Compras
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
      ) : compras.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-700 dark:text-gray-200"
        >
          No realizaste compras aún.
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-5xl overflow-x-auto"
        >
          <div className="rounded-lg shadow-xl overflow-hidden bg-white dark:bg-gray-800">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-100 dark:bg-blue-900">
                  <th className="px-4 py-2 text-left font-semibold text-blue-900 dark:text-blue-100">Producto</th>
                  <th className="px-4 py-2 text-left font-semibold text-blue-900 dark:text-blue-100">Cantidad</th>
                  <th className="px-4 py-2 text-left font-semibold text-blue-900 dark:text-blue-100">Total</th>
                  <th className="px-4 py-2 text-left font-semibold text-blue-900 dark:text-blue-100">Fecha</th>
                  <th className="px-4 py-2 text-left font-semibold text-blue-900 dark:text-blue-100">Hora</th>
                  <th className="px-4 py-2 text-left font-semibold text-blue-900 dark:text-blue-100">Local</th>
                  <th className="px-4 py-2 text-left font-semibold text-blue-900 dark:text-blue-100">Envío</th>
                  <th className="px-4 py-2 text-left font-semibold text-blue-900 dark:text-blue-100">Ver publicación</th>
                  <th className="px-4 py-2 text-left font-semibold text-blue-900 dark:text-blue-100">Comprobante</th>
                </tr>
              </thead>
              <tbody>
                {compras.map((compra, idx) => {
                  const fechaObj = compra.fecha ? new Date(compra.fecha) : null;
                  return (
                    <motion.tr
                      key={idx}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + idx * 0.05 }}
                      className="border-t border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700 transition"
                    >
                      <td className="px-4 py-2">{compra.nombre_producto || compra.producto || 'Producto'}</td>
                      <td className="px-4 py-2">{compra.cantidad}</td>
                      <td className="px-4 py-2">${Number(compra.monto).toFixed(2)}</td>
                      <td className="px-4 py-2">{fechaObj ? fechaObj.toLocaleDateString() : '-'}</td>
                      <td className="px-4 py-2">{fechaObj ? fechaObj.toLocaleTimeString() : '-'}</td>
                      <td className="px-4 py-2">{compra.nombre_local || '-'}</td>
                      <td className="px-4 py-2">{compra.tipo_envio || '-'}</td>
                      <td className="px-4 py-2">
                        <motion.button
                          whileHover={{ scale: 1.07 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                          onClick={() => navigate(`/publicacion/${compra.publicacion_id}`)}
                        >
                          Ver
                        </motion.button>
                      </td>
                      <td className="px-4 py-2">
                        {compra.comprobante_pago_url ? (
                          <a
                            href={compra.comprobante_pago_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            Ver comprobante
                          </a>
                        ) : (
                          <div className="flex items-center gap-2">
                            <input
                              type="file"
                              accept="image/*,application/pdf"
                              onChange={e => handleFileChange(compra.id, e.target.files[0])}
                            />
                            <motion.button
                              whileHover={{ scale: 1.07 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                              onClick={() => handleSubirComprobante(compra.id)}
                              disabled={subiendo[compra.id] || !comprobanteFiles[compra.id]}
                            >
                              {subiendo[compra.id] ? 'Subiendo...' : 'Subir'}
                            </motion.button>
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MisCompras;