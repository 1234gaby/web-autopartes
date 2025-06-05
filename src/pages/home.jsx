import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Select } from '../components/ui/select';
import { LoadingOverlay } from '../components/ui/LoadingOverlay';

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
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  const userId = localStorage.getItem('user_id');
  let perfil = localStorage.getItem('perfil');
  if (perfil === null || perfil === undefined) perfil = '';
  const esMecanico = perfil && perfil.toString().toLowerCase().trim() === 'mecanico';

  useEffect(() => {
    const fetchPublicaciones = async () => {
      setLoading(true);
      try {
        const res = await axios.get('https://web-autopartes-backend.onrender.com/publicaciones');
        setPublicaciones(res.data);
      } catch (error) {
        console.error('Error al cargar publicaciones', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicaciones();
  }, []);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    if (name === 'marca') {
      setFiltros({ ...filtros, marca: value, modelo: '' });
    } else {
      setFiltros({ ...filtros, [name]: value });
    }
  };

  // Buscador avanzado: nombre, ubicación, modelo, modelos compatibles
  const filtrarPublicaciones = () => {
    return publicaciones
      .filter(pub => {
        // Filtros select
        const filtroMarca = !filtros.marca || pub.marca === filtros.marca;
        const filtroModelo = !filtros.modelo || pub.modelo === filtros.modelo;
        const filtroUbicacion = !filtros.ubicacion || pub.ubicacion === filtros.ubicacion;
        const filtroEnvio = !filtros.envio || pub.envio === filtros.envio;
        const filtroEstado = !filtros.estado || pub.estado === filtros.estado;

        // Buscador: nombre, ubicación, modelo, modelos compatibles
        const texto = busqueda.trim().toLowerCase();
        if (!texto) {
          return filtroMarca && filtroModelo && filtroUbicacion && filtroEnvio && filtroEstado;
        }

        // Modelos compatibles: array de objetos {marca, modelo}
        let compatibles = '';
        if (Array.isArray(pub.compatibilidad)) {
          compatibles = pub.compatibilidad
            .map(c => `${c.marca || ''} ${c.modelo || ''}`.toLowerCase())
            .join(' ');
        }

        return (
          filtroMarca &&
          filtroModelo &&
          filtroUbicacion &&
          filtroEnvio &&
          filtroEstado &&
          (
            (pub.nombre_producto && pub.nombre_producto.toLowerCase().includes(texto)) ||
            (pub.ubicacion && pub.ubicacion.toLowerCase().includes(texto)) ||
            (pub.modelo && pub.modelo.toLowerCase().includes(texto)) ||
            (compatibles && compatibles.includes(texto))
          )
        );
      })
      .sort((a, b) => {
        if (orden === 'precio') return a.precio - b.precio;
        if (orden === 'nombre') return a.nombre_producto.localeCompare(b.nombre_producto);
        return 0;
      });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <LoadingOverlay loading={loading} />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <h1 className="text-3xl font-extrabold">Publicaciones</h1>
        <div className="flex flex-wrap gap-3">
          {userId ? (
            <>
              {!esMecanico && (
                <Button
                  variant="primary"
                  onClick={() => navigate('/crearpublicacion')}
                  className="min-w-[140px]"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  as={motion.button}
                >
                  Crear Publicación
                </Button>
              )}
              <Button
                variant="secondary"
                onClick={() => navigate('/micuenta')}
                className="min-w-[120px]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                as={motion.button}
              >
                Mi Cuenta
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  localStorage.removeItem('user_id');
                  localStorage.removeItem('perfil');
                  navigate('/');
                }}
                className="min-w-[120px]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                as={motion.button}
              >
                Cerrar sesión
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              onClick={() => navigate('/')}
              className="min-w-[140px]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              as={motion.button}
            >
              Iniciar sesión
            </Button>
          )}
        </div>
      </div>

      {/* Buscador alineado al área de trabajo */}
      <div className="mb-6 flex justify-center">
        <div className="w-full">
          <input
            type="text"
            placeholder="Buscar por producto, ubicación, modelo o compatibilidad..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 transition duration-300"
          />
        </div>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-10">
        <div>
          <Label htmlFor="marca">Marca</Label>
          <Select
            id="marca"
            name="marca"
            value={filtros.marca}
            onChange={handleFiltroChange}
            className="w-full"
          >
            <option value="">Todas</option>
            {Object.keys(modelosPorMarca).map(m => (
              <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="modelo">Modelo</Label>
          <Select
            id="modelo"
            name="modelo"
            value={filtros.modelo}
            onChange={handleFiltroChange}
            disabled={!filtros.marca}
            className={`w-full ${
              !filtros.marca
                ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed'
                : 'bg-white dark:bg-gray-800'
            }`}
          >
            <option value="">Todos</option>
            {(modelosPorMarca[filtros.marca] || []).map(mod => (
              <option key={mod} value={mod}>{mod}</option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="ubicacion">Ubicación</Label>
          <Select
            id="ubicacion"
            name="ubicacion"
            value={filtros.ubicacion}
            onChange={handleFiltroChange}
            className="w-full"
          >
            <option value="">Todas</option>
            {localidadesBrown.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="envio">Envío</Label>
          <Select
            id="envio"
            name="envio"
            value={filtros.envio}
            onChange={handleFiltroChange}
            className="w-full"
          >
            <option value="">Todos</option>
            <option value="si">Sí</option>
            <option value="no">No</option>
          </Select>
        </div>

        <div>
          <Label htmlFor="estado">Estado</Label>
          <Select
            id="estado"
            name="estado"
            value={filtros.estado}
            onChange={handleFiltroChange}
            className="w-full"
          >
            <option value="">Todos</option>
            <option value="nuevo">Nuevo</option>
            <option value="usado">Usado</option>
          </Select>
        </div>

        <div>
          <Label htmlFor="orden">Ordenar por</Label>
          <Select
            id="orden"
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
            className="w-full"
          >
            <option value="">Sin ordenar</option>
            <option value="nombre">Nombre</option>
            <option value="precio">Precio</option>
          </Select>
        </div>
      </div>

      {/* Lista de publicaciones */}
      <motion.div
        layout
        className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
      >
        {filtrarPublicaciones().length === 0 && !loading ? (
          <p className="col-span-full text-center text-gray-600 dark:text-gray-400">
            No se encontraron publicaciones que coincidan con los filtros.
          </p>
        ) : (
          filtrarPublicaciones().map(pub => (
            <motion.div
              key={pub.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="border border-gray-300 dark:border-gray-700 rounded shadow hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 cursor-pointer"
              onClick={() => navigate(`/publicacion/${pub.id}`)}
              title="Ver detalles"
            >
              {pub.fotos && pub.fotos.length > 0 ? (
                <img
                  src={pub.fotos[0]}
                  alt={pub.nombre_producto}
                  className="w-full h-48 object-cover rounded-t"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-t text-gray-600 dark:text-gray-400 select-none">
                  Sin imagen
                </div>
              )}

              <div className="p-4 space-y-1">
                <h2 className="text-xl font-semibold truncate">{pub.nombre_producto}</h2>
                <p><strong>Marca:</strong> {pub.marca}</p>
                <p><strong>Modelo:</strong> {pub.modelo}</p>
                <p>
                  <strong>Precio:</strong>{' '}
                  {userId ? `$${pub.precio.toLocaleString('es-AR')}` : 'Iniciar sesión para ver'}
                </p>
                <p>
                  <strong>Ubicación:</strong>{' '}
                  {userId ? pub.ubicacion : 'Iniciar sesión para ver'}
                </p>
                <p><strong>Estado:</strong> {pub.estado.charAt(0).toUpperCase() + pub.estado.slice(1)}</p>
                <p><strong>Envío:</strong> {pub.envio === 'si' ? pub.tipo_envio : 'No'}</p>
                {Array.isArray(pub.compatibilidad) && pub.compatibilidad.length > 0 && (
                  <div className="mt-2">
                    <strong>Compatibilidad:</strong>
                    <ul className="list-disc list-inside text-sm">
                      {pub.compatibilidad.map((c, i) => (
                        <li key={i}>
                          {c.marca ? c.marca.charAt(0).toUpperCase() + c.marca.slice(1) : ''} {c.modelo}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
}

export default Home;