import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
          <img src="/logo.svg" alt="MockPro" className="logo-icon" />
          MockPro
        </Link>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/questions">Questions</Link></li>
        <li><Link to="/simulator">Mock Interview</Link></li>
        <li><Link to="/resume">Resume Analysis</Link></li>
        <li><Link to="/aptitude">Aptitude</Link></li>
        <li><Link to="/tips">Tips</Link></li>
      </ul>
      <div className="nav-auth">
        {user ? (
          <>
            <span className="user-name">Hi, {user.name}</span>
            <button onClick={logout} className="auth-btn logout-btn">Sign Out</button>
          </>
        ) : (
          <>
            <Link to="/login" className="auth-btn">Sign In</Link>
            <Link to="/register" className="auth-btn signup-btn">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;