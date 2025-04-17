import { Link, Outlet } from 'react-router-dom'

export default function App() {
  return (
    <div>
      <nav>
        <Link to="/">Inicio</Link> | 
        <Link to="/publicar">Publicar</Link> | 
        <Link to="/login">Login</Link>
      </nav>
      <hr />
      <Outlet />
    </div>
  )
}
