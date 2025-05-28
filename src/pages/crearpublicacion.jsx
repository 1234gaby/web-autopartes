import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CrearPublicacion = () => {
  const userId = localStorage.getItem('user_id');
  const navigate = useNavigate();
  const [publicacionExitosa, setPublicacionExitosa] = useState(false);

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
      const nueva = [...formData.compatibilidad, compatibilidadTemp];
      setFormData({ ...formData, compatibilidad: nueva });
      setCompatibilidadTemp({ marca: '', modelo: '' });
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
      await axios.post('https://web-autopartes-backend.onrender.com/publicaciones', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setPublicacionExitosa(true);
    } catch (error) {
      console.error(error);
      alert('Error al crear la publicación');
    }
  };

  if (publicacionExitosa) {
    return (
      <div className="text-center mt-8">
        <h2 className="text-2xl font-semibold">¡Publicación creada con éxito!</h2>
        <button
          onClick={() => navigate('/home')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Volver al Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <button
        onClick={() => navigate('/home')}
        className="mb-4 px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
      >
        ← Volver al Home
      </button>

      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-semibold text-center">Crear Publicación</h2>

        <input
          type="text"
          name="nombre_producto"
          placeholder="Nombre del producto"
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          name="marca"
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Seleccionar marca</option>
          {Object.keys(modelosPorMarca).map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <select
          name="modelo"
          onChange={handleChange}
          value={formData.modelo}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          name="ubicacion"
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Seleccionar localidad</option>
          {localidadesBrown.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>

        <label className="block">
          ¿Envío?
          <select
            name="envio"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="no">No</option>
            <option value="si">Sí</option>
          </select>
        </label>

        {formData.envio === 'si' && (
          <select
            name="tipo_envio"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Seleccionar categoría</option>
          {categorias.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          name="estado"
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="nuevo">Nuevo</option>
          <option value="usado">Usado</option>
        </select>

        <input
          type="text"
          name="codigo_serie"
          placeholder="Código de serie"
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="space-y-2">
          <h4 className="font-semibold">Compatibilidad</h4>
          <select
            value={compatibilidadTemp.marca}
            onChange={e => setCompatibilidadTemp({ ...compatibilidadTemp, marca: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Marca</option>
            {Object.keys(modelosPorMarca).map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          {compatibilidadTemp.marca && (
            <select
              value={compatibilidadTemp.modelo}
              onChange={e => setCompatibilidadTemp({ ...compatibilidadTemp, modelo: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Modelo</option>
              {(modelosPorMarca[compatibilidadTemp.marca] || []).map(mod => (
                <option key={mod} value={mod}>{mod}</option>
              ))}
            </select>
          )}
          <button
            type="button"
            onClick={agregarCompatibilidad}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Agregar
          </button>
          <ul>
            {formData.compatibilidad.map((c, i) => (
              <li key={i}>{c.marca} - {c.modelo}</li>
            ))}
          </ul>
        </div>

        <input
          type="text"
          name="marca_repuesto"
          placeholder="Marca/Fabricante del repuesto"
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="file"
          name="fotos"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
        >
          Crear Publicación
        </button>
      </form>
    </div>
  );
};

export default CrearPublicacion;
