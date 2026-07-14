import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import Clients from "./pages/Clients";
import AddClients from "./pages/AddClients";
import ClientDetails from "./pages/ClientDetails";
import EditClient from "./pages/EditClients";
import Plans from "./pages/Plans";

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

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/clients/add" element={<AddClients />} />
          <Route path="/clients/:id" element={<ClientDetails />} />
          <Route path="/clients/:id/edit" element={<EditClient />} />
          <Route path="/plans" element={<Plans />} />
        </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;