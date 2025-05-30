import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [tipoCuenta, setTipoCuenta] = useState('mecanico');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [nombreLocal, setNombreLocal] = useState('');
  const [localidad, setLocalidad] = useState('');
  const [dni, setDni] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Archivos opcionales
  const [afipFile, setAfipFile] = useState(null);
  const [certificadoFile, setCertificadoFile] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('tipoCuenta', tipoCuenta);
    formData.append('nombre', nombre);
    formData.append('apellido', apellido);
    formData.append('localidad', localidad);
    formData.append('dni', dni);
    formData.append('email', email);
    formData.append('password', password);

    if (tipoCuenta === 'vendedor') {
      formData.append('nombreLocal', nombreLocal);
    }

    if (afipFile) {
      formData.append('constanciaAfip', afipFile);
    }

    if (certificadoFile) {
      formData.append('certificadoEstudio', certificadoFile);
    }

    try {
      const res = await fetch('https://web-autopartes-backend.onrender.com/register', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert('Registro exitoso');
        navigate('/login');
      } else {
        alert(data.message || 'Error en registro');
      }
    } catch (error) {
      alert('Error de conexión al servidor');
      console.error(error);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Registro</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label>
          Tipo de cuenta:
          <select
            value={tipoCuenta}
            onChange={(e) => setTipoCuenta(e.target.value)}
            className="ml-2 border rounded px-2 py-1"
          >
            <option value="mecanico">Mecánico</option>
            <option value="vendedor">Vendedor</option>
          </select>
        </label>

        {tipoCuenta === 'mecanico' && (
          <>
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="block w-full border rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="Apellido"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              required
              className="block w-full border rounded px-3 py-2"
            />
            <label>
              Certificado de estudio (opcional):
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setCertificadoFile(e.target.files[0])}
                className="block"
              />
            </label>
          </>
        )}

        {tipoCuenta === 'vendedor' && (
          <>
            <input
              type="text"
              placeholder="Nombre del local"
              value={nombreLocal}
              onChange={(e) => setNombreLocal(e.target.value)}
              required
              className="block w-full border rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="Localidad"
              value={localidad}
              onChange={(e) => setLocalidad(e.target.value)}
              required
              className="block w-full border rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="DNI"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              required
              className="block w-full border rounded px-3 py-2"
            />
            <label>
              Constancia de AFIP (opcional):
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setAfipFile(e.target.files[0])}
                className="block"
              />
            </label>
          </>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="block w-full border rounded px-3 py-2"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="block w-full border rounded px-3 py-2"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
}

export default Register;
