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

  useEffect(() => {
    axios.get('https://web-autopartes-backend.onrender.com/publicaciones')
      .then(res => setPublicaciones(res.data))
      .catch(err => console.error(err));
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem('user_id');
    navigate('/');
  };

  const publicacionesFiltradas = publicaciones
    .filter(p => {
      return (
        (!filtros.marca || p.marca === filtros.marca) &&
        (!filtros.modelo || p.modelo === filtros.modelo) &&
        (!filtros.ubicacion || p.ubicacion === filtros.ubicacion) &&
        (!filtros.envio || p.envio === filtros.envio) &&
        (!filtros.estado || p.estado === filtros.estado)
      );
    })
    .sort((a, b) => {
      if (orden === 'nombre-asc') return a.nombre_producto.localeCompare(b.nombre_producto);
      if (orden === 'nombre-desc') return b.nombre_producto.localeCompare(a.nombre_producto);
      if (orden === 'precio-asc') return a.precio - b.precio;
      if (orden === 'precio-desc') return b.precio - a.precio;
      return 0;
    });

  // Función para parsear fotos, con control de error
  const obtenerFotos = (fotos) => {
    if (!fotos) return [];
    if (typeof fotos === 'string') {
      try {
        return JSON.parse(fotos);
      } catch {
        // Si no es JSON válido, retornamos un array con el string mismo
        return [fotos];
      }
    }
    // Si ya es un array u objeto, retornamos tal cual (asumimos array)
    return fotos;
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bienvenido al Home</h1>
        <button
          onClick={cerrarSesion}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Cerrar sesión
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <select onChange={(e) => setFiltros({ ...filtros, marca: e.target.value })}>
          <option value="">Marca</option>
          {Object.keys(modelosPorMarca).map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <select onChange={(e) => setFiltros({ ...filtros, modelo: e.target.value })}>
          <option value="">Modelo</option>
          {Object.values(modelosPorMarca).flat().map(mod => (
            <option key={mod} value={mod}>{mod}</option>
          ))}
        </select>

        <select onChange={(e) => setFiltros({ ...filtros, ubicacion: e.target.value })}>
          <option value="">Ubicación</option>
          {localidadesBrown.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>

        <select onChange={(e) => setFiltros({ ...filtros, envio: e.target.value })}>
          <option value="">¿Envío?</option>
          <option value="si">Sí</option>
          <option value="no">No</option>
        </select>

        <select onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}>
          <option value="">Estado</option>
          <option value="nuevo">Nuevo</option>
          <option value="usado">Usado</option>
        </select>

        <select onChange={(e) => setOrden(e.target.value)}>
          <option value="">Ordenar por</option>
          <option value="nombre-asc">Nombre A-Z</option>
          <option value="nombre-desc">Nombre Z-A</option>
          <option value="precio-asc">Precio menor a mayor</option>
          <option value="precio-desc">Precio mayor a menor</option>
        </select>
      </div>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
        onClick={() => navigate('/crear-publicacion')}
      >
        Crear publicación
      </button>

      <div className="grid gap-4">
        {publicacionesFiltradas.map(publi => {
          const fotosArray = obtenerFotos(publi.fotos);
          return (
            <div key={publi.id} className="border p-4 rounded shadow flex gap-4">
              <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded">
                <img
                  src={`https://web-autopartes-backend.onrender.com/uploads/${fotosArray[0]}`}
                  alt="Miniatura"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-lg font-bold">{publi.nombre_producto}</h2>
                <p className="text-sm">Precio: ${publi.precio}</p>
                <p className="text-sm">Marca: {publi.marca}</p>
                <p className="text-sm">Modelo: {publi.modelo}</p>
                <p className="text-sm">Categoría: {publi.categoria}</p>
                <p className="text-sm">Estado: {publi.estado}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Home;
