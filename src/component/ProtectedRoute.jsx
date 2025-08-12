// ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile } from "@/features/auth/authSlice";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const dispatch = useDispatch();
  const { accessToken, user} = useSelector(state => state.auth);

  if (!accessToken) return <Navigate to="/login" />;

  if(!user){
    dispatch(getUserProfile());
  }

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
