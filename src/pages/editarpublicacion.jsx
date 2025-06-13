import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { LoadingOverlay } from '../components/ui/LoadingOverlay';
import axios from 'axios';

const MotionButton = motion.create(Button);

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

const estados = ['nuevo', 'usado'];

const EditarPublicacion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [publicacion, setPublicacion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({});
  const [modelosDisponibles, setModelosDisponibles] = useState([]);
  const [imagenes, setImagenes] = useState([]);
  const [imagenesAEliminar, setImagenesAEliminar] = useState([]);
  const [nuevasImagenes, setNuevasImagenes] = useState([]);
  const [compatibilidad, setCompatibilidad] = useState([]);
  const [compatTemp, setCompatTemp] = useState({ marca: '', modelo: '' });

  // Estados para comisión y datos del vendedor
  const [comision, setComision] = useState(0.3); // 30% base
  const [ganancia, setGanancia] = useState(0);
  const [afipAprobada, setAfipAprobada] = useState(false);
  const [ventasUltimos30, setVentasUltimos30] = useState(0);

  // Estados para envío (SIEMPRE string)
  const [envio, setEnvio] = useState("false");
  const [tipoEnvio, setTipoEnvio] = useState('');

  useEffect(() => {
    if (!publicacion) return;
    const userId = publicacion.user_id;
    if (!userId) return;
    axios.get(`https://web-autopartes-backend.onrender.com/usuarios/${userId}`)
      .then(res => {
        setAfipAprobada(res.data.constancia_afip_aprobada === true);
      })
      .catch(() => setAfipAprobada(false));
    axios.get(`https://web-autopartes-backend.onrender.com/usuarios/${userId}/ventas-ultimos-30`)
      .then(res => setVentasUltimos30(res.data.ventasUltimos30 || 0))
      .catch(() => setVentasUltimos30(0));
  }, [publicacion]);

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
    if (form.precio) {
      const precio = parseFloat(form.precio) || 0;
      setGanancia(precio - precio * com);
    } else {
      setGanancia(0);
    }
  }, [form.precio, afipAprobada, ventasUltimos30]);

  useEffect(() => {
    setLoading(true);
    axios.get(`https://web-autopartes-backend.onrender.com/publicaciones/${id}`)
      .then(res => {
        setPublicacion(res.data);
        setForm({
          nombre_producto: res.data.nombre_producto || '',
          marca: res.data.marca || '',
          modelo: res.data.modelo || '',
          precio: res.data.precio || '',
          ubicacion: res.data.ubicacion || '',
          categoria: res.data.categoria || '',
          estado: res.data.estado || '',
          codigo_serie: res.data.codigo_serie || '',
          marca_repuesto: res.data.marca_repuesto || '',
        });
        setImagenes(Array.isArray(res.data.fotos) ? res.data.fotos : []);
        setModelosDisponibles(modelosPorMarca[res.data.marca] || []);
        setCompatibilidad(Array.isArray(res.data.compatibilidad) ? res.data.compatibilidad : []);
        // CORRECCIÓN: Siempre string "true" o "false"
        setEnvio(res.data.envio === true ? "true" : "false");
        setTipoEnvio(res.data.tipo_envio || '');
      })
      .catch(() => alert('Error al cargar la publicación'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    if (name === 'marca') {
      setForm({ ...form, marca: value, modelo: '' });
      setModelosDisponibles(modelosPorMarca[value] || []);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleEnvioChange = e => {
    setEnvio(e.target.value);
    if (e.target.value !== 'true') setTipoEnvio('');
  };
  const handleTipoEnvioChange = e => {
    setTipoEnvio(e.target.value);
  };

  const handleCompatMarca = e => {
    setCompatTemp({ marca: e.target.value, modelo: '' });
  };
  const handleCompatModelo = e => {
    setCompatTemp(prev => ({ ...prev, modelo: e.target.value }));
  };
  const agregarCompatibilidad = () => {
    if (compatTemp.marca && compatTemp.modelo) {
      const yaExiste = compatibilidad.some(
        c => c.marca === compatTemp.marca && c.modelo === compatTemp.modelo
      );
      if (!yaExiste) {
        setCompatibilidad([...compatibilidad, compatTemp]);
        setCompatTemp({ marca: '', modelo: '' });
      }
    }
  };
  const eliminarCompatibilidad = idx => {
    setCompatibilidad(compatibilidad.filter((_, i) => i !== idx));
  };

  const handleEliminarImagen = (imgUrl) => {
    setImagenesAEliminar([...imagenesAEliminar, imgUrl]);
  };

  const handleNuevaImagen = e => {
    setNuevasImagenes([...nuevasImagenes, ...Array.from(e.target.files)]);
  };

  const handleQuitarNuevaImagen = idx => {
    setNuevasImagenes(nuevasImagenes.filter((_, i) => i !== idx));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    data.append('envio', envio);
    data.append('tipo_envio', tipoEnvio);
    data.append('compatibilidad', JSON.stringify(compatibilidad));
    nuevasImagenes.forEach(img => data.append('nuevasFotos', img));
    data.append('imagenesAEliminar', JSON.stringify(imagenesAEliminar));

    try {
      await axios.put(
        `https://web-autopartes-backend.onrender.com/publicaciones/${id}`,
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      alert('Publicación actualizada');
      navigate('/mis-publicaciones');
    } catch {
      alert('Error al actualizar la publicación');
    } finally {
      setLoading(false);
    }
  };

  if (!publicacion) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <LoadingOverlay loading={true} />
        <div className="text-center py-10 text-gray-600 dark:text-gray-400">Cargando...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4"
    >
      <LoadingOverlay loading={loading} />
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl p-6 bg-white dark:bg-gray-800 rounded-md shadow-md space-y-4"
        encType="multipart/form-data"
      >
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mb-4 text-center">
          Editar Publicación
        </h2>

        <div>
          <Label className="text-gray-900 dark:text-gray-100">Nombre del producto</Label>
          <Input
            name="nombre_producto"
            value={form.nombre_producto}
            onChange={handleInputChange}
            required
            className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <Label className="text-gray-900 dark:text-gray-100">Marca</Label>
          <select
            name="marca"
            value={form.marca}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">Seleccionar marca</option>
            {Object.keys(modelosPorMarca).map(m => (
              <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
            ))}
          </select>
        </div>
        <div>
          <Label className="text-gray-900 dark:text-gray-100">Modelo</Label>
          <select
            name="modelo"
            value={form.modelo}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            disabled={!form.marca}
          >
            <option value="">Seleccionar modelo</option>
            {modelosDisponibles.map(mod => (
              <option key={mod} value={mod}>{mod}</option>
            ))}
          </select>
        </div>
        <div>
          <Label className="text-gray-900 dark:text-gray-100">Precio</Label>
          <Input
            name="precio"
            type="number"
            value={form.precio}
            onChange={handleInputChange}
            required
            className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        {form.precio && (
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
            <div>Comisión en $: {(parseFloat(form.precio) * comision).toFixed(2)}</div>
            <div>
              <strong>Ganancia neta: ${ganancia.toFixed(2)}</strong>
            </div>
          </div>
        )}

        <div>
          <Label className="text-gray-900 dark:text-gray-100">Ubicación</Label>
          <select
            name="ubicacion"
            value={form.ubicacion}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">Seleccionar localidad</option>
            {localidadesBrown.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        <div>
          <Label className="text-gray-900 dark:text-gray-100 font-semibold block mb-1">
            ¿Envío?
          </Label>
          <select
            name="envio"
            value={envio}
            onChange={handleEnvioChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="false">No</option>
            <option value="true">Si</option>
          </select>
        </div>
        {envio === 'true' && (
          <div>
            <Label className="text-gray-900 dark:text-gray-100 font-semibold block mb-1">
              Tipo de envío
            </Label>
            <select
              name="tipo_envio"
              value={tipoEnvio}
              onChange={handleTipoEnvioChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">Seleccionar tipo de envío</option>
              <option value="uber_moto">Uber Moto</option>
              <option value="uber_auto">Uber Auto</option>
              <option value="flete">Flete</option>
            </select>
          </div>
        )}

        <div>
          <Label className="text-gray-900 dark:text-gray-100">Categoría</Label>
          <select
            name="categoria"
            value={form.categoria}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">Seleccionar categoría</option>
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <Label className="text-gray-900 dark:text-gray-100">Estado</Label>
          <select
            name="estado"
            value={form.estado}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">Seleccionar estado</option>
            {estados.map(est => (
              <option key={est} value={est}>{est.charAt(0).toUpperCase() + est.slice(1)}</option>
            ))}
          </select>
        </div>
        <div>
          <Label className="text-gray-900 dark:text-gray-100">Código de serie</Label>
          <Input
            name="codigo_serie"
            value={form.codigo_serie}
            onChange={handleInputChange}
            className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <Label className="text-gray-900 dark:text-gray-100">Marca/Fabricante del repuesto</Label>
          <Input
            name="marca_repuesto"
            value={form.marca_repuesto}
            onChange={handleInputChange}
            className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Compatibilidad</h3>
          <div className="flex gap-4 mb-3 flex-wrap">
            <select
              value={compatTemp.marca}
              onChange={handleCompatMarca}
              className="flex-1 min-w-[120px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 transition duration-300"
            >
              <option value="">Marca</option>
              {Object.keys(modelosPorMarca).map(m => (
                <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
              ))}
            </select>
            <select
              value={compatTemp.modelo}
              onChange={handleCompatModelo}
              disabled={!compatTemp.marca}
              className="flex-1 min-w-[120px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 transition duration-300"
            >
              <option value="">Modelo</option>
              {modelosPorMarca[compatTemp.marca]?.map(mod => (
                <option key={mod} value={mod}>{mod}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={agregarCompatibilidad}
              disabled={!compatTemp.marca || !compatTemp.modelo}
              className={`px-5 py-2 rounded-md font-semibold text-white transition duration-300
                ${(!compatTemp.marca || !compatTemp.modelo)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'}
              `}
            >
              Agregar
            </button>
          </div>
          {compatibilidad.length > 0 && (
            <ul className="list-disc list-inside max-h-32 overflow-auto text-gray-800 dark:text-gray-200">
              {compatibilidad.map(({ marca, modelo }, i) => (
                <li key={`${marca}-${modelo}-${i}`} className="flex items-center justify-between">
                  <span>
                    {marca.charAt(0).toUpperCase() + marca.slice(1)} - {modelo}
                  </span>
                  <button
                    type="button"
                    onClick={() => eliminarCompatibilidad(i)}
                    className="ml-2 px-2 py-1 bg-red-600 text-white rounded text-xs"
                  >
                    Quitar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <Label className="text-gray-900 dark:text-gray-100">Imágenes actuales</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {imagenes.filter(img => !imagenesAEliminar.includes(img)).map((img, idx) => (
              <div key={idx} className="relative">
                <img
                  src={img}
                  alt="foto"
                  className="w-24 h-24 object-cover rounded border border-gray-300 dark:border-gray-600"
                />
                <button
                  type="button"
                  onClick={() => handleEliminarImagen(img)}
                  className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-2 py-1 text-xs"
                  title="Eliminar imagen"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-gray-900 dark:text-gray-100">Agregar nuevas imágenes</Label>
          <input
            type="file"
            multiple
            accept=".jpg,.jpeg,.png"
            onChange={handleNuevaImagen}
            className="w-full mt-1 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700"
          />
          {nuevasImagenes.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {nuevasImagenes.map((img, idx) => (
                <div key={idx} className="relative">
                  <span className="block w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 flex items-center justify-center text-xs text-gray-500 dark:text-gray-300">
                    {img.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleQuitarNuevaImagen(idx)}
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-2 py-1 text-xs"
                    title="Quitar"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <MotionButton
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded"
            disabled={loading}
          >
            Guardar cambios
          </MotionButton>
          <MotionButton
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 rounded"
            onClick={() => navigate('/mis-publicaciones')}
            disabled={loading}
          >
            Cancelar
          </MotionButton>
        </div>
      </form>
    </motion.div>
  );
};

export default EditarPublicacion;