import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MiCuenta = () => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (!userId) return;

    axios.get(`https://web-autopartes-backend.onrender.com/usuarios/${userId}`)
      .then(res => setUsuario(res.data))
      .catch(err => console.error('Error al cargar usuario', err));
  }, []);

  const handleCerrarSesion = () => {
    localStorage.removeItem('user_id');
    window.location.href = '/login'; // o la ruta que uses para login
  };

  const handleVolver = () => {
    window.history.back();
  };

  if (!usuario) return <div className="text-center py-10 text-gray-600 dark:text-gray-400">Cargando...</div>;

  return (
    <div className="p-6 max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-md shadow-md transition-colors duration-300">
      <h1 className="text-2xl font-extrabold mb-6 text-gray-900 dark:text-gray-100">Mi Cuenta</h1>

      <p className="mb-2 text-gray-700 dark:text-gray-300"><strong>Email:</strong> {usuario.email}</p>
      <p className="mb-4 text-gray-700 dark:text-gray-300"><strong>Tipo de cuenta:</strong> {usuario.tipo_cuenta}</p>

      {usuario.tipo_cuenta === 'mecanico' && (
        <>
          <p className="mb-2 text-gray-700 dark:text-gray-300"><strong>Nombre:</strong> {usuario.nombre}</p>
          <p className="mb-2 text-gray-700 dark:text-gray-300"><strong>Apellido:</strong> {usuario.apellido}</p>

          <p className="mb-2 text-gray-700 dark:text-gray-300">
            <strong>Certificado de Estudio:</strong>{' '}
            {usuario.certificado_estudio_url
              ? <a href={usuario.certificado_estudio_url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Ver archivo</a>
              : 'No cargado'}
          </p>

          <p className="mb-2 text-gray-700 dark:text-gray-300"><strong>Estado Certificado:</strong> {usuario.aprobado_certificado_estudio ? 'Aprobado' : 'Pendiente'}</p>

          <p className="mb-2 text-gray-700 dark:text-gray-300">
            <strong>Constancia AFIP/ARCA:</strong>{' '}
            {usuario.constancia_afip_url
              ? <a href={usuario.constancia_afip_url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Ver archivo</a>
              : 'No cargado'}
          </p>

          <p className="mb-4 text-gray-700 dark:text-gray-300"><strong>Estado Constancia AFIP/ARCA:</strong> {usuario.aprobado_constancia_afip ? 'Aprobado' : 'Pendiente'}</p>
        </>
      )}

      {usuario.tipo_cuenta === 'vendedor' && (
        <>
          <p className="mb-2 text-gray-700 dark:text-gray-300"><strong>Nombre del local:</strong> {usuario.nombre_local}</p>
          <p className="mb-2 text-gray-700 dark:text-gray-300"><strong>Localidad:</strong> {usuario.localidad}</p>
          <p className="mb-2 text-gray-700 dark:text-gray-300"><strong>DNI:</strong> {usuario.dni}</p>

          <p className="mb-2 text-gray-700 dark:text-gray-300">
            <strong>Constancia AFIP/ARCA:</strong>{' '}
            {usuario.constancia_afip_url
              ? <a href={usuario.constancia_afip_url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Ver archivo</a>
              : 'No subido'}
          </p>

          <p className="mb-4 text-gray-700 dark:text-gray-300"><strong>Estado Constancia AFIP/ARCA:</strong> {usuario.aprobado_constancia_afip ? 'Aprobado' : 'Pendiente'}</p>
        </>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={handleVolver}
          className="px-5 py-2 rounded bg-gray-500 text-white hover:bg-gray-600 transition"
          type="button"
        >
          Volver
        </button>

        <button
          onClick={handleCerrarSesion}
          className="px-5 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
          type="button"
        >
          Cerrar sesión
        </button>

        <button
          onClick={() => window.location.href = '/editar-perfil'}
          className="px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
          type="button"
        >
          Editar perfil
        </button>

        <button
          onClick={() => window.location.href = '/mis-compras'}
          className="px-5 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition"
          type="button"
        >
          Mis compras
        </button>
      </div>
    </div>
  );
};

export default MiCuenta;
