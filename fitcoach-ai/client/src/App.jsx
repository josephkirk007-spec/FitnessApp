import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import AddClients from "./pages/AddClients";
import ClientsDetails from "./pages/ClientDetails";

function App() {
  const{ user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" 
          element={<Navigate to= {user ? "/dashboard" : "/login"} 
          replace
           />
  }
  />

        <Route path="/register" element={<Register />} />

        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
            </ProtectedRoute> 
        }
        />

        <Route path="/clients" element = {
          <ProtectedRoute>
            <Clients />
          </ProtectedRoute>
        }
        />

        <Route path="/clients/add" element = {
          <ProtectedRoute>
            <AddClient />
          </ProtectedRoute>
        }
        />

        <Route path="/clients/:id" element = {
          <ProtectedRoute>
            <ClientDetails />
          </ProtectedRoute>
        }
        />

        <Route path ="/clients/edit/:id" element = {
          <ProtectedRoute>
            <EditClient />
          </ProtectedRoute>
        }
        />

        <Route path ="/clients/:id" element = {
          <ProtectedRoute>
            <ClientDetails />
          </ProtectedRoute>
        }
        />



        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;