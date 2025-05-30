import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button.jsx';
import { Input } from '../components/ui/input.jsx';
import { Label } from '../components/ui/label.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Loader2 } from 'lucide-react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <Card className="w-full max-w-md p-6">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Iniciar sesión</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" disabled={loading} className="flex items-center justify-center">
              {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
              Iniciar sesión
            </Button>
          </form>

          <div className="mt-6 space-y-3">
            <Button
              onClick={irARegistro}
              className="w-full bg-gray-300 text-gray-800 hover:bg-gray-400"
            >
              Registrarse
            </Button>

            <Button
              onClick={continuarComoInvitado}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Continuar como invitado
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
