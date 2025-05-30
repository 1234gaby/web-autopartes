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

  if (!usuario) return <div>Cargando...</div>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Mi Cuenta</h1>

      <p><strong>Email:</strong> {usuario.email}</p>
      <p><strong>Tipo de cuenta:</strong> {usuario.tipo_cuenta}</p>

      {usuario.tipo_cuenta === 'mecanico' && (
        <>
          <p><strong>Nombre:</strong> {usuario.nombre}</p>
          <p><strong>Apellido:</strong> {usuario.apellido}</p>

          <p><strong>Certificado de Estudio:</strong> {usuario.certificado_estudio_url 
            ? <a href={usuario.certificado_estudio_url} target="_blank" rel="noreferrer">Ver archivo</a> 
            : 'No subido'}</p>

          <p><strong>Estado Certificado:</strong> {usuario.aprobado_certificado_estudio ? 'Aprobado' : 'Pendiente'}</p>

          <p><strong>Constancia AFIP/ARCA:</strong> {usuario.constancia_afip_url 
            ? <a href={usuario.constancia_afip_url} target="_blank" rel="noreferrer">Ver archivo</a> 
            : 'No subido'}</p>

          <p><strong>Estado Constancia AFIP/ARCA:</strong> {usuario.aprobado_constancia_afip ? 'Aprobado' : 'Pendiente'}</p>
        </>
      )}

      {usuario.tipo_cuenta === 'vendedor' && (
        <>
          <p><strong>Nombre del local:</strong> {usuario.nombre_local}</p>
          <p><strong>Localidad:</strong> {usuario.localidad}</p>
          <p><strong>DNI:</strong> {usuario.dni}</p>

          <p><strong>Constancia AFIP/ARCA:</strong> {usuario.constancia_afip_url 
            ? <a href={usuario.constancia_afip_url} target="_blank" rel="noreferrer">Ver archivo</a> 
            : 'No subido'}</p>

          <p><strong>Estado Constancia AFIP/ARCA:</strong> {usuario.aprobado_constancia_afip ? 'Aprobado' : 'Pendiente'}</p>
        </>
      )}

      <div className="mt-6 space-x-4">
        <button onClick={handleVolver} className="bg-gray-500 text-white px-4 py-2 rounded">Volver</button>
        <button onClick={handleCerrarSesion} className="bg-red-600 text-white px-4 py-2 rounded">Cerrar sesión</button>
        <button onClick={() => window.location.href = '/editar-perfil'} className="bg-blue-600 text-white px-4 py-2 rounded">Editar perfil</button>
        <button onClick={() => window.location.href = '/mis-compras'} className="bg-green-600 text-white px-4 py-2 rounded">Mis compras</button>
      </div>
    </div>
  );
};

export default MiCuenta;
