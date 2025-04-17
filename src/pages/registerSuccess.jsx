import React from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterSuccess() {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Usuario creado con éxito ✅</h2>
      <p>Ahora podés iniciar sesión.</p>
      <button onClick={() => navigate('/')}>Ingresar</button>
    </div>
  );
}

export default RegisterSuccess;
