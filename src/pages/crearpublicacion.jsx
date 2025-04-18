import React, { useState } from 'react';
import axios from 'axios';

const CrearPublicacion = () => {
  // Obtener el user_id (esto debe adaptarse según cómo guardes el ID del usuario)
  const userId = localStorage.getItem('user_id'); // O de donde tengas el ID del usuario

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
    user_id: userId, // Aquí agregamos el user_id al estado del formulario
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
      const fileArray = Array.from(files).map(file => file.name);
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

    // No es necesario modificar el user_id aquí porque ya está en formData.
    try {
      await axios.post('https://web-autopartes-backend.onrender.com/publicaciones', formData);
      alert('Publicación creada exitosamente');
    } catch (error) {
      console.error(error);
      alert('Error al crear la publicación');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', maxWidth: '600px', margin: 'auto' }}>
      <h2>Crear Publicación</h2>

      <input type="text" name="nombre_producto" placeholder="Nombre del producto" onChange={handleChange} required />

      <select name="marca" onChange={handleChange} required>
        <option value="">Seleccionar marca</option>
        {Object.keys(modelosPorMarca).map(m => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>

      <select name="modelo" onChange={handleChange} value={formData.modelo} required>
        <option value="">Seleccionar modelo</option>
        {modelosDisponibles.map(mod => (
          <option key={mod} value={mod}>{mod}</option>
        ))}
      </select>

      <input type="number" name="precio" placeholder="Precio" onChange={handleChange} required />

      <select name="ubicacion" onChange={handleChange} required>
        <option value="">Seleccionar localidad</option>
        {localidadesBrown.map(loc => (
          <option key={loc} value={loc}>{loc}</option>
        ))}
      </select>

      <label>
        ¿Envío?
        <select name="envio" onChange={handleChange}>
          <option value="no">No</option>
          <option value="si">Sí</option>
        </select>
      </label>

      {formData.envio === 'si' && (
        <select name="tipo_envio" onChange={handleChange}>
          <option value="">Seleccionar tipo de envío</option>
          <option value="uber_moto">Uber Moto</option>
          <option value="uber_auto">Uber Auto</option>
          <option value="flete">Flete</option>
        </select>
      )}

      <select name="categoria" onChange={handleChange} required>
        <option value="">Seleccionar categoría</option>
        {categorias.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <select name="estado" onChange={handleChange}>
        <option value="nuevo">Nuevo</option>
        <option value="usado">Usado</option>
      </select>

      <input type="text" name="codigo_serie" placeholder="Código de serie" onChange={handleChange} />

      <div>
        <h4>Compatibilidad</h4>
        <select value={compatibilidadTemp.marca} onChange={e => setCompatibilidadTemp({ ...compatibilidadTemp, marca: e.target.value })}>
          <option value="">Marca</option>
          {Object.keys(modelosPorMarca).map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        {compatibilidadTemp.marca && (
          <select value={compatibilidadTemp.modelo} onChange={e => setCompatibilidadTemp({ ...compatibilidadTemp, modelo: e.target.value })}>
            <option value="">Modelo</option>
            {(modelosPorMarca[compatibilidadTemp.marca] || []).map(mod => (
              <option key={mod} value={mod}>{mod}</option>
            ))}
          </select>
        )}
        <button type="button" onClick={agregarCompatibilidad}>Agregar</button>
        <ul>
          {formData.compatibilidad.map((c, i) => (
            <li key={i}>{c.marca} - {c.modelo}</li>
          ))}
        </ul>
      </div>

      <input type="text" name="marca_repuesto" placeholder="Marca/Fabricante del repuesto" onChange={handleChange} />

      <input type="file" name="fotos" multiple accept="image/*" onChange={handleChange} />

      <button type="submit">Crear Publicación</button>
    </form>
  );
};

export default CrearPublicacion;
