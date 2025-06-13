import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Loader2 } from 'lucide-react';

const MotionButton = motion(Button);

const API_URL = 'https://web-autopartes-backend.onrender.com';

function AdminCuentas() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editUserId, setEditUserId] = useState(null);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  // Para modo oscuro
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // Traer todos los usuarios
  const fetchUsuarios = () => {
    setLoading(true);
    fetch(`${API_URL}/usuarios`)
      .then(res => res.json())
      .then(data => setUsuarios(data))
      .catch(() => setUsuarios([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Editar usuario
  const handleEdit = (user) => {
    setEditUserId(user.id);
    setEditData({
      ...user,
      email: user.email || '',
      password: user.password || '',
      tipo_cuenta: user.tipo_cuenta || '',
      nombre: user.nombre || '',
      apellido: user.apellido || '',
      nombre_local: user.nombre_local || '',
      localidad: user.localidad || '',
      dni: user.dni || '',
      telefono: user.telefono || '',
      cashback: user.cashback !== null && user.cashback !== undefined ? user.cashback : '',
    });
  };

  // Guardar cambios
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/usuarios/${editUserId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });
      if (res.ok) {
        const updated = await res.json();
        setUsuarios(usuarios.map(u => (u.id === editUserId ? updated.usuario : u)));
        setEditUserId(null);
      } else {
        alert('Error al guardar cambios');
      }
    } catch {
      alert('Error de conexión');
    } finally {
      setSaving(false);
    }
  };

  // Aprobar/rechazar constancias
  const handleAprobar = async (userId, campo, valor) => {
    // Enviar ambos campos de aprobación para evitar que se pisen entre sí
    const user = usuarios.find(u => u.id === userId);
    const body = {
      aprobado_constancia_afip:
        campo === 'aprobado_constancia_afip'
          ? valor
          : user.aprobado_constancia_afip === true || user.aprobado_constancia_afip === 'true',
      aprobado_certificado_estudio:
        campo === 'aprobado_certificado_estudio'
          ? valor
          : user.aprobado_certificado_estudio === true || user.aprobado_certificado_estudio === 'true',
    };
    try {
      const res = await fetch(`${API_URL}/usuarios/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const updated = await res.json();
        setUsuarios(usuarios =>
          usuarios.map(u =>
            u.id === userId ? updated.usuario : u
          )
        );
      } else {
        alert('Error al actualizar aprobación');
      }
    } catch {
      alert('Error de conexión');
    }
  };

  // Utilidad para mostrar valores en los inputs (evita null)
  const safeValue = v => v === null || v === undefined ? '' : v;

  // Filtrado por búsqueda
  const usuariosFiltrados = usuarios.filter(u => {
    const texto = `${u.nombre} ${u.apellido} ${u.email} ${u.dni}`.toLowerCase();
    return texto.includes(search.toLowerCase());
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative flex flex-col items-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4 py-10"
    >
      {/* Botón toggle modo oscuro */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition"
        aria-label="Toggle Dark Mode"
        title={isDarkMode ? 'Modo claro' : 'Modo oscuro'}
      >
        {isDarkMode ? '🌙' : '☀️'}
      </button>

      {/* Botón Volver y Buscador */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <Button
          onClick={() => navigate(-1)}
          className="bg-gray-300 hover:bg-gray-400 text-gray-900 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
        >
          ← Volver
        </Button>
        <Input
          type="text"
          placeholder="Buscar por nombre, apellido, email o DNI..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full md:w-80 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
      </div>

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-extrabold mb-8 text-blue-900 dark:text-blue-200 drop-shadow"
      >
        Administración de Cuentas
      </motion.h1>

      {loading ? (
        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-200">
          <Loader2 className="animate-spin" /> Cargando usuarios...
        </div>
      ) : usuariosFiltrados.length === 0 ? (
        <div className="text-gray-700 dark:text-gray-200">No hay usuarios registrados.</div>
      ) : (
        <div className="w-full max-w-5xl flex flex-col gap-8">
          {usuariosFiltrados.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4">
                <CardHeader>
                  <CardTitle className="text-xl text-blue-900 dark:text-blue-100 flex items-center gap-2">
                    {user.nombre} {user.apellido}
                    <span className="text-xs text-gray-500 ml-2">ID: {user.id}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {editUserId === user.id ? (
                    <form
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      onSubmit={e => {
                        e.preventDefault();
                        handleSave();
                      }}
                    >
                      <div>
                        <Label className="text-gray-900 dark:text-gray-100">Email</Label>
                        <Input
                          value={safeValue(editData.email)}
                          onChange={e => setEditData({ ...editData, email: e.target.value })}
                          required
                          className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-900 dark:text-gray-100">Contraseña</Label>
                        <Input
                          value={safeValue(editData.password)}
                          onChange={e => setEditData({ ...editData, password: e.target.value })}
                          required
                          className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-900 dark:text-gray-100">Tipo de cuenta</Label>
                        <select
                          value={safeValue(editData.tipo_cuenta)}
                          onChange={e => setEditData({ ...editData, tipo_cuenta: e.target.value })}
                          className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2"
                        >
                          <option value="mecanico">Mecánico</option>
                          <option value="vendedor">Vendedor</option>
                        </select>
                      </div>
                      <div>
                        <Label className="text-gray-900 dark:text-gray-100">Nombre</Label>
                        <Input
                          value={safeValue(editData.nombre)}
                          onChange={e => setEditData({ ...editData, nombre: e.target.value })}
                          className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-900 dark:text-gray-100">Apellido</Label>
                        <Input
                          value={safeValue(editData.apellido)}
                          onChange={e => setEditData({ ...editData, apellido: e.target.value })}
                          className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-900 dark:text-gray-100">Nombre local</Label>
                        <Input
                          value={safeValue(editData.nombre_local)}
                          onChange={e => setEditData({ ...editData, nombre_local: e.target.value })}
                          className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-900 dark:text-gray-100">Localidad</Label>
                        <Input
                          value={safeValue(editData.localidad)}
                          onChange={e => setEditData({ ...editData, localidad: e.target.value })}
                          className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-900 dark:text-gray-100">DNI</Label>
                        <Input
                          value={safeValue(editData.dni)}
                          onChange={e => setEditData({ ...editData, dni: e.target.value })}
                          className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-900 dark:text-gray-100">Teléfono</Label>
                        <Input
                          value={safeValue(editData.telefono)}
                          onChange={e => setEditData({ ...editData, telefono: e.target.value })}
                          className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-900 dark:text-gray-100">Cashback</Label>
                        <Input
                          type="number"
                          value={safeValue(editData.cashback)}
                          onChange={e => setEditData({ ...editData, cashback: e.target.value })}
                          className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                      <div className="col-span-2 flex gap-4 mt-2">
                        <MotionButton
                          type="submit"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          disabled={saving}
                        >
                          {saving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : 'Guardar'}
                        </MotionButton>
                        <MotionButton
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-gray-500 hover:bg-gray-600 text-white"
                          onClick={() => setEditUserId(null)}
                          disabled={saving}
                        >
                          Cancelar
                        </MotionButton>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="text-gray-900 dark:text-gray-100"><b>Email:</b> {user.email}</div>
                      <div className="text-gray-900 dark:text-gray-100"><b>Contraseña:</b> {user.password}</div>
                      <div className="text-gray-900 dark:text-gray-100"><b>Tipo de cuenta:</b> {user.tipo_cuenta}</div>
                      <div className="text-gray-900 dark:text-gray-100"><b>Nombre:</b> {user.nombre}</div>
                      <div className="text-gray-900 dark:text-gray-100"><b>Apellido:</b> {user.apellido}</div>
                      <div className="text-gray-900 dark:text-gray-100"><b>Nombre local:</b> {user.nombre_local || '-'}</div>
                      <div className="text-gray-900 dark:text-gray-100"><b>Localidad:</b> {user.localidad}</div>
                      <div className="text-gray-900 dark:text-gray-100"><b>DNI:</b> {user.dni}</div>
                      <div className="text-gray-900 dark:text-gray-100"><b>Teléfono:</b> {user.telefono}</div>
                      <div className="text-gray-900 dark:text-gray-100"><b>Cashback:</b> ${Number(user.cashback).toFixed(2)}</div>
                      <div className="col-span-2 flex gap-4 mt-2">
                        <MotionButton
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => handleEdit(user)}
                        >
                          Editar
                        </MotionButton>
                      </div>
                    </div>
                  )}

                  {/* Constancias y aprobación */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Constancia AFIP */}
                    <div className="flex flex-col items-start">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">Constancia AFIP:</span>
                      {user.constancia_afip_url ? (
                        <a
                          href={user.constancia_afip_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-300 underline"
                        >
                          Ver archivo
                        </a>
                      ) : (
                        <span className="text-gray-500">No cargada</span>
                      )}
                      <div className="flex gap-2 mt-2">
                        <MotionButton
                          size="sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-2 py-1 rounded ${user.aprobado_constancia_afip ? 'bg-green-600' : 'bg-gray-400'} text-white`}
                          onClick={() => handleAprobar(user.id, 'aprobado_constancia_afip', !user.aprobado_constancia_afip)}
                        >
                          {user.aprobado_constancia_afip ? 'Aprobada' : 'Aprobar'}
                        </MotionButton>
                      </div>
                    </div>
                    {/* Certificado de estudio */}
                    <div className="flex flex-col items-start">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">Certificado de estudio:</span>
                      {user.certificado_estudio_url ? (
                        <a
                          href={user.certificado_estudio_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-300 underline"
                        >
                          Ver archivo
                        </a>
                      ) : (
                        <span className="text-gray-500">No cargado</span>
                      )}
                      <div className="flex gap-2 mt-2">
                        <MotionButton
                          size="sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-2 py-1 rounded ${user.aprobado_certificado_estudio ? 'bg-green-600' : 'bg-gray-400'} text-white`}
                          onClick={() => handleAprobar(user.id, 'aprobado_certificado_estudio', !user.aprobado_certificado_estudio)}
                        >
                          {user.aprobado_certificado_estudio ? 'Aprobado' : 'Aprobar'}
                        </MotionButton>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default AdminCuentas;