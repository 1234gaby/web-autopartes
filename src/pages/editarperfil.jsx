import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Loader2 } from 'lucide-react';
import { LoadingOverlay } from '../components/ui/LoadingOverlay';
import axios from 'axios';

const MotionButton = motion.create(Button);

const EditarPerfil = () => {
  const [usuario, setUsuario] = useState(null);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [telefono, setTelefono] = useState('');
  const [nombreLocal, setNombreLocal] = useState('');
  const [afipFile, setAfipFile] = useState(null);
  const [certificadoEstudio, setCertificadoEstudio] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (!userId) return;

    setLoading(true);
    axios.get(`https://web-autopartes-backend.onrender.com/usuarios/${userId}`)
      .then(res => {
        setUsuario(res.data);
        setNombre(res.data.nombre || '');
        setApellido(res.data.apellido || '');
        setEmail(res.data.email || '');
        setContrasena(res.data.contrasena || res.data.password || '');
        setTelefono(res.data.telefono || '');
        setNombreLocal(res.data.nombre_local || '');
      })
      .catch(err => console.error('Error al cargar usuario', err))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usuario) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('apellido', apellido);
    formData.append('email', email);
    formData.append('contrasena', contrasena);
    formData.append('telefono', telefono);
    if (usuario.tipo_cuenta === 'vendedor') {
      formData.append('nombre_local', nombreLocal);
    }
    if (afipFile) formData.append('constanciaAfip', afipFile);
    if (certificadoEstudio && usuario.tipo_cuenta !== 'vendedor') {
      formData.append('certificadoEstudio', certificadoEstudio);
    }

    try {
      const res = await fetch(`https://web-autopartes-backend.onrender.com/usuarios/${usuario.id}`, {
        method: 'PUT',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert('Perfil actualizado correctamente');
        navigate('/micuenta');
      } else {
        alert(data.message || 'Error al actualizar el perfil');
      }
    } catch (error) {
      alert('Error de conexión al servidor');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!usuario) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <LoadingOverlay loading={true} />
        <div className="text-center py-10 text-gray-600 dark:text-gray-400">Cargando...</div>
      </div>
    );
  }

  const esVendedor = usuario.tipo_cuenta === 'vendedor';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4"
    >
      <LoadingOverlay loading={loading} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl"
      >
        <Card className="p-6 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-gray-900 dark:text-gray-100">
              Editar Perfil
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Campos solo lectura */}
              <div>
                <Label className="text-gray-900 dark:text-gray-100">ID</Label>
                <Input value={usuario.id} disabled className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
              </div>
              <div>
                <Label className="text-gray-900 dark:text-gray-100">DNI</Label>
                <Input value={usuario.dni} disabled className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
              </div>
              <div>
                <Label className="text-gray-900 dark:text-gray-100">Tipo de cuenta</Label>
                <Input value={usuario.tipo_cuenta} disabled className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
              </div>

              {/* Campos editables */}
              <div>
                <Label htmlFor="nombre" className="text-gray-900 dark:text-gray-100">Nombre</Label>
                <Input
                  id="nombre"
                  required
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  placeholder="Nombre"
                  className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <Label htmlFor="apellido" className="text-gray-900 dark:text-gray-100">Apellido</Label>
                <Input
                  id="apellido"
                  required
                  value={apellido}
                  onChange={e => setApellido(e.target.value)}
                  placeholder="Apellido"
                  className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <Label htmlFor="telefono" className="text-gray-900 dark:text-gray-100">Teléfono</Label>
                <Input
                  id="telefono"
                  required
                  type="tel"
                  pattern="[0-9]{6,20}"
                  inputMode="tel"
                  value={telefono}
                  onChange={e => {
                    // Solo permite números
                    const val = e.target.value.replace(/\D/g, '');
                    setTelefono(val);
                  }}
                  placeholder="Ej: 1122334455"
                  className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  maxLength={20}
                  minLength={6}
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-gray-900 dark:text-gray-100">Email</Label>
                <Input
                  id="email"
                  required
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Email"
                  className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <Label htmlFor="contrasena" className="text-gray-900 dark:text-gray-100">Contraseña</Label>
                <Input
                  id="contrasena"
                  required
                  type="password"
                  value={contrasena}
                  onChange={e => setContrasena(e.target.value)}
                  placeholder="Contraseña"
                  className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              {esVendedor && (
                <div>
                  <Label htmlFor="nombre_local" className="text-gray-900 dark:text-gray-100">Nombre del local</Label>
                  <Input
                    id="nombre_local"
                    value={nombreLocal}
                    onChange={e => setNombreLocal(e.target.value)}
                    placeholder="Nombre del local"
                    className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              )}

              {/* Carga de archivos */}
              <div>
                <Label htmlFor="constanciaAfip" className="text-gray-900 dark:text-gray-100">
                  Constancia de AFIP / ARCA (opcional)
                </Label>
                <input
                  id="constanciaAfip"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={e => setAfipFile(e.target.files[0])}
                  className="w-full mt-1 text-gray-900 dark:text-gray-100"
                />
                {usuario.constancia_afip_url && (
                  <div className="mt-1">
                    <a href={usuario.constancia_afip_url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline text-sm">
                      Ver archivo actual
                    </a>
                  </div>
                )}
              </div>
              {!esVendedor && (
                <div>
                  <Label htmlFor="certificadoEstudio" className="text-gray-900 dark:text-gray-100">
                    Certificado de estudio (opcional)
                  </Label>
                  <input
                    id="certificadoEstudio"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={e => setCertificadoEstudio(e.target.files[0])}
                    className="w-full mt-1 text-gray-900 dark:text-gray-100"
                  />
                  {usuario.certificado_estudio_url && (
                    <div className="mt-1">
                      <a href={usuario.certificado_estudio_url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline text-sm">
                        Ver archivo actual
                      </a>
                    </div>
                  )}
                </div>
              )}

              <MotionButton
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-3 rounded"
                disabled={loading}
              >
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Guardar cambios'}
              </MotionButton>

              <MotionButton
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full mt-2 bg-gray-500 hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-semibold py-3 rounded"
                onClick={() => navigate('/micuenta')}
                disabled={loading}
              >
                Cancelar
              </MotionButton>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default EditarPerfil;