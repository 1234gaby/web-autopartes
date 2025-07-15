import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Select } from '../components/ui/select';
import { LoadingOverlay } from '../components/ui/LoadingOverlay';
import DeLoreanImg from './DELOREAN.png';

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

function mostrarEnvio(pub) {
  if (pub.envio === true || pub.envio === 'true') {
    return pub.tipo_envio
      ? (pub.tipo_envio === 'uber_moto'
          ? 'Uber Moto'
          : pub.tipo_envio === 'uber_auto'
          ? 'Uber Auto'
          : pub.tipo_envio === 'flete'
          ? 'Flete'
          : pub.tipo_envio)
      : 'Sí';
  }
  if (pub.envio === false || pub.envio === 'false') {
    return 'No';
  }
  if (pub.envio === 'si') {
    return pub.tipo_envio
      ? (pub.tipo_envio === 'uber_moto'
          ? 'Uber Moto'
          : pub.tipo_envio === 'uber_auto'
          ? 'Uber Auto'
          : pub.tipo_envio === 'flete'
          ? 'Flete'
          : pub.tipo_envio)
      : 'Sí';
  }
  if (pub.envio === 'no') {
    return 'No';
  }
  return '-';
}

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

  const filtrarPublicaciones = () => {
    return publicaciones
      .filter(pub => {
        const filtroMarca = !filtros.marca || pub.marca === filtros.marca;
        const filtroModelo = !filtros.modelo || pub.modelo === filtros.modelo;
        const filtroUbicacion = !filtros.ubicacion || pub.ubicacion === filtros.ubicacion;

        let filtroEnvio = true;
        if (filtros.envio === 'si') {
          filtroEnvio = pub.envio === true || pub.envio === 'true' || pub.envio === 'si';
        } else if (filtros.envio === 'no') {
          filtroEnvio = pub.envio === false || pub.envio === 'false' || pub.envio === 'no';
        }

        const filtroEstado = !filtros.estado || pub.estado === filtros.estado;

        const texto = busqueda.trim().toLowerCase();
        if (!texto) {
          return filtroMarca && filtroModelo && filtroUbicacion && filtroEnvio && filtroEstado;
        }

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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <LoadingOverlay loading={loading} />

      {/* Banner con texto a la izquierda, imagen al centro y botones a la derecha */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-2 px-4 md:px-10 py-6 bg-white/90 dark:bg-gray-900/90 shadow rounded-b-2xl mb-6">
        {/* Texto a la izquierda */}
        <div className="flex-1 flex flex-col items-start md:items-start md:justify-center min-w-[220px]">
          <h1 className="text-2xl md:text-3xl font-extrabold text-blue-900 dark:text-blue-200 mb-1 drop-shadow">
            DeLorean Parts
          </h1>
          <p className="text-sm md:text-base text-gray-700 dark:text-gray-200">
            La plataforma más rápida y segura para comprar y vender autopartes en Argentina.
          </p>
        </div>
        {/* Imagen al centro */}
        <div className="flex-1 flex justify-center items-center my-3 md:my-0">
          <img
            src={DeLoreanImg}
            alt="DeLorean"
            className="object-contain"
            style={{
              background: 'none',
              border: 'none',
              boxShadow: 'none',
              display: 'block',
              width: '240px',
              height: '80px',
              maxWidth: '90vw'
            }}
            loading="lazy"
          />
        </div>
        {/* Botones a la derecha */}
        <div className="flex-1 flex flex-col md:items-end items-center gap-2 min-w-[220px]">
          <div className="flex gap-3 flex-wrap justify-center md:justify-end">
            {userId ? (
              <>
                {!esMecanico && (
                  <Button
                    variant="primary"
                    onClick={() => navigate('/crearpublicacion')}
                    className="min-w-[110px] bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white shadow"
                    as={motion.button}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Crear Publicación
                  </Button>
                )}
                <Button
                  variant="secondary"
                  onClick={() => navigate('/micuenta')}
                  className="min-w-[90px] bg-white dark:bg-gray-700 border border-blue-400 text-blue-700 dark:text-blue-200 shadow"
                  as={motion.button}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
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
                  className="min-w-[90px] bg-gradient-to-r from-red-500 to-red-700 text-white shadow"
                  as={motion.button}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                onClick={() => navigate('/')}
                className="min-w-[110px] bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white shadow"
                as={motion.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Iniciar sesión
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Buscador */}
      <div className="mb-6 flex justify-center px-4">
        <div className="w-full max-w-2xl">
          <input
            type="text"
            placeholder="Buscar por producto, ubicación, modelo o compatibilidad..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 transition duration-300 shadow"
          />
        </div>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-10 px-4 max-w-7xl mx-auto">
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
        className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-7xl mx-auto px-4 pb-16"
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
              className="border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow bg-white dark:bg-gray-800 cursor-pointer flex flex-col h-full overflow-hidden"
              onClick={() => navigate(`/publicacion/${pub.id}`)}
              title="Ver detalles"
            >
              {pub.fotos && pub.fotos.length > 0 ? (
                <img
                  src={pub.fotos[0]}
                  alt={pub.nombre_producto}
                  className="w-full h-48 object-cover rounded-t-2xl"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-t-2xl text-gray-600 dark:text-gray-400 select-none">
                  Sin imagen
                </div>
              )}

              <div className="p-5 flex flex-col flex-1">
                <h2 className="text-xl font-bold truncate mb-1 text-gray-900 dark:text-white">{pub.nombre_producto}</h2>
                <p className="mb-1 text-gray-800 dark:text-gray-100"><strong>Marca:</strong> {pub.marca}</p>
                <p className="mb-1 text-gray-800 dark:text-gray-100"><strong>Modelo:</strong> {pub.modelo}</p>
                <p className="mb-1 text-gray-800 dark:text-gray-100">
                  <strong>Precio:</strong>{' '}
                  {userId ? `$${pub.precio.toLocaleString('es-AR')}` : 'Iniciar sesión para ver'}
                </p>
                <p className="mb-1 text-gray-800 dark:text-gray-100">
                  <strong>Ubicación:</strong>{' '}
                  {userId ? pub.ubicacion : 'Iniciar sesión para ver'}
                </p>
                <p className="mb-1 text-gray-800 dark:text-gray-100"><strong>Estado:</strong> {pub.estado.charAt(0).toUpperCase() + pub.estado.slice(1)}</p>
                <p className="mb-1 text-gray-800 dark:text-gray-100"><strong>Envío:</strong> {mostrarEnvio(pub)}</p>
                {Array.isArray(pub.compatibilidad) && pub.compatibilidad.length > 0 && (
                  <div className="mt-2">
                    <strong className="text-gray-800 dark:text-gray-100">Compatibilidad:</strong>
                    <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-200">
                      {pub.compatibilidad.slice(0, 2).map((c, i) => (
                        <li key={i}>
                          {c.marca ? c.marca.charAt(0).toUpperCase() + c.marca.slice(1) : ''} {c.modelo}
                        </li>
                      ))}
                      {pub.compatibilidad.length > 2 && (
                        <li
                          className="text-blue-600 dark:text-blue-300 font-semibold select-none cursor-pointer"
                          title={pub.compatibilidad.map(c => `${c.marca ? c.marca.charAt(0).toUpperCase() + c.marca.slice(1) : ''} ${c.modelo}`).join(', ')}
                        >
                          +{pub.compatibilidad.length - 2} más
                        </li>
                      )}
                    </ul>
                  </div>
                )}
                <div className="mt-auto flex justify-end pt-3">
                  <Button
                    variant="primary"
                    onClick={e => {
                      e.stopPropagation();
                      navigate(`/publicacion/${pub.id}`);
                    }}
                    whileHover={{ scale: 1.08, boxShadow: '0 4px 20px #2563eb55' }}
                    whileTap={{ scale: 0.97 }}
                    as={motion.button}
                    className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold px-6 py-2 rounded-full shadow-lg transition-all duration-200 border-2 border-blue-500"
                  >
                    <span className="inline-flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Ver publicación
                    </span>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
}

export default Home;