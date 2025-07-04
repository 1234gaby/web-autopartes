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
import EditarPublicacion from './pages/editarpublicacion';
import VerPublicacion from './pages/verpublicacion';
import Compra from './pages/compra';
import MisCompras from './pages/miscompras';
import MisVentas from './pages/misventas';
import Admin from './pages/admin';
import AdminCuentas from './pages/admincuentas';
import AdminVentas from './pages/adminventas';
import { DarkModeProvider } from './context/DarkModeContext';
import { DarkModeToggle } from './components/DarkModeToggle';

function App() {
  return (
    <DarkModeProvider>
      <BrowserRouter>
        {/* Botón de modo oscuro/claro siempre visible en la esquina inferior derecha */}
        <DarkModeToggle />
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
          <Route path="/mis-compras" element={<MisCompras />} />
          <Route path="/editar-publicacion/:id" element={<EditarPublicacion />} />
          <Route path="/publicacion/:id" element={<VerPublicacion />} />
          <Route path="/compra/:id" element={<Compra />} />
          <Route path="/mis-ventas" element={<MisVentas />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admincuentas" element={<AdminCuentas />} />
          <Route path="/adminventas" element={<AdminVentas />} />
        </Routes>
      </BrowserRouter>
    </DarkModeProvider>
  );
}

export default App;