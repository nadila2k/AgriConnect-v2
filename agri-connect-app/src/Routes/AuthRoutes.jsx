import { useSelector } from "react-redux";
import { selectUser, selectIsAuthenticate } from "../features/slices/authSlice";
import { Navigate, Outlet } from "react-router-dom";

const AuthRoutes = () => {

  const user = useSelector(selectUser);
  const isAuthenticate = useSelector(selectIsAuthenticate);

  if(!isAuthenticate) {
    return <Navigate to="/sign-in" />
  }

  return (
    <Outlet />
  )
}

export default AuthRoutes;