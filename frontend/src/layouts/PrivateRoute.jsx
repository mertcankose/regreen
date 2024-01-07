import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const PrivateRoute = ({}) => {
  const { auth } = useContext(AuthContext);
  const location = useLocation();

  return auth?.token ? <Outlet /> : <Navigate to="/" state={{ from: location }} replace />;
};

export default PrivateRoute;
