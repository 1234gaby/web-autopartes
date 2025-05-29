// src/App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import Home from './pages/home';
import RegisterSuccess from './pages/registersuccess';
import CrearPublicacion from './pages/crearpublicacion';
import MiCuenta from './pages/micuenta';

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
