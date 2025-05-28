import { useNavigate } from 'react-router-dom';

const RegisterSuccess = () => {
  const navigate = useNavigate();

  console.log('Cargó RegisterSuccess'); // <- Esto debe ir acá, antes del return

  return (
    <div className="text-center mt-10">
      <h2 className="text-2xl font-bold text-green-600">✅ Registro exitoso</h2>
      <p className="mt-2">Ya podés iniciar sesión con tu cuenta.</p>
      <button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => navigate('/')}
      >
        Ir al login
      </button>
    </div>
  );
};

export default RegisterSuccess;


