import React from 'react';
import { Navigate } from 'react-router-dom';
const PrivateRoute = ({ user, children }) => {
  // console.log(user);
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
