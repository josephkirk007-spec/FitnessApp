import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
    const { user } = useAuth();
    return (
        <>
         <Navbar />
          
          <main className="dashboard-page">
            <section className="dashboard-header">
                <h1> Welcome, {user?.name} </h1>

                <p>
                    Manage your clients and create personalized workout and diet plans.
                </p>
            </section>

            <section className="dashboard-grid">
                <article className="dashboard-card">
                    <h2> Clients </h2>
                    <p> Add and manage your fitness clients. </p>
                    <strong> 0 Clients </strong>
                </article>

                <article className="dashboard-card">
                    <h2> Workout Plans </h2>
                    <p> Create customized weekly workout schedules. </p>
                    <strong> 0 plans </strong>
                </article>

                <article className="dashboard-card">
                    <h2> Diet Plans </h2>
                    <p> Create plans based on dietary preferences and restrictions. </p>
                    <strong> 0 plans </strong>
                </article>

                <article className="dashboard-card">
                    <h2> AI Plan Generator </h2>
                    <p> Generate personalized fitness and nutrition recommendations. </p>
                    <strong> Coming Next </strong>
                </article>
            </section>
          </main>
           
         </>
    );
}

export default Dashboard;