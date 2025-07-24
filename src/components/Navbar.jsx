// src/components/Navbar.jsx
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/react.svg';

function Navbar() {
  const { pathname } = useLocation();

  const linkClass = (path) =>
    pathname === path
      ? 'text-blue-600 font-semibold'
      : 'text-gray-700 hover:text-blue-500';

  return (
    <nav className="bg-white shadow px-6 py-4 flex gap-6 items-center">
      <img src={logo} alt="ProtestWatch Logo" className="h-8 w-8 mr-2" />
      <span className="text-xl font-bold text-blue-700">ProtestWatch</span>
      <Link to="/" className={linkClass('/')}>Dashboard</Link>
      <Link to="/events" className={linkClass('/events')}>Events</Link>
      <Link to="/report" className={linkClass('/report')}>Report</Link>
    </nav>
  );
}

export default Navbar;
