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
    <div className="p-6 max-w-lg mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg mt-8
                    border border-gray-200 dark:border-gray-700">
      <h1 className="text-2xl font-extrabold mb-6 text-center text-gray-800 dark:text-gray-100">
        Registro
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <label className="block">
          <span className="text-gray-700 dark:text-gray-300 font-semibold">Tipo de cuenta:</span>
          <select
            value={tipoCuenta}
            onChange={(e) => setTipoCuenta(e.target.value)}
            className="mt-1 block w-full rounded border border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                       px-3 py-2
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                       transition duration-200 ease-in-out"
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
              className="block w-full border border-gray-300 dark:border-gray-600 rounded
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                         px-4 py-2
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         transition duration-200 ease-in-out"
            />
            <input
              type="text"
              placeholder="Apellido"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              required
              className="block w-full border border-gray-300 dark:border-gray-600 rounded
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                         px-4 py-2
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         transition duration-200 ease-in-out"
            />
            <label className="block">
              <span className="text-gray-700 dark:text-gray-300 font-semibold">
                Certificado de estudio (opcional):
              </span>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setCertificadoFile(e.target.files[0])}
                className="mt-1 block w-full text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 rounded"
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
              className="block w-full border border-gray-300 dark:border-gray-600 rounded
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                         px-4 py-2
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         transition duration-200 ease-in-out"
            />
            <input
              type="text"
              placeholder="Localidad"
              value={localidad}
              onChange={(e) => setLocalidad(e.target.value)}
              required
              className="block w-full border border-gray-300 dark:border-gray-600 rounded
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                         px-4 py-2
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         transition duration-200 ease-in-out"
            />
            <input
              type="text"
              placeholder="DNI"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              required
              className="block w-full border border-gray-300 dark:border-gray-600 rounded
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                         px-4 py-2
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         transition duration-200 ease-in-out"
            />
            <label className="block">
              <span className="text-gray-700 dark:text-gray-300 font-semibold">
                Constancia de AFIP (opcional):
              </span>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setAfipFile(e.target.files[0])}
                className="mt-1 block w-full text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 rounded"
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
          className="block w-full border border-gray-300 dark:border-gray-600 rounded
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     px-4 py-2
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     transition duration-200 ease-in-out"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="block w-full border border-gray-300 dark:border-gray-600 rounded
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     px-4 py-2
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     transition duration-200 ease-in-out"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300
                     text-white py-3 rounded-md
                     focus:outline-none transition duration-300 ease-in-out font-semibold"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
}

export default Register;
