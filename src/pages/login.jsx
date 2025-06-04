import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Loader2 } from 'lucide-react';
import { LoadingOverlay } from '../components/ui/LoadingOverlay';

// Cambiado motion(Button) por motion.create(Button)
const MotionButton = motion.create(Button);

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Estado para modo oscuro, inicia desde localStorage o preferencia sistema
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

    try {
      const response = await fetch('https://web-autopartes-backend.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('user_id', data.user_id);
        localStorage.setItem('perfil', data.tipoCuenta); // Guarda el tipo de cuenta como perfil
        navigate('/home');
      } else {
        alert('Login incorrecto');
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      alert('Error de conexión al servidor');
    } finally {
      setLoading(false);
    }
  };

  const continuarComoInvitado = () => navigate('/home');
  const irARegistro = () => navigate('/register');

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
        className="w-full max-w-md"
      >
        <Card className="p-6 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-gray-900 dark:text-gray-100">
              Iniciar sesión
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-gray-900 dark:text-gray-100">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="username"
                  className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-gray-900 dark:text-gray-100">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <MotionButton
                type="submit"
                disabled={loading}
                className="flex items-center justify-center w-full transition-transform duration-150"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                Iniciar sesión
              </MotionButton>
            </form>

            <div className="mt-6 space-y-3">
              <MotionButton
                onClick={irARegistro}
                className="w-full bg-gray-300 text-gray-800 hover:bg-gray-400 transition-transform duration-150"
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Registrarse
              </MotionButton>

              <MotionButton
                onClick={continuarComoInvitado}
                className="w-full bg-green-600 hover:bg-green-700 text-white transition-transform duration-150"
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Continuar como invitado
              </MotionButton>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

export default Login;