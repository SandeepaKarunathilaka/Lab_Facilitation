import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { USER_ROLES } from "../constants/roles";

const CheckLoginStatus = () => {
  const user = useAuthStore.getState().user;

  if (!user) {
    return <Outlet />;
  }

  const permissionLevel = user.role;

  if (permissionLevel === USER_ROLES.ADMIN) {
    return <Navigate to="/admin" />;
  } else if (permissionLevel === USER_ROLES.PATIENT) {
    return <Navigate to="/patient" />;
  } else {
    return <Outlet />;
  }
};

export default CheckLoginStatus;
