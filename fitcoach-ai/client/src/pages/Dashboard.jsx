import {useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { captureOwnerStack } from "react";

function Dashboard() {
    const { user } = useAuth();

    const [stats, useStats] = useState({
        clients: 0,
        workoutPlan: 0,
        dietPlans: 0,
    });

    const [loading, setLoading] = useState(true);
    const [message, useMessage] = useState("");

    useEffect(() => {
      const fetchDashboardStats = async () => {
        if(!user.token) {
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            
            const [
                clientsResponse,
                workoutResponse,
                dietResponse
            ] = await Promise.all([
                api.get("/clients", config),
                api.get("/workouts", config),
                api.get("/diets", config),
            ]);

            console.log("Clients response:", clientsResponse.data);
            console.log("Workout response:", workoutResponse.data);
            console.log("Diet response:", dietResponse.data);

            
            const clientsData = Array.isArray(clientsResponse.data)
                ? clientsResponse.data.length
                : clientsResponse.data.clients || [];

            const workoutData = Array.isArray(workoutResponse.data)
                ? workoutResponse.data.length
                : workoutResponse.data.workoutPlans || [];

            const dietData = Array.isArray(dietResponse.data)
                ? dietResponse.data.length 
                : dietResponse.data.dietPlans || [];
            
          setStats ({
            clients: clientsData.length,
            workoutPlans: workoutData.length,
            dietPlans: dietData.length,
          });
        } catch(error) {
            console.error("Dashboard stats error", error);

            setMessage(
                error.response?.data?.message ||
                "Unable to load dashboard statistics"
            );
        } finally {
            setLoading(false);
        }
      };

      fetchDashboardStats();
    }, [user?.token]);


    return (
        <>
         <Navbar />
          
          <main className="dashboard-page">
            <section className="dashboard-header">
                <h1> Welcome, {user?.name || "Coach"} </h1>

                <p>
                    Manage your clients and create personalized workout and diet plans.
                </p>
            </section>

            {message && (
                <p className="error-message">{message}</p>
            )}

            <section className="dashboard-grid">
                <article className="dashboard-card">
                    <h2> Clients </h2>
                    <p> Add and manage your fitness clients. </p>
                    <strong>{loading ? "Loading...": `${stats.clients} Clients`} </strong>
                </article>

                <article className="dashboard-card">
                    <h2> Workout Plans </h2>
                    <p> Create customized weekly workout schedules. </p>
                    <strong>{loading ? "Loading...": `${stats.workoutPlans} Plans`} </strong>
                </article>

                <article className="dashboard-card">
                    <h2> Diet Plans </h2>
                    <p> Create plans based on dietary preferences and restrictions. </p>
                    <strong>{loading ? "Loading...": `${stats.dietPlans} Plans`} </strong>
                </article>

                <article className="dashboard-card">
                    <h2> AI Plan Generator </h2>
                    <p> Generate personalized fitness and nutrition recommendations. </p>
                    <strong>{Number(stats.workoutPlans || 0) + Number(stats.dietPlans || 0)}{" "} Total Plans </strong>
                </article>
            </section>
          </main>
           
         </>
    );
}

export default Dashboard;