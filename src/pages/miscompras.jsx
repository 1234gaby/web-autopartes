import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const DATOS_TRANSFERENCIA = {
  alias: 'autopartes.delorean',
  cbu: '11223344556677889900',
  nombre: 'DeLorean Autopartes SRL'
};

const MisCompras = () => {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comprobanteFiles, setComprobanteFiles] = useState({});
  const [subiendo, setSubiendo] = useState({});
  const [vendedores, setVendedores] = useState({});
  const [aviso, setAviso] = useState('');
  const [popupPago, setPopupPago] = useState(null); // id de la compra para mostrar popup
  const [confirmando, setConfirmando] = useState({});
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
      .then(async res => {
        const comprasData = res.data || [];
        setCompras(comprasData);

        // Obtener nombre_local de cada vendedor (como en verpublicacion.jsx)
        const vendedorIds = [
          ...new Set(comprasData.map(c => c.vendedor_id).filter(Boolean))
        ];
        const vendedoresObj = {};
        await Promise.all(
          vendedorIds.map(async (id) => {
            try {
              const resUser = await axios.get(`https://web-autopartes-backend.onrender.com/usuarios/${id}`);
              vendedoresObj[id] = resUser.data?.nombre_local || '-';
            } catch {
              vendedoresObj[id] = '-';
            }
          })
        );
        setVendedores(vendedoresObj);
      })
      .catch(() => setCompras([]))
      .finally(() => setLoading(false));
  }, [userId, navigate]);

  const handleFileChange = (ventaId, file) => {
    // Solo permitir imágenes
    if (file && !file.type.startsWith('image/')) {
      setAviso('Solo se permite subir imágenes o capturas de pantalla (no PDF).');
      setComprobanteFiles(prev => ({ ...prev, [ventaId]: undefined }));
      return;
    }
    setAviso('');
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

  // Función para mostrar correctamente el envío
  const mostrarEnvio = (compra) => {
    if (compra.envio === true || compra.envio === 'true') {
      return compra.tipo_envio ? compra.tipo_envio : 'Sí';
    }
    if (compra.envio === false || compra.envio === 'false') {
      return 'No';
    }
    return '-';
  };

  // Confirmar recepción (requiere backend y campo en la tabla ventas)
  const handleConfirmarRecepcion = async (ventaId) => {
    setConfirmando(prev => ({ ...prev, [ventaId]: true }));
    try {
      await axios.put(
        `https://web-autopartes-backend.onrender.com/ventas/${ventaId}`,
        { confirmacioncomprador: true }
      );
      // Refrescar compras
      const res = await axios.get(`https://web-autopartes-backend.onrender.com/usuarios/${userId}/compras`);
      setCompras(res.data || []);
    } catch {
      alert('Error al confirmar recepción');
    }
    setConfirmando(prev => ({ ...prev, [ventaId]: false }));
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

      {/* Aviso sobre el formato del comprobante */}
      <div className="mb-4 w-full max-w-3xl">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 px-4 py-3 rounded shadow text-sm">
          Solo se permite subir comprobantes en formato <b>imagen</b> (JPG, PNG, captura de pantalla). <b>No se admite PDF</b>.
        </div>
        {aviso && (
          <div className="mt-2 bg-red-100 border-l-4 border-red-500 text-red-800 dark:bg-red-900 dark:text-red-100 px-4 py-2 rounded shadow text-sm">
            {aviso}
          </div>
        )}
      </div>

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
          className="w-full max-w-[98vw]"
        >
          <div className="rounded-lg shadow-xl overflow-x-auto bg-white dark:bg-gray-800">
            <table className="w-full min-w-[1300px]">
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
                  <th className="px-4 py-2 text-left font-semibold text-blue-900 dark:text-blue-100">Pago</th>
                  <th className="px-4 py-2 text-left font-semibold text-blue-900 dark:text-blue-100">Comprobante</th>
                  <th className="px-4 py-2 text-left font-semibold text-blue-900 dark:text-blue-100">Recepción</th>
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
                      <td className="px-4 py-2 text-blue-900 dark:text-blue-100">{compra.nombre_producto || compra.producto || 'Producto'}</td>
                      <td className="px-4 py-2 text-blue-900 dark:text-blue-100">{compra.cantidad}</td>
                      <td className="px-4 py-2 text-blue-900 dark:text-blue-100">${Number(compra.monto).toFixed(2)}</td>
                      <td className="px-4 py-2 text-blue-900 dark:text-blue-100">{fechaObj ? fechaObj.toLocaleDateString() : '-'}</td>
                      <td className="px-4 py-2 text-blue-900 dark:text-blue-100">{fechaObj ? fechaObj.toLocaleTimeString() : '-'}</td>
                      <td className="px-4 py-2 text-blue-900 dark:text-blue-100">
                        {vendedores[compra.vendedor_id] || '-'}
                      </td>
                      <td className="px-4 py-2 text-blue-900 dark:text-blue-100">
                        {mostrarEnvio(compra)}
                      </td>
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
                        <motion.button
                          whileHover={{ scale: 1.07 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-2 py-1 bg-blue-700 text-white rounded hover:bg-blue-800 transition"
                          onClick={() => setPopupPago(compra.id)}
                        >
                          Ver datos
                        </motion.button>
                        {/* Popup de datos de pago */}
                        {popupPago === compra.id && (
                          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 max-w-xs w-full relative">
                              <button
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 text-xl"
                                onClick={() => setPopupPago(null)}
                              >
                                ×
                              </button>
                              <h3 className="text-xl font-bold mb-4 text-blue-800 dark:text-blue-200 text-center">Datos para transferencia</h3>
                              <div className="mb-2">
                                <span className="font-semibold">Alias:</span> <span className="font-mono">{DATOS_TRANSFERENCIA.alias}</span>
                              </div>
                              <div className="mb-2">
                                <span className="font-semibold">CBU:</span> <span className="font-mono">{DATOS_TRANSFERENCIA.cbu}</span>
                              </div>
                              <div className="mb-2">
                                <span className="font-semibold">Nombre de la cuenta:</span> <span>{DATOS_TRANSFERENCIA.nombre}</span>
                              </div>
                              <div className="mt-4 flex justify-center">
                                <button
                                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                  onClick={() => setPopupPago(null)}
                                >
                                  Cerrar
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
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
                              accept="image/*"
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
                      <td className="px-4 py-2">
                        {compra.confirmacioncomprador ? (
                          <span className="text-green-700 dark:text-green-400 font-semibold">Confirmado</span>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.07 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-2 py-1 bg-green-700 text-white rounded hover:bg-green-800 transition"
                            onClick={() => handleConfirmarRecepcion(compra.id)}
                            disabled={confirmando[compra.id]}
                          >
                            {confirmando[compra.id] ? 'Confirmando...' : 'Confirmar recepción'}
                          </motion.button>
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