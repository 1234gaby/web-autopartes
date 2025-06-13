import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ADMIN_EMAIL = 'admin@admin.com';
const ADMIN_PASS = 'admin';

const Admin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica si el usuario logueado es el admin
    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password');
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASS) {
      navigate('/'); // Redirige si no es admin
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4"
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl font-extrabold mb-8 text-blue-900 dark:text-blue-200 drop-shadow"
      >
        Panel de Administración
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col gap-6 w-full max-w-md"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="w-full px-6 py-4 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-800 dark:to-blue-600 text-white font-bold text-xl shadow-lg transition-all duration-200"
          onClick={() => navigate('/admincuentas')}
        >
          Control de cuentas
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="w-full px-6 py-4 rounded-lg bg-gradient-to-r from-green-600 to-green-400 dark:from-green-800 dark:to-green-600 text-white font-bold text-xl shadow-lg transition-all duration-200"
          onClick={() => navigate('/adminventas')}
        >
          Control de ventas
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-gray-400 to-gray-600 dark:from-gray-700 dark:to-gray-900 text-white font-semibold shadow transition-all duration-200 mt-4"
          onClick={handleLogout}
        >
          Cerrar sesión
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Admin;