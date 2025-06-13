import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Loader2 } from 'lucide-react';

const API_URL = 'https://web-autopartes-backend.onrender.com';

const AdminVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editVentaId, setEditVentaId] = useState(null);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  // Traer todas las ventas con detalles completos de publicación y usuarios
  useEffect(() => {
    setLoading(true);
    axios.get(`${API_URL}/ventas-detalle`)
      .then(res => setVentas(res.data))
      .catch(() => setVentas([]))
      .finally(() => setLoading(false));
  }, []);

  // Editar venta
  const handleEdit = (venta) => {
    setEditVentaId(venta.id);
    setEditData({
      ...venta,
      cantidad: venta.cantidad || 1,
      monto: venta.monto || '',
      localidad_envio: venta.localidad_envio || '',
      direccion_envio: venta.direccion_envio || '',
      altura_envio: venta.altura_envio || '',
      entrecalles_envio: venta.entrecalles_envio || '',
      pago_recibido: !!venta.pago_recibido,
    });
  };

  // Guardar cambios
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await axios.put(`${API_URL}/ventas/${editVentaId}`, editData);
      if (res.data && res.data.venta) {
        setVentas(ventas.map(v => (v.id === editVentaId ? res.data.venta : v)));
        setEditVentaId(null);
      } else {
        alert('Error al guardar cambios');
      }
    } catch {
      alert('Error de conexión');
    } finally {
      setSaving(false);
    }
  };

  // Aprobar pago recibido
  const handleAprobarPago = async (ventaId, valor) => {
    try {
      const res = await axios.put(`${API_URL}/ventas/${ventaId}`, { pago_recibido: valor });
      if (res.data && res.data.venta) {
        setVentas(ventas.map(v => (v.id === ventaId ? res.data.venta : v)));
      } else {
        alert('Error al actualizar pago');
      }
    } catch {
      alert('Error de conexión');
    }
  };

  // Filtrado por búsqueda
  const ventasFiltradas = ventas.filter(v => {
    const texto = `
      ${v.nombre_producto || ''} 
      ${v.comprador_email || ''} 
      ${v.vendedor_email || ''} 
      ${v.id} 
      ${v.comprador_nombre || ''} 
      ${v.comprador_apellido || ''} 
      ${v.vendedor_nombre || ''} 
      ${v.vendedor_apellido || ''} 
      ${v.comprador_telefono || ''} 
      ${v.vendedor_telefono || ''} 
      ${v.comprador_nombre_local || ''} 
      ${v.vendedor_nombre_local || ''}
    `.toLowerCase();
    return texto.includes(search.toLowerCase());
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 py-10"
    >
      {/* Botón Volver y Buscador */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <Button
          onClick={() => navigate(-1)}
          className="bg-gray-300 hover:bg-gray-400 text-gray-900 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
        >
          ← Volver
        </Button>
        <Input
          type="text"
          placeholder="Buscar por producto, comprador, vendedor, nombre, apellido, teléfono, local o ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full md:w-96 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
      </div>

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl font-extrabold mb-10 text-blue-900 dark:text-blue-200 drop-shadow"
      >
        Administración de Ventas
      </motion.h1>

      {loading ? (
        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-200">
          <Loader2 className="animate-spin" /> Cargando ventas...
        </div>
      ) : ventasFiltradas.length === 0 ? (
        <div className="text-gray-700 dark:text-gray-200">No hay ventas registradas.</div>
      ) : (
        <div className="w-full max-w-6xl flex flex-col gap-10">
          {ventasFiltradas.map((venta) => (
            <motion.div
              key={venta.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-6 border border-blue-100 dark:border-gray-700">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-2">
                  <div className="text-2xl text-blue-900 dark:text-blue-100 font-bold flex items-center gap-2">
                    Venta #{venta.id}
                    <span className="text-xs text-gray-500 ml-2">Fecha: {new Date(venta.fecha).toLocaleString()}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => handleEdit(venta)}
                    >
                      Editar
                    </Button>
                  </div>
                </div>
                {editVentaId === venta.id ? (
                  <form
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    onSubmit={e => {
                      e.preventDefault();
                      handleSave();
                    }}
                  >
                    <div>
                      <label className="text-gray-900 dark:text-gray-100 font-semibold">Cantidad</label>
                      <Input
                        type="number"
                        min={1}
                        value={editData.cantidad}
                        onChange={e => setEditData({ ...editData, cantidad: e.target.value })}
                        className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="text-gray-900 dark:text-gray-100 font-semibold">Monto</label>
                      <Input
                        type="number"
                        value={editData.monto}
                        onChange={e => setEditData({ ...editData, monto: e.target.value })}
                        className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="text-gray-900 dark:text-gray-100 font-semibold">Localidad envío</label>
                      <Input
                        value={editData.localidad_envio}
                        onChange={e => setEditData({ ...editData, localidad_envio: e.target.value })}
                        className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="text-gray-900 dark:text-gray-100 font-semibold">Dirección envío</label>
                      <Input
                        value={editData.direccion_envio}
                        onChange={e => setEditData({ ...editData, direccion_envio: e.target.value })}
                        className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="text-gray-900 dark:text-gray-100 font-semibold">Altura envío</label>
                      <Input
                        value={editData.altura_envio}
                        onChange={e => setEditData({ ...editData, altura_envio: e.target.value })}
                        className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="text-gray-900 dark:text-gray-100 font-semibold">Entre calles envío</label>
                      <Input
                        value={editData.entrecalles_envio}
                        onChange={e => setEditData({ ...editData, entrecalles_envio: e.target.value })}
                        className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="checkbox"
                        checked={!!editData.pago_recibido}
                        onChange={e => setEditData({ ...editData, pago_recibido: e.target.checked })}
                        className="form-checkbox h-5 w-5 text-blue-600"
                        id={`pago_recibido_${venta.id}`}
                      />
                      <label htmlFor={`pago_recibido_${venta.id}`} className="text-gray-900 dark:text-gray-100 font-semibold">
                        Pago recibido
                      </label>
                    </div>
                    <div className="col-span-2 flex gap-4 mt-2">
                      <Button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={saving}
                      >
                        {saving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : 'Guardar'}
                      </Button>
                      <Button
                        type="button"
                        className="bg-gray-500 hover:bg-gray-600 text-white"
                        onClick={() => setEditVentaId(null)}
                        disabled={saving}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Producto y monto */}
                    <div>
                      <div className="text-lg font-bold text-blue-800 dark:text-blue-200 mb-2">Producto</div>
                      <div className="text-gray-900 dark:text-gray-100 mb-1"><b>Nombre:</b> {venta.nombre_producto}</div>
                      <div className="text-gray-900 dark:text-gray-100 mb-1"><b>Cantidad:</b> {venta.cantidad}</div>
                      <div className="text-gray-900 dark:text-gray-100 mb-1"><b>Monto:</b> ${Number(venta.monto).toFixed(2)}</div>
                    </div>
                    {/* Comprobante */}
                    <div>
                      <div className="text-lg font-bold text-blue-800 dark:text-blue-200 mb-2">Comprobante de pago</div>
                      {venta.comprobante_pago_url ? (
                        <a
                          href={venta.comprobante_pago_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-300 underline"
                        >
                          Ver comprobante
                        </a>
                      ) : (
                        <span className="text-gray-500">No cargado</span>
                      )}
                    </div>
                    {/* Vendedor */}
                    <div>
                      <div className="text-lg font-bold text-blue-800 dark:text-blue-200 mb-2">Vendedor</div>
                      <div className="text-gray-900 dark:text-gray-100 mb-1"><b>Nombre:</b> {venta.vendedor_nombre} {venta.vendedor_apellido}</div>
                      <div className="text-gray-900 dark:text-gray-100 mb-1"><b>Email:</b> {venta.vendedor_email}</div>
                      <div className="text-gray-900 dark:text-gray-100 mb-1"><b>Teléfono:</b> {venta.vendedor_telefono || '-'}</div>
                      <div className="text-gray-900 dark:text-gray-100 mb-1"><b>Nombre del local:</b> {venta.vendedor_nombre_local || '-'}</div>
                      <div className="text-gray-900 dark:text-gray-100 mb-1"><b>Localidad:</b> {venta.vendedor_localidad || '-'}</div>
                      <div className="text-gray-900 dark:text-gray-100 mb-1"><b>DNI:</b> {venta.vendedor_dni || '-'}</div>
                    </div>
                    {/* Comprador */}
                    <div>
                      <div className="text-lg font-bold text-blue-800 dark:text-blue-200 mb-2">Comprador</div>
                      <div className="text-gray-900 dark:text-gray-100 mb-1"><b>Nombre:</b> {venta.comprador_nombre} {venta.comprador_apellido}</div>
                      <div className="text-gray-900 dark:text-gray-100 mb-1"><b>Email:</b> {venta.comprador_email}</div>
                      <div className="text-gray-900 dark:text-gray-100 mb-1"><b>Teléfono:</b> {venta.comprador_telefono || '-'}</div>
                      <div className="text-gray-900 dark:text-gray-100 mb-1"><b>Nombre del local:</b> {venta.comprador_nombre_local || '-'}</div>
                      <div className="text-gray-900 dark:text-gray-100 mb-1"><b>Localidad:</b> {venta.comprador_localidad || '-'}</div>
                      <div className="text-gray-900 dark:text-gray-100 mb-1"><b>DNI:</b> {venta.comprador_dni || '-'}</div>
                    </div>
                    {/* Envío */}
                    <div>
                      <div className="text-lg font-bold text-blue-800 dark:text-blue-200 mb-2">Datos de envío</div>
                      <div className="text-gray-900 dark:text-gray-100 mb-1"><b>Localidad:</b> {venta.localidad_envio || '-'}</div>
                      <div className="text-gray-900 dark:text-gray-100 mb-1"><b>Dirección:</b> {venta.direccion_envio || '-'}</div>
                      <div className="text-gray-900 dark:text-gray-100 mb-1"><b>Altura:</b> {venta.altura_envio || '-'}</div>
                      <div className="text-gray-900 dark:text-gray-100 mb-1"><b>Entre calles:</b> {venta.entrecalles_envio || '-'}</div>
                    </div>
                    {/* Pago recibido */}
                    <div className="flex flex-col justify-center">
                      <div className="text-lg font-bold text-blue-800 dark:text-blue-200 mb-2">Pago recibido</div>
                      <span className={venta.pago_recibido ? "text-green-700 dark:text-green-400 font-bold" : "text-red-700 dark:text-red-400 font-bold"}>
                        {venta.pago_recibido ? 'Sí' : 'No'}
                      </span>
                      <Button
                        size="sm"
                        className={`mt-3 ${venta.pago_recibido ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white`}
                        onClick={() => handleAprobarPago(venta.id, !venta.pago_recibido)}
                      >
                        {venta.pago_recibido ? 'Desaprobar' : 'Aprobar'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default AdminVentas;