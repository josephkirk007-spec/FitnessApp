import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api"
import Navbar from "../components/Navbar";
import ClientCard from "../components/ClientCard";
import { useAuth } from "../context/AuthContext";

function Clients() {
    const { user } = useAuth();

    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchClients = async () => {
            try {
                setLoading(true);
                setMessage("");

                const response = await api.get("/clients", {
                    headers: {
                        Authorization: `Bearer ${user.token}`, 
                    },
                });

                setClients(response.data);
            } catch (error) {
                console.error("Fetch clients error:", error);

                if(error.response) {
                    setMessage(
                        error.response.data?.message || `Server error: ${error.response.status}`
                    );
                } else if(error.request) {
                    setMessage(
                        "Cannot reach the backend. Make sure the server is running."
                    );
                } else {
                    setMessage(error.message);
                }
            } finally {
                setLoading(false);
            }
        };

        if (user?.token) {
            fetchClients();
        }
    }, [user]);

    return (
        <>
          <Navbar />

          <main className="clients-page">
            <div className="page-heading">
                <div>
                    <h1> Clients </h1>

                    <p>
                        View and manage the clients connected to your coaching account.
                    </p>
                </div>

                <Link className="primary-link" to="/clients/add">
                  Add Client
                  </Link>
            </div>

            {loading && <p> Loading Clients...</p>}

            {message && <p className="error.message"> {message} </p>}

            {!loading && !message && clients.length === 0 && (
                <section className="empty-state">
                    <h2> No clients yet </h2>

                    <p>
                        Add your first client to begin creating workout and diet plans.
                    </p>

                    <Link className="primary-link" to="/clients/add">
                      Add Your First Client 
                    </Link>
                </section>
            )}

            {!loading && clients.length > 0 && (
                <section className="clients-grid">
                    {clients.map((client) => (
                        <ClientCard key={client._id} client={client} />
                    ))}
                </section>
            )}
          </main>
        </>
    );
}      
        
    
export default Clients;