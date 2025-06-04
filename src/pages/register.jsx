import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Loader2 } from 'lucide-react';
import { LoadingOverlay } from '../components/ui/LoadingOverlay';

// Igual que en login.jsx: motion.create para que funcione bien la animación en Button
const MotionButton = motion.create(Button);

const localidadesBrown = [
  'Adrogué', 'Burzaco', 'Claypole', 'Don Orione', 'Glew', 'José Mármol',
  'Longchamps', 'Malvinas Argentinas', 'Ministro Rivadavia', 'Rafael Calzada', 'San José', 'Solano'
];

function Register() {
  const [tipoCuenta, setTipoCuenta] = useState('mecanico');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [nombreLocal, setNombreLocal] = useState('');
  const [localidad, setLocalidad] = useState('');
  const [dni, setDni] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [afipFile, setAfipFile] = useState(null);
  const [certificadoEstudio, setCertificadoEstudio] = useState(null);
  const [certificadoTrabajo, setCertificadoTrabajo] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('tipoCuenta', tipoCuenta);
    formData.append('nombre', nombre);
    formData.append('apellido', apellido);
    formData.append('localidad', localidad);
    formData.append('dni', dni);
    formData.append('email', email);
    formData.append('password', password);

    if (tipoCuenta === 'vendedor') {
      formData.append('nombreLocal', nombreLocal);
      if (afipFile) formData.append('constanciaAfip', afipFile);
    }

    if (tipoCuenta === 'mecanico') {
      if (certificadoEstudio) formData.append('certificadoEstudio', certificadoEstudio);
      if (certificadoTrabajo) formData.append('certificadoTrabajo', certificadoTrabajo);
    }

    try {
      const res = await fetch('https://web-autopartes-backend.onrender.com/register', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert('Registro exitoso');
        navigate('/');
      } else {
        alert(data.message || 'Error en el registro');
      }
    } catch (error) {
      alert('Error de conexión al servidor');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4"
    >
      {/* Botón toggle modo oscuro */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition"
        aria-label="Toggle Dark Mode"
        title={isDarkMode ? 'Modo claro' : 'Modo oscuro'}
      >
        {isDarkMode ? '🌙' : '☀️'}
      </button>

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
              Registro
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <Label htmlFor="tipoCuenta" className="text-gray-900 dark:text-gray-100">
                  Tipo de cuenta
                </Label>
                <select
                  id="tipoCuenta"
                  aria-label="Tipo de cuenta"
                  value={tipoCuenta}
                  onChange={(e) => setTipoCuenta(e.target.value)}
                  className="w-full mt-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="mecanico">Mecánico</option>
                  <option value="vendedor">Vendedor</option>
                </select>
              </div>

              <div>
                <Label htmlFor="nombre" className="text-gray-900 dark:text-gray-100">Nombre</Label>
                <Input
                  id="nombre"
                  required
                  autoComplete="given-name"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Nombre"
                  className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <Label htmlFor="apellido" className="text-gray-900 dark:text-gray-100">Apellido</Label>
                <Input
                  id="apellido"
                  required
                  autoComplete="family-name"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  placeholder="Apellido"
                  className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <Label htmlFor="localidad" className="text-gray-900 dark:text-gray-100">Localidad</Label>
                <select
                  id="localidad"
                  required
                  value={localidad}
                  onChange={(e) => setLocalidad(e.target.value)}
                  className="w-full mt-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar localidad</option>
                  {localidadesBrown.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="dni" className="text-gray-900 dark:text-gray-100">DNI</Label>
                <Input
                  id="dni"
                  required
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                  placeholder="DNI"
                  className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-gray-900 dark:text-gray-100">Email</Label>
                <Input
                  id="email"
                  required
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-900 dark:text-gray-100">Contraseña</Label>
                <Input
                  id="password"
                  required
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              {tipoCuenta === 'vendedor' && (
                <>
                  <div>
                    <Label htmlFor="nombreLocal" className="text-gray-900 dark:text-gray-100">Nombre del local</Label>
                    <Input
                      id="nombreLocal"
                      required
                      value={nombreLocal}
                      onChange={(e) => setNombreLocal(e.target.value)}
                      placeholder="Nombre del local"
                      className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <Label htmlFor="constanciaAfip" className="text-gray-900 dark:text-gray-100">
                      Constancia AFIP (opcional)
                    </Label>
                    <input
                      id="constanciaAfip"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setAfipFile(e.target.files[0])}
                      className="w-full mt-1 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </>
              )}

              {tipoCuenta === 'mecanico' && (
                <>
                  <div>
                    <Label htmlFor="certificadoEstudio" className="text-gray-900 dark:text-gray-100">
                      Certificado de estudio (opcional)
                    </Label>
                    <input
                      id="certificadoEstudio"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setCertificadoEstudio(e.target.files[0])}
                      className="w-full mt-1 text-gray-900 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <Label htmlFor="certificadoTrabajo" className="text-gray-900 dark:text-gray-100">
                      Certificado de trabajo ARCA (opcional)
                    </Label>
                    <input
                      id="certificadoTrabajo"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setCertificadoTrabajo(e.target.files[0])}
                      className="w-full mt-1 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </>
              )}

              <MotionButton
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-3 rounded"
                disabled={loading}
              >
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Registrarse'}
              </MotionButton>

              <MotionButton
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full mt-2 bg-gray-500 hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-semibold py-3 rounded"
                onClick={() => navigate(-1)}
                disabled={loading}
              >
                Volver
              </MotionButton>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

export default Register;