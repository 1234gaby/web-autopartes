import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { LoadingOverlay } from '../components/ui/LoadingOverlay';
import axios from 'axios';

const MotionButton = motion.create(Button);

const MiCuenta = () => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (!userId) return;

    setLoading(true);
    // Traer datos del usuario
    axios.get(`https://web-autopartes-backend.onrender.com/usuarios/${userId}`)
      .then(res => setUsuario(res.data))
      .catch(err => console.error('Error al cargar usuario', err))
      .finally(() => setLoading(false));
  }, []);

  const handleCerrarSesion = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('perfil');
    navigate('/');
  };

  const handleVolver = () => {
    navigate('/home');
  };

  if (!usuario) return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <LoadingOverlay loading={true} />
      <div className="text-center py-10 text-gray-600 dark:text-gray-400">Cargando...</div>
    </div>
  );

  // Estados SI/NO para constancias y certificados
  const afipCargada = usuario.constancia_afip_url ? 'SI' : 'NO';
  const afipAprobada = usuario.constancia_afip_aprobada === true ? 'SI' : 'NO';
  const estudioCargado = usuario.certificado_estudio_url ? 'SI' : 'NO';
  const estudioAprobado = usuario.certificado_estudio_aprobado === true ? 'SI' : 'NO';

  const esVendedor = usuario.tipo_cuenta === 'vendedor';

  // Mostrar cashback correctamente aunque sea null, string o undefined
  let cashbackMostrado = '0.00';
  if (
    usuario.cashback !== null &&
    usuario.cashback !== undefined &&
    !isNaN(Number(usuario.cashback))
  ) {
    cashbackMostrado = Number(usuario.cashback).toFixed(2);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4"
    >
      <LoadingOverlay loading={loading} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl"
      >
        <div className="p-6 bg-white dark:bg-gray-800 rounded-md shadow-md transition-colors duration-300">
          <h1 className="text-2xl font-extrabold mb-6 text-gray-900 dark:text-gray-100">Mi Cuenta</h1>

          <div className="mb-6 space-y-2 text-gray-700 dark:text-gray-300">
            <p><strong>ID:</strong> {usuario.id}</p>
            <p><strong>DNI:</strong> {usuario.dni}</p>
            <p><strong>Contraseña:</strong> {usuario.contrasena || usuario.password || 'No disponible'}</p>
            <p><strong>Nombre:</strong> {usuario.nombre}</p>
            <p><strong>Apellido:</strong> {usuario.apellido}</p>
            <p><strong>Email:</strong> {usuario.email}</p>
            <p><strong>Tipo de cuenta:</strong> {usuario.tipo_cuenta}</p>
            <p><strong>Teléfono:</strong> {usuario.telefono || '-'}</p>
            {esVendedor && (
              <p><strong>Nombre del local:</strong> {usuario.nombre_local || '-'}</p>
            )}
            {/* Mostrar cashback */}
            <p>
              <strong>Cashback acumulado:</strong> ${cashbackMostrado}
            </p>
          </div>

          <div className="mb-6 space-y-2 text-gray-700 dark:text-gray-300 pt-4 border-t border-gray-300 dark:border-gray-700">
            <p>
              <strong>Constancia de AFIP / ARCA cargada:</strong> {afipCargada}
            </p>
            <p>
              <strong>Constancia de AFIP / ARCA aprobada:</strong> {afipAprobada}
            </p>
            {!esVendedor && (
              <>
                <p>
                  <strong>Certificado de estudio cargado:</strong> {estudioCargado}
                </p>
                <p>
                  <strong>Certificado de estudio aprobado:</strong> {estudioAprobado}
                </p>
              </>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <MotionButton
              onClick={handleVolver}
              className="px-5 py-2 rounded bg-gray-500 text-white hover:bg-gray-600 transition"
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Volver
            </MotionButton>

            <MotionButton
              onClick={handleCerrarSesion}
              className="px-5 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cerrar sesión
            </MotionButton>

            <MotionButton
              onClick={() => navigate('/editar-perfil')}
              className="px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Editar perfil
            </MotionButton>

            <MotionButton
              onClick={() => navigate('/mis-compras')}
              className="px-5 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition"
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Mis compras
            </MotionButton>

            {esVendedor && (
              <MotionButton
                onClick={() => navigate('/mis-publicaciones')}
                className="px-5 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 transition"
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Mis publicaciones
              </MotionButton>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MiCuenta;