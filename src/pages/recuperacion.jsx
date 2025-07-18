import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Loader2 } from 'lucide-react';
import { LoadingOverlay } from '../components/ui/LoadingOverlay';

const MotionButton = motion.create(Button);

export default function Recuperacion() {
  const [email, setEmail] = useState('');
  const [dni, setDni] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });


  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje('');
    try {
      const res = await fetch('https://web-autopartes-backend.onrender.com/recuperacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, dni }),
      });
      const data = await res.json();
      setMensaje(data.message || data.error);
    } catch (error) {
      setMensaje('Error de conexión al servidor');
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
              Recuperar contraseña
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-gray-900 dark:text-gray-100">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="Tu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <Label htmlFor="dni" className="text-gray-900 dark:text-gray-100">DNI</Label>
                <Input
                  id="dni"
                  type="text"
                  required
                  placeholder="Tu DNI"
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
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
                Enviar enlace de recuperación
              </MotionButton>
              {mensaje && (
                <div className="mt-2 text-center text-sm text-blue-700 dark:text-blue-300">
                  {mensaje}
                </div>
              )}
              <MotionButton
                type="button"
                onClick={() => navigate('/')}
                className="w-full mt-2 bg-gray-300 text-gray-800 hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 transition-transform duration-150"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Volver al inicio
              </MotionButton>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}