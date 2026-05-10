import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Navbar = () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const admin = JSON.parse(localStorage.getItem('admin'));
  const isAuthenticated = !!token;
  const dashboardPath = admin ? '/admin' : '/dashboard';

  return (
    <nav className="fixed top-0 w-full h-20 z-50 flex items-center bg-slate-950/60 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-6 flex justify-between items-center w-full">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="E-Track PK" className="h-10 w-auto" />
          <span className="text-2xl font-extrabold text-white tracking-tight hidden sm:block">
            E-Track <span className="text-indigo-400">PK</span>
          </span>
        </Link>
        <ul className="hidden md:flex gap-8 items-center list-none">
          <li><a href="#about" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">About</a></li>
          <li><a href="#pricing" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Pricing</a></li>
          <li><a href="#contact" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Contact</a></li>
          
          {isAuthenticated ? (
            <li><Link to={dashboardPath} className="btn-primary py-2 px-5">Go to Dashboard</Link></li>
          ) : (
            <>
              <li><Link to="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Login</Link></li>
              <li><Link to="/signup" className="btn-primary py-2 px-5">Get Started</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
