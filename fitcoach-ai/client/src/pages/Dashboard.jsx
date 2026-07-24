import {useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { captureOwnerStack } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        clients: 0,
        workoutPlans: 0,
        dietPlans: 0,
    });

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

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

            const results = await Promise.allSettled([
                api.get("/clients", config),
                api.get("/workouts", config),
                api.get("/diets", config),
            ]);
            
            const [
                clientsResult,
                workoutResult,
                dietResult
            ] = results;



            console.log("Clients Result:", clientsResult);
            console.log("Workout Result:", workoutResult);
            console.log("Diet Result:", dietResult);

            const clientsResponse = 
              clientsResult.status === "fulfilled"
               ? clientsResult.value.data 
               : [];
            
            const workoutResponse =
              workoutResult.status === "fulfilled"
               ? workoutResult.value.data 
               : [];

            const dietResponse =
             dietResult.status === "fulfilled"
              ? dietResult.value.data
              : [];

            
            const clients = Array.isArray(clientsResponse)
                ? clientsResponse
                : clientsResponse?.clients || [];

            const workoutPlans = Array.isArray(workoutResponse)
                ? workoutResponse
                : workoutResponse?.workoutPlans ||
                  workoutResponse?.plans || [];

            const dietPlans = Array.isArray(dietResponse)
                ? dietResponse
                : dietResponse?.dietPlans || 
                  dietResponse?.plans || [];
            
          setStats ({
            clients: clients.length,
            workoutPlans: workoutPlans.length,
            dietPlans: dietPlans.length,
          });

          const failedRequests = results.filter(
            (result) => result.status === "rejected"
          );

          if(failedRequests.length > 0) {
            console.error(
                "Failed Dashboard Requests:", 
                failedRequests
            );

            setMessage(
                `${failedRequests.length} dashboard request(s) failed. Check the browser console.`
            );
          } else {
            setMessage("");
          }
        } catch(error) {
            console.error("Dashboard stats error", error);
            console.error("Status:", error.response?.status);
            console.error("Server Response:", error.response?.data);
            console.error("Request URL:", error.config?.url);

            setMessage(
                error.response?.data?.message ||
                `Unable to load dashboard statistics ${error.response?.status
                 ? `(${error.response.status})`: " "
            }`
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
                <article className="dashboard-card clickable card"
                 onClick={() => navigate("/clients")}>
                    <h2> Clients </h2>
                    <p> Add and manage your fitness clients. </p>
                    <strong>{loading ? "Loading...": `${stats.clients} Clients`} </strong>
                </article>

                <article className="dashboard-card clickable card"
                 onClick={() => navigate("/saved-plans?type=workout")}>
                    <h2> Workout Plans </h2>
                    <p> Create customized weekly workout schedules. </p>
                    <strong>{loading ? "Loading...": `${stats.workoutPlans} Plans`} </strong>
                </article>

                <article className="dashboard-card clickable card"
                 onClick={() => navigate("/saved-plans?type=diet")}>
                    <h2> Diet Plans </h2>
                    <p> Create plans based on dietary preferences and restrictions. </p>
                    <strong>{loading ? "Loading...": `${stats.dietPlans} Plans`} </strong>
                </article>

                <article className="dashboard-card clickable card"
                 onClick={() => navigate("/clients")}>
                    <h2>  Total Plans </h2>
                    <p> Generate personalized fitness and nutrition recommendations. </p>
                    <strong>{Number(stats.workoutPlans || 0) + Number(stats.dietPlans || 0)}{" "} Total Plans </strong>
                </article>
            </section>
          </main>
           
         </>
    );
}

export default Dashboard;