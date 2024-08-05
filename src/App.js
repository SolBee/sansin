import React, { createContext, useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import MyProfile from './pages/MyProfile';
import CalendarPage from './pages/Calendar';
import Header from './components/Header';
import './App.css';

export const AuthContext = createContext();

function App() {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null
  });

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      <Router>
        <Header />
        <div className="wrapper">
          <div className="main">
            <main className="content">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/signup" element={<Signup />} />                
                <Route path="/profile" element={<Profile />} />
                <Route path="/myprofile" element={<MyProfile />} />
                <Route path="/calendar" element={<CalendarPage />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
