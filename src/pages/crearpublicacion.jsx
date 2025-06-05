import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LoadingOverlay } from '../components/ui/LoadingOverlay';

const CrearPublicacion = () => {
  const userId = localStorage.getItem('user_id');
  const navigate = useNavigate();
  const [publicacionExitosa, setPublicacionExitosa] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nombre_producto: '',
    marca: '',
    modelo: '',
    precio: '',
    ubicacion: '',
    envio: 'no',
    tipo_envio: '',
    categoria: '',
    estado: 'nuevo',
    codigo_serie: '',
    compatibilidad: [],
    marca_repuesto: '',
    fotos: [],
    user_id: userId,
  });

  const [modelosDisponibles, setModelosDisponibles] = useState([]);
  const [compatibilidadTemp, setCompatibilidadTemp] = useState({ marca: '', modelo: '' });

  // Estados para comisión y datos del vendedor
  const [comision, setComision] = useState(0.3); // 30% base
  const [comisionDetalle, setComisionDetalle] = useState({
    base: 0.3,
    afip: false,
    ventas: 0,
    extra: 0,
  });
  const [ganancia, setGanancia] = useState(0);
  const [afipAprobada, setAfipAprobada] = useState(false);
  const [ventasUltimos30, setVentasUltimos30] = useState(0);

  // Traer datos del usuario y ventas al montar
  useEffect(() => {
    if (!userId) return;
    // Traer usuario
    axios.get(`https://web-autopartes-backend.onrender.com/usuarios/${userId}`)
      .then(res => {
        setAfipAprobada(res.data.constancia_afip_aprobada === true);
      })
      .catch(() => setAfipAprobada(false));
    // Traer ventas últimos 30 días
    axios.get(`https://web-autopartes-backend.onrender.com/usuarios/${userId}/ventas-ultimos-30`)
      .then(res => setVentasUltimos30(res.data.ventasUltimos30 || 0))
      .catch(() => setVentasUltimos30(0));
  }, [userId]);

  // Calcular comisión y ganancia cada vez que cambia precio, afip o ventas
  useEffect(() => {
    let com = 0.3;
    let extra = 0;
    if (afipAprobada) com -= 0.05;
    if (ventasUltimos30 >= 25) extra = 0.10;
    else if (ventasUltimos30 >= 15) extra = 0.08;
    else if (ventasUltimos30 >= 5) extra = 0.05;
    com -= extra;
    if (com < 0) com = 0;
    setComision(com);
    setComisionDetalle({
      base: 0.3,
      afip: afipAprobada,
      ventas: ventasUltimos30,
      extra,
    });
    if (formData.precio) {
      const precio = parseFloat(formData.precio) || 0;
      setGanancia(precio - precio * com);
    } else {
      setGanancia(0);
    }
  }, [formData.precio, afipAprobada, ventasUltimos30]);

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

  const categorias = [
    'Motor', 'Frenos', 'Suspensión', 'Transmisión', 'Carrocería',
    'Electricidad', 'Interior', 'Escapes', 'Luces', 'Accesorios'
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'marca') {
      setModelosDisponibles(modelosPorMarca[value] || []);
      setFormData({ ...formData, marca: value, modelo: '' });
    } else if (name === 'fotos') {
      if (files.length > 5) {
        alert('Solo se pueden subir hasta 5 fotos');
        return;
      }
      const fileArray = Array.from(files);
      setFormData({ ...formData, fotos: fileArray });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const agregarCompatibilidad = () => {
    if (compatibilidadTemp.marca && compatibilidadTemp.modelo) {
      // Evitar duplicados
      const yaExiste = formData.compatibilidad.some(
        (c) => c.marca === compatibilidadTemp.marca && c.modelo === compatibilidadTemp.modelo
      );
      if (!yaExiste) {
        const nueva = [...formData.compatibilidad, compatibilidadTemp];
        setFormData({ ...formData, compatibilidad: nueva });
        setCompatibilidadTemp({ marca: '', modelo: '' });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('nombre_producto', formData.nombre_producto);
    data.append('marca', formData.marca);
    data.append('modelo', formData.modelo);
    data.append('precio', formData.precio);
    data.append('ubicacion', formData.ubicacion);
    data.append('envio', formData.envio);
    data.append('tipo_envio', formData.tipo_envio);
    data.append('categoria', formData.categoria);
    data.append('estado', formData.estado);
    data.append('codigo_serie', formData.codigo_serie);
    data.append('marca_repuesto', formData.marca_repuesto);
    data.append('user_id', formData.user_id);
    data.append('compatibilidad', JSON.stringify(formData.compatibilidad));
    formData.fotos.forEach((file) => data.append('fotos', file));

    try {
      setLoading(true);
      await axios.post('https://web-autopartes-backend.onrender.com/publicaciones', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setPublicacionExitosa(true);
    } catch (error) {
      console.error(error);
      alert('Error al crear la publicación');
    } finally {
      setLoading(false);
    }
  };

  if (publicacionExitosa) {
    return (
      <div className="flex flex-col items-center justify-center mt-16 space-y-6">
        <h2 className="text-3xl font-bold text-green-600 animate-fade-in">¡Publicación creada con éxito!</h2>
        <button
          onClick={() => navigate('/home')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:-translate-y-1"
        >
          Volver al Home
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700 transition-all duration-500"
    >
      <LoadingOverlay loading={loading} />

      <button
        onClick={() => navigate('/home')}
        className="mb-6 px-5 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300 flex items-center space-x-2"
        aria-label="Volver al Home"
      >
        <span className="text-xl font-semibold select-none">←</span>
        <span>Volver al Home</span>
      </button>

      <form onSubmit={handleSubmit} className="space-y-8">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-gray-100 mb-6">Crear Publicación</h2>

        <input
          type="text"
          name="nombre_producto"
          placeholder="Nombre del producto"
          onChange={handleChange}
          required
          className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 transition duration-300"
        />

        <select
          name="marca"
          onChange={handleChange}
          required
          className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 transition duration-300"
        >
          <option value="">Seleccionar marca</option>
          {Object.keys(modelosPorMarca).map(m => (
            <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
          ))}
        </select>

        <select
          name="modelo"
          onChange={handleChange}
          value={formData.modelo}
          required
          className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 transition duration-300"
        >
          <option value="">Seleccionar modelo</option>
          {modelosDisponibles.map(mod => (
            <option key={mod} value={mod}>{mod}</option>
          ))}
        </select>

        <input
          type="number"
          name="precio"
          placeholder="Precio"
          onChange={handleChange}
          required
          min="0"
          step="any"
          className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 transition duration-300"
        />

        {/* Desglose de comisión y ganancia */}
        {formData.precio && (
          <div className="bg-blue-50 dark:bg-blue-900 rounded p-4 mb-2 text-blue-900 dark:text-blue-100 text-sm">
            <div>Comisión base: 30%</div>
            {afipAprobada && <div>- Constancia AFIP/ARCA aprobada: -5%</div>}
            {ventasUltimos30 >= 5 && (
              <div>
                - Ventas últimos 30 días: {ventasUltimos30 >= 25 ? '-10%' : ventasUltimos30 >= 15 ? '-8%' : '-5%'}
              </div>
            )}
            <div>
              <strong>Comisión total: {(comision * 100).toFixed(1)}%</strong>
            </div>
            <div>Comisión en $: ${(parseFloat(formData.precio) * comision).toFixed(2)}</div>
            <div>
              <strong>Ganancia neta: ${ganancia.toFixed(2)}</strong>
            </div>
          </div>
        )}

        <select
          name="ubicacion"
          onChange={handleChange}
          required
          className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 transition duration-300"
        >
          <option value="">Seleccionar localidad</option>
          {localidadesBrown.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>

        <label className="block text-gray-800 dark:text-gray-200 font-semibold">
          ¿Envío?
          <select
            name="envio"
            onChange={handleChange}
            className="mt-1 w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 transition duration-300"
          >
            <option value="no">No</option>
            <option value="si">Sí</option>
          </select>
        </label>

        {formData.envio === 'si' && (
          <select
            name="tipo_envio"
            onChange={handleChange}
            required
            className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 transition duration-300"
          >
            <option value="">Seleccionar tipo de envío</option>
            <option value="uber_moto">Uber Moto</option>
            <option value="uber_auto">Uber Auto</option>
            <option value="flete">Flete</option>
          </select>
        )}

        <select
          name="categoria"
          onChange={handleChange}
          required
          className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 transition duration-300"
        >
          <option value="">Seleccionar categoría</option>
          {categorias.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          name="estado"
          onChange={handleChange}
          className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 transition duration-300"
        >
          <option value="nuevo">Nuevo</option>
          <option value="usado">Usado</option>
        </select>

        <input
          type="text"
          name="codigo_serie"
          placeholder="Código de serie"
          onChange={handleChange}
          className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 transition duration-300"
        />

        <input
          type="text"
          name="marca_repuesto"
          placeholder="Marca/Fabricante del repuesto"
          onChange={handleChange}
          className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 transition duration-300"
        />

        {/* Compatibilidad */}
        <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Compatibilidad</h3>

          <div className="flex gap-4 mb-3 flex-wrap">
            <select
              value={compatibilidadTemp.marca}
              onChange={(e) => {
                setCompatibilidadTemp({ marca: e.target.value, modelo: '' });
                setModelosDisponibles(modelosPorMarca[e.target.value] || []);
              }}
              className="flex-1 min-w-[120px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 transition duration-300"
            >
              <option value="">Marca</option>
              {Object.keys(modelosPorMarca).map(m => (
                <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
              ))}
            </select>

            <select
              value={compatibilidadTemp.modelo}
              onChange={(e) => setCompatibilidadTemp(prev => ({ ...prev, modelo: e.target.value }))}
              disabled={!compatibilidadTemp.marca}
              className="flex-1 min-w-[120px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 transition duration-300"
            >
              <option value="">Modelo</option>
              {modelosPorMarca[compatibilidadTemp.marca]?.map(mod => (
                <option key={mod} value={mod}>{mod}</option>
              ))}
            </select>

            <button
              type="button"
              onClick={agregarCompatibilidad}
              disabled={!compatibilidadTemp.marca || !compatibilidadTemp.modelo}
              className={`px-5 py-2 rounded-md font-semibold text-white transition duration-300
                ${(!compatibilidadTemp.marca || !compatibilidadTemp.modelo)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'}
              `}
            >
              Agregar
            </button>
          </div>

          {formData.compatibilidad.length > 0 && (
            <ul className="list-disc list-inside max-h-32 overflow-auto text-gray-800 dark:text-gray-200">
              {formData.compatibilidad.map(({ marca, modelo }, i) => (
                <li key={`${marca}-${modelo}-${i}`}>
                  {marca.charAt(0).toUpperCase() + marca.slice(1)} - {modelo}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Fotos */}
        <label className="block text-gray-800 dark:text-gray-200 font-semibold">
          Fotos (hasta 5)
          <input
            type="file"
            name="fotos"
            onChange={handleChange}
            multiple
            accept="image/*"
            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-4 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 transition duration-300"
          />
        </label>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105"
        >
          Crear Publicación
        </button>
      </form>
    </motion.div>
  );
};

export default CrearPublicacion;