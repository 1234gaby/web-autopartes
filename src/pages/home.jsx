import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-2xl font-bold mb-6">Bienvenido al Home</h1>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => navigate('/crear-publicacion')}
      >
        Crear publicación
      </button>
    </div>
  );
}

export default Home;
