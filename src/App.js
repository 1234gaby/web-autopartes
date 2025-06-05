// src/App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import Home from './pages/home';
import RegisterSuccess from './pages/registersuccess';
import CrearPublicacion from './pages/crearpublicacion';
import MiCuenta from './pages/micuenta';
import Recuperacion from './pages/recuperacion';
import RecuperacionContraseña from './pages/recuperacioncontraseña';
import EditarPerfil from './pages/editarperfil';
import MisPublicaciones from './pages/mispublicaciones';
import EditarPublicacion from './pages/editarpublicacion'; // <-- Agregado

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/registersuccess" element={<RegisterSuccess />} />
        <Route path="/crearpublicacion" element={<CrearPublicacion />} />
        <Route path="/micuenta" element={<MiCuenta />} />
        <Route path="/recuperacion" element={<Recuperacion />} />
        <Route path="/recuperacion/recuperacion" element={<RecuperacionContraseña />} />
        <Route path="/editar-perfil" element={<EditarPerfil />} />
        <Route path="/mis-publicaciones" element={<MisPublicaciones />} />
        <Route path="/editar-publicacion/:id" element={<EditarPublicacion />} /> {/* <-- Agregado */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;