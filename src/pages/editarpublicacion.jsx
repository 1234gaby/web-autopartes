import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { LoadingOverlay } from '../components/ui/LoadingOverlay';
import axios from 'axios';

const MotionButton = motion.create(Button);

const EditarPublicacion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [publicacion, setPublicacion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({});
  const [imagenes, setImagenes] = useState([]);
  const [imagenesAEliminar, setImagenesAEliminar] = useState([]);
  const [nuevasImagenes, setNuevasImagenes] = useState([]);

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
        });
        setImagenes(Array.isArray(res.data.fotos) ? res.data.fotos : []);
      })
      .catch(() => alert('Error al cargar la publicación'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleInputChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
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

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    nuevasImagenes.forEach(img => formData.append('nuevasFotos', img));
    formData.append('imagenesAEliminar', JSON.stringify(imagenesAEliminar));

    try {
      await axios.put(
        `https://web-autopartes-backend.onrender.com/publicaciones/${id}`,
        formData,
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
          <Label>Nombre del producto</Label>
          <Input name="nombre_producto" value={form.nombre_producto} onChange={handleInputChange} required />
        </div>
        <div>
          <Label>Marca</Label>
          <Input name="marca" value={form.marca} onChange={handleInputChange} required />
        </div>
        <div>
          <Label>Modelo</Label>
          <Input name="modelo" value={form.modelo} onChange={handleInputChange} required />
        </div>
        <div>
          <Label>Precio</Label>
          <Input name="precio" type="number" value={form.precio} onChange={handleInputChange} required />
        </div>
        <div>
          <Label>Ubicación</Label>
          <Input name="ubicacion" value={form.ubicacion} onChange={handleInputChange} required />
        </div>
        <div>
          <Label>Categoría</Label>
          <Input name="categoria" value={form.categoria} onChange={handleInputChange} required />
        </div>
        <div>
          <Label>Estado</Label>
          <Input name="estado" value={form.estado} onChange={handleInputChange} required />
        </div>

        {/* Imágenes actuales */}
        <div>
          <Label>Imágenes actuales</Label>
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

        {/* Nuevas imágenes */}
        <div>
          <Label>Agregar nuevas imágenes</Label>
          <input
            type="file"
            multiple
            accept=".jpg,.jpeg,.png"
            onChange={handleNuevaImagen}
            className="w-full mt-1 text-gray-900 dark:text-gray-100"
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