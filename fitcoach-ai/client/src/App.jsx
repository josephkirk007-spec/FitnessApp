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
import SavedPlans from "./pages/SavedPlans";
import BackgroundLayout from "./components/BackgroundLayout";
import Footer from "./components/Footer";
import ForgotPassword from "./pages/ForgotPassword";
import ClientDashboard from "./pages/ClientDashboard";

function App() {
  const{ user } = useAuth();

  return (
         <BackgroundLayout>
          <Routes>
            <Route path="/" 
              element={<Navigate to= { !user ? "/login" : user.role === "client" ? "/client-dashboard" : "/dashboard"
              }
              replace
              />
          }
        />

            <Route path="/register" element={<Register />} />

            <Route path="/login" element={<Login />} />

            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/clients/add" element={<AddClients />} />
              <Route path="/clients/:id" element={<ClientDetails />} />
              <Route path="/clients/:id/edit" element={<EditClient />} />
              <Route path="/plans" element={<Plans />} />
              <Route path="/saved-plans" element={<SavedPlans />} />
              <Route path="/client-dashboard" element={<ClientDashboard />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />
        </BackgroundLayout>
  );
}

export default App;