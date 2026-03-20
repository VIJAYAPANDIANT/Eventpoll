import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function UserPrivateRoute() {
  const userToken = localStorage.getItem("userToken");
  const adminToken = localStorage.getItem("adminToken");

  return (
    (userToken || adminToken) ? <Outlet/> : <Navigate to="/signin" />
  );
}

export default UserPrivateRoute
