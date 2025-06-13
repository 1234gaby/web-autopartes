import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { LoadingOverlay } from '../components/ui/LoadingOverlay';
import axios from 'axios';

const MotionButton = motion(Button);

const MiCuenta = () => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Refresca datos al volver a la pestaña
  useEffect(() => {
    const fetchUsuario = () => {
      const userId = localStorage.getItem('user_id');
      if (!userId) return;
      setLoading(true);
      axios.get(`https://web-autopartes-backend.onrender.com/usuarios/${userId}`)
        .then(res => setUsuario(res.data))
        .catch(err => console.error('Error al cargar usuario', err))
        .finally(() => setLoading(false));
    };
    fetchUsuario();
    window.addEventListener('focus', fetchUsuario);
    return () => window.removeEventListener('focus', fetchUsuario);
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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <LoadingOverlay loading={true} />
      <div className="text-center py-10 text-gray-600 dark:text-gray-400">Cargando...</div>
    </div>
  );

  // Estados SI/NO para constancias y certificados
  const afipCargada = usuario.constancia_afip_url ? 'SI' : 'NO';
  const afipAprobada = usuario.aprobado_constancia_afip === true || usuario.aprobado_constancia_afip === 'true';
  const estudioCargado = usuario.certificado_estudio_url ? 'SI' : 'NO';
  const estudioAprobado = usuario.aprobado_certificado_estudio === true || usuario.aprobado_certificado_estudio === 'true';

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
      className="relative flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4"
    >
      <LoadingOverlay loading={loading} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div className="p-8 bg-white/90 dark:bg-gray-900/90 rounded-3xl shadow-2xl border border-blue-100 dark:border-gray-800 backdrop-blur-md transition-colors duration-300">
          <h1 className="text-3xl font-extrabold mb-8 text-blue-900 dark:text-blue-100 tracking-tight flex items-center gap-3">
            <span className="inline-block bg-gradient-to-r from-blue-500 to-blue-300 dark:from-blue-700 dark:to-blue-400 text-white px-4 py-2 rounded-2xl shadow">
              Mi Cuenta
            </span>
          </h1>

          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 dark:text-gray-200">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-blue-700 dark:text-blue-300">ID:</span>
                <span>{usuario.id}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-blue-700 dark:text-blue-300">DNI:</span>
                <span>{usuario.dni}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-blue-700 dark:text-blue-300">Contraseña:</span>
                <span>{usuario.contrasena || usuario.password || 'No disponible'}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-blue-700 dark:text-blue-300">Nombre:</span>
                <span>{usuario.nombre}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-blue-700 dark:text-blue-300">Apellido:</span>
                <span>{usuario.apellido}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-blue-700 dark:text-blue-300">Email:</span>
                <span>{usuario.email}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-blue-700 dark:text-blue-300">Tipo de cuenta:</span>
                <span className="capitalize">{usuario.tipo_cuenta}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-blue-700 dark:text-blue-300">Teléfono:</span>
                <span>{usuario.telefono || '-'}</span>
              </div>
              {esVendedor && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-blue-700 dark:text-blue-300">Nombre del local:</span>
                  <span>{usuario.nombre_local || '-'}</span>
                </div>
              )}
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-blue-700 dark:text-blue-300">Cashback acumulado:</span>
                <span className="font-mono text-green-700 dark:text-green-300">${cashbackMostrado}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span className="font-semibold text-blue-700 dark:text-blue-300">Constancia de AFIP / ARCA:</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold
                    ${afipCargada === 'SI'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                    {afipCargada}
                  </span>
                  {usuario.constancia_afip_url && (
                    <a
                      href={usuario.constancia_afip_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-300 underline font-medium"
                    >
                      Ver archivo
                    </a>
                  )}
                  <span
                    className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold border
                      ${afipAprobada
                        ? 'bg-green-100 text-green-800 border-green-400'
                        : 'bg-gray-200 text-gray-700 border-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-500'
                      }`}
                  >
                    {afipAprobada ? 'Aprobada' : 'No aprobada'}
                  </span>
                </div>
              </div>
              {!esVendedor && (
                <div>
                  <span className="font-semibold text-blue-700 dark:text-blue-300">Certificado de estudio:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold
                      ${estudioCargado === 'SI'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                      }`}>
                      {estudioCargado}
                    </span>
                    {usuario.certificado_estudio_url && (
                      <a
                        href={usuario.certificado_estudio_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-300 underline font-medium"
                      >
                        Ver archivo
                      </a>
                    )}
                    <span
                      className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold border
                        ${estudioAprobado
                          ? 'bg-green-100 text-green-800 border-green-400'
                          : 'bg-gray-200 text-gray-700 border-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-500'
                        }`}
                    >
                      {estudioAprobado ? 'Aprobado' : 'No aprobado'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 justify-end">
            <MotionButton
              onClick={handleVolver}
              className="px-5 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 shadow transition"
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Volver
            </MotionButton>

            <MotionButton
              onClick={handleCerrarSesion}
              className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 shadow transition"
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cerrar sesión
            </MotionButton>

            <MotionButton
              onClick={() => navigate('/editar-perfil')}
              className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow transition"
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Editar perfil
            </MotionButton>

            {!esVendedor && (
              <MotionButton
                onClick={() => navigate('/mis-compras')}
                className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 shadow transition"
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Mis compras
              </MotionButton>
            )}
            {esVendedor && (
              <>
                <MotionButton
                  onClick={() => navigate('/mis-ventas')}
                  className="px-5 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700 shadow transition"
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Mis ventas
                </MotionButton>
                <MotionButton
                  onClick={() => navigate('/mis-publicaciones')}
                  className="px-5 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 shadow transition"
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Mis publicaciones
                </MotionButton>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MiCuenta;