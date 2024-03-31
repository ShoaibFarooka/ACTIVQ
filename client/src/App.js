import React from 'react';
import "./App.css";
import { Route, Routes, Navigate } from 'react-router-dom';
import Loader from "./components/Loader.js";
import { useSelector } from "react-redux";
import ScrollToTop from './components/ScrollToTop.js';
import ProtectedRoute from './components/ProtectedRoute.js';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import CompanyInfo from './pages/CompanyInformation';
import Users from './pages/Users';
import Clients from './pages/Clients';
import Equipments from './pages/Equipments/index.js';
import Calibrations from './pages/Calibrations/index.js';
import NotFound from './pages/NotFound';
import QMS from './pages/QMS/index.js';

function App() {
  const { loading } = useSelector((state) => state.loader);

  return (
    <div className="App">
      {loading && <Loader />}
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
        />
        <Route path='/' element={<Navigate to="/home" />} />
        <Route path="/company-information" element={
          <ProtectedRoute>
            <CompanyInfo />
          </ProtectedRoute>
        }
        />
        <Route path="/users" element={
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        }
        />
        <Route path="/clients" element={
          <ProtectedRoute>
            <Clients />
          </ProtectedRoute>
        }
        />
        <Route path="/equipments" element={
          <ProtectedRoute>
            <Equipments />
          </ProtectedRoute>
        }
        />
        <Route path="/issue-calibration-report" element={
          <ProtectedRoute>
            <Calibrations />
          </ProtectedRoute>
        }
        />
        <Route path="/qms" element={
          <ProtectedRoute>
            <QMS />
          </ProtectedRoute>
        }
        />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
