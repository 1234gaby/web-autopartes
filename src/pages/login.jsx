import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Función para hacer login
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://web-autopartes-backend.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login exitoso:', data);
        
        // Guardar el user_id en localStorage
        localStorage.setItem('user_id', data.user_id); // Aquí guardamos el user_id

        // Navegar a la página principal
        navigate('/home');
      } else {
        alert('Login incorrecto');
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      alert('Error de conexión al servidor');
    }
  };

  // Función para continuar como invitado
  const continuarComoInvitado = () => {
    navigate('/home');
  };

  // Función para ir a la pantalla de registro
  const irARegistro = () => {
    navigate('/register');
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Iniciar sesión</button>
      </form>

      <br />

      <button onClick={irARegistro}>Registrarse</button>
      <button onClick={continuarComoInvitado}>Continuar como invitado</button>
    </div>
  );
}

export default Login;
