import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ allowedRoles }) {
    const { user } = useAuth();
    
    if(!user) {
        return <Navigate to="/login" replace />;
    }

    if( 
        allowedRoles &&
        !allowedRoles.includes(user.role)
    ) {
        return(
           <Navigate to= {
            user.role === "client" ? "/client-dashboard" : "/dashboard"
           } replace />
        );
    }
    

    return <Outlet />;
}

export default ProtectedRoute;