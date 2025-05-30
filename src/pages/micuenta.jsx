import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MiCuenta = () => {
  const [usuario, setUsuario] = useState(null);
  const [certificadoEstudio, setCertificadoEstudio] = useState(null);
  const [constanciaAfip, setConstanciaAfip] = useState(null);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (!userId) return;

    axios.get(`https://web-autopartes-backend.onrender.com/usuarios/${userId}`)
      .then(res => setUsuario(res.data))
      .catch(err => console.error('Error al cargar usuario', err));
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!usuario) return;

    const formData = new FormData();

    if (usuario.tipo_cuenta === 'mecanico' && certificadoEstudio) {
      formData.append('certificadoEstudio', certificadoEstudio);
    }

    if (usuario.tipo_cuenta === 'vendedor' && constanciaAfip) {
      formData.append('constanciaAfip', constanciaAfip);
    }

    try {
      const res = await axios.post(
        `https://web-autopartes-backend.onrender.com/usuarios/${usuario.id}/documentos`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setMensaje('Documentos subidos correctamente');
      setUsuario(res.data);
    } catch (err) {
      console.error('Error al subir documentos', err);
      setMensaje('Hubo un error al subir los documentos');
    }
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
        </>
      )}

      {usuario.tipo_cuenta === 'vendedor' && (
        <>
          <p><strong>Nombre del local:</strong> {usuario.nombre_local}</p>
          <p><strong>Localidad:</strong> {usuario.localidad}</p>
          <p><strong>DNI:</strong> {usuario.dni}</p>
        </>
      )}

      <form onSubmit={handleUpload} className="mt-6 space-y-4">
        {usuario.tipo_cuenta === 'mecanico' && (
          <div>
            <label>Certificado de estudio:</label>
            <input
              type="file"
              onChange={(e) => setCertificadoEstudio(e.target.files[0])}
              accept="image/*,.pdf"
            />
          </div>
        )}

        {usuario.tipo_cuenta === 'vendedor' && (
          <div>
            <label>Constancia de AFIP:</label>
            <input
              type="file"
              onChange={(e) => setConstanciaAfip(e.target.files[0])}
              accept="image/*,.pdf"
            />
          </div>
        )}

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Subir documentos
        </button>
        {mensaje && <p className="text-green-600">{mensaje}</p>}
      </form>
    </div>
  );
};

export default MiCuenta;
