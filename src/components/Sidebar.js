// src/components/Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Menu</h2>
      <nav>
        <ul>
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>Home</NavLink>
          </li>
          <li>
            <NavLink to="/filter" className={({ isActive }) => (isActive ? 'active' : '')}>Filter</NavLink>
          </li>
          <li>
            <NavLink to="/meeting" className={({ isActive }) => (isActive ? 'active' : '')}>1on1 Meeting</NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
