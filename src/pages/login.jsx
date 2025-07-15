import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent } from '../components/ui/card';
import { Loader2 } from 'lucide-react';
import { LoadingOverlay } from '../components/ui/LoadingOverlay';
import DeLoreanImg from './DELOREAN.png';

const MotionButton = motion(Button);

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

    // Acceso directo para admin
    if (email === 'admin@admin.com' && password === 'admin') {
      localStorage.setItem('email', email);
      localStorage.setItem('password', password);
      setLoading(false);
      navigate('/admin');
      return;
    }

    try {
      const response = await fetch('https://web-autopartes-backend.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('user_id', data.user_id);
        localStorage.setItem('perfil', data.tipoCuenta);
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
      <LoadingOverlay loading={loading} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="p-0 bg-white/95 dark:bg-gray-800/95 shadow-2xl rounded-3xl overflow-hidden border-0">
          {/* Header moderno con imagen DeLorean */}
          <div className="bg-white dark:bg-gray-800 py-8 px-6 flex flex-col items-center border-b border-gray-200 dark:border-gray-700">
            <img
              src={DeLoreanImg}
              alt="DeLorean"
              className="mb-2"
              style={{
                width: 240,
                height: 120,
                objectFit: 'contain',
                background: 'transparent',
                boxShadow: '0 4px 24px 0 rgba(37,99,235,0.10)',
                borderRadius: '0.75rem',
                border: 'none',
                display: 'block',
              }}
              loading="lazy"
            />
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1 tracking-tight drop-shadow flex items-center gap-2">
              DeLorean Parts
            </h1>
            <p className="text-gray-500 dark:text-gray-300 text-center text-base">
              Iniciá sesión para viajar al futuro de los repuestos.
            </p>
          </div>
          <CardContent className="py-8 px-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="email" className="text-gray-900 dark:text-gray-100 font-semibold">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="username"
                  className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 mt-1"
                  placeholder="tu@email.com"
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-gray-900 dark:text-gray-100 font-semibold">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 mt-1"
                  placeholder="Contraseña"
                />
              </div>

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => navigate('/recuperacion')}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline focus:outline-none transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              <MotionButton
                type="submit"
                disabled={loading}
                className="flex items-center justify-center w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold py-2 rounded-full shadow-lg transition-transform duration-150"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                Iniciar sesión
              </MotionButton>
            </form>

            <div className="mt-8 space-y-3">
              <MotionButton
                onClick={irARegistro}
                className="w-full bg-blue-50 dark:bg-gray-700 border border-blue-500 text-blue-800 dark:text-blue-200 font-semibold rounded-full shadow hover:bg-blue-100 dark:hover:bg-gray-600 transition-transform duration-150"
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Registrarse
              </MotionButton>

              <MotionButton
                onClick={continuarComoInvitado}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full shadow transition-transform duration-150"
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