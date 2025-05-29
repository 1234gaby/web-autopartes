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
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        navigate('/registersuccess');
      } else {
        alert(data.mensaje || 'Error al registrar');
      }
    } catch (error) {
      alert('Error de conexión al servidor');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 max-w-md mx-auto mt-10 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold text-center">Registro de cuenta</h2>

      <select
        value={tipoCuenta}
        onChange={(e) => setTipoCuenta(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="mecanico">Mecánico</option>
        <option value="vendedor">Vendedor</option>
      </select>

      {tipoCuenta === 'vendedor' && (
        <input
          type="text"
          placeholder="Nombre del local"
          value={nombreLocal}
          onChange={(e) => setNombreLocal(e.target.value)}
          className="border p-2 rounded"
          required
        />
      )}

      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className="border p-2 rounded"
        required
      />

      <input
        type="text"
        placeholder="Apellido"
        value={apellido}
        onChange={(e) => setApellido(e.target.value)}
        className="border p-2 rounded"
        required
      />

      <input
        type="text"
        placeholder="Localidad"
        value={localidad}
        onChange={(e) => setLocalidad(e.target.value)}
        className="border p-2 rounded"
        required
      />

      <input
        type="text"
        placeholder="DNI"
        value={dni}
        onChange={(e) => setDni(e.target.value)}
        className="border p-2 rounded"
        required
      />

      <input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded"
        required
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded"
        required
      />

      <div>
        <label className="block font-semibold">Constancia AFIP (opcional, se puede cargar luego):</label>
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => setAfipFile(e.target.files[0])}
          className="mt-1"
        />
      </div>

      <div>
        <label className="block font-semibold">Certificado de estudio (opcional, se puede cargar luego):</label>
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => setCertificadoFile(e.target.files[0])}
          className="mt-1"
        />
      </div>

      <button type="submit" className="bg-green-600 text-white p-2 rounded">Registrarse</button>

      <button type="button" className="bg-gray-500 text-white p-2 rounded" onClick={() => navigate('/')}>
        Volver al login
      </button>
    </form>
  );
}

export default Register;
