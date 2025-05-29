import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const navigate = useNavigate();
  const [publicaciones, setPublicaciones] = useState([]);
  const [filtros, setFiltros] = useState({
    marca: '',
    modelo: '',
    ubicacion: '',
    envio: '',
    estado: '',
  });
  const [orden, setOrden] = useState('');

  const modelosPorMarca = {
    ford: ['Fiesta', 'Focus', 'Mondeo', 'Ranger'],
    fiat: ['Palio', 'Punto', 'Siena', 'Cronos'],
    chevrolet: ['Corsa', 'Corsa Classic', 'Cruze', 'Onix'],
    volkswagen: ['Gol', 'Polo', 'Bora', 'Vento', 'Amarok'],
  };

  const localidadesBrown = [
    'Adrogué', 'Burzaco', 'Claypole', 'Don Orione', 'Glew', 'José Mármol',
    'Longchamps', 'Malvinas Argentinas', 'Ministro Rivadavia', 'Rafael Calzada', 'San José', 'Solano'
  ];

  const fetchPublicaciones = async () => {
    try {
      const res = await axios.get('https://web-autopartes-backend.onrender.com/publicaciones');
      setPublicaciones(res.data);
    } catch (error) {
      console.error('Error al cargar publicaciones', error);
    }
  };

  useEffect(() => {
    fetchPublicaciones();
  }, []);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    if (name === 'marca') {
      setFiltros({ ...filtros, marca: value, modelo: '' }); // resetear modelo
    } else {
      setFiltros({ ...filtros, [name]: value });
    }
  };

  const filtrarPublicaciones = () => {
    return publicaciones
      .filter(pub => (
        (!filtros.marca || pub.marca === filtros.marca) &&
        (!filtros.modelo || pub.modelo === filtros.modelo) &&
        (!filtros.ubicacion || pub.ubicacion === filtros.ubicacion) &&
        (!filtros.envio || pub.envio === filtros.envio) &&
        (!filtros.estado || pub.estado === filtros.estado)
      ))
      .sort((a, b) => {
        if (orden === 'precio') return a.precio - b.precio;
        if (orden === 'nombre') return a.nombre_producto.localeCompare(b.nombre_producto);
        return 0;
      });
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Encabezado y botones */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Publicaciones</h1>
        <div className="space-x-2">
          <button
            onClick={() => navigate('/crearpublicacion')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Crear Publicación
          </button>
          <button
            onClick={() => navigate('/micuenta')}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
          >
            Mi Cuenta
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('user_id');
              navigate('/');
            }}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <select name="marca" value={filtros.marca} onChange={handleFiltroChange} className="p-2 border rounded">
          <option value="">Marca</option>
          {Object.keys(modelosPorMarca).map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <select name="modelo" value={filtros.modelo} onChange={handleFiltroChange} className="p-2 border rounded">
          <option value="">Modelo</option>
          {(modelosPorMarca[filtros.marca] || []).map(mod => (
            <option key={mod} value={mod}>{mod}</option>
          ))}
        </select>

        <select name="ubicacion" value={filtros.ubicacion} onChange={handleFiltroChange} className="p-2 border rounded">
          <option value="">Ubicación</option>
          {localidadesBrown.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>

        <select name="envio" value={filtros.envio} onChange={handleFiltroChange} className="p-2 border rounded">
          <option value="">Envío</option>
          <option value="si">Sí</option>
          <option value="no">No</option>
        </select>

        <select name="estado" value={filtros.estado} onChange={handleFiltroChange} className="p-2 border rounded">
          <option value="">Estado</option>
          <option value="nuevo">Nuevo</option>
          <option value="usado">Usado</option>
        </select>

        <select value={orden} onChange={(e) => setOrden(e.target.value)} className="p-2 border rounded">
          <option value="">Ordenar por</option>
          <option value="nombre">Nombre</option>
          <option value="precio">Precio</option>
        </select>
      </div>

      {/* Lista de publicaciones */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {filtrarPublicaciones().map(pub => (
          <div key={pub.id} className="border p-4 rounded shadow hover:shadow-md transition-shadow duration-200">
            {pub.fotos && pub.fotos.length > 0 ? (
              <img
                src={pub.fotos[0]}
                alt={pub.nombre_producto}
                className="w-full h-48 object-cover rounded mb-2"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded mb-2 text-gray-600">
                Sin imagen
              </div>
            )}
            <h2 className="text-xl font-bold">{pub.nombre_producto}</h2>
            <p><strong>Marca:</strong> {pub.marca}</p>
            <p><strong>Modelo:</strong> {pub.modelo}</p>
            <p><strong>Precio:</strong> ${pub.precio}</p>
            <p><strong>Ubicación:</strong> {pub.ubicacion}</p>
            <p><strong>Estado:</strong> {pub.estado}</p>
            <p><strong>Envío:</strong> {pub.envio === 'si' ? pub.tipo_envio : 'No'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
