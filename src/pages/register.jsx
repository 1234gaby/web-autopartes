import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('https://web-autopartes-backend.onrender.com/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
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
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-4 max-w-sm mx-auto mt-10"
    >
      <input
        type="email"
        placeholder="Email"
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
      <button
        type="submit"
        className="bg-green-600 text-white p-2 rounded"
      >
        Registrarse
      </button>

      {/* Botón para volver al login */}
      <button
        type="button"
        className="bg-gray-500 text-white p-2 rounded"
        onClick={() => navigate('/')}
      >
        Volver al login
      </button>
    </form>
  );
}

export default Register;
