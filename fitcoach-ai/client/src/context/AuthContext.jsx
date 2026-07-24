import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const navigate = useNavigate();
    
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");

        return savedUser ? JSON.parse(savedUser) : null;
    });

    const saveUser = (userData) => {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    }; 
    
    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
    };

    return (
        <AuthContext.Provider
          value={{
            user,
            saveUser,
            logout,
          }}
          >
            {children}
          </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}