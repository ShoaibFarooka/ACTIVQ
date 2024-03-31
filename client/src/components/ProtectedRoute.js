import React, { useState, useEffect } from 'react';
import '../styles/container.css';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, getUserRole, verifyAuthorization } from '../utils/authUtils';
import Navbar from './Navbar';
import Footer from './Footer';
import Unauthorized from '../pages/Unauthorized';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isAuth = isAuthenticated();
  const [isAuthorized, setIsAuthorized] = useState('empty');
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      const { role, permissions } = await getUserRole();
      setUserRole(role);
      const authorized = verifyAuthorization(role, permissions);
      setIsAuthorized(authorized);
    };

    if (isAuth) {
      fetchUserRole();
    }
  }, [isAuth]);

  return isAuth ? (
    <div className='page'>
      <Navbar />
      {isAuthorized === 'empty' ?
        <div className='content'></div>
        :
        isAuthorized ?
          <div className='content'>
            {React.cloneElement(children, { userRole })}
          </div>
          :
          <div className='content'>
            <Unauthorized />
          </div>
      }
      <Footer />
    </div>
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
};

export default ProtectedRoute;
