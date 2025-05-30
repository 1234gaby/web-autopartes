import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
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
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
              Iniciar sesión
            </Button>
          </form>

          <div className="mt-6 space-y-3">
            <Button
              variant="secondary"
              className="w-full"
              onClick={irARegistro}
            >
              Registrarse
            </Button>

            <Button
              variant="success"
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={continuarComoInvitado}
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
