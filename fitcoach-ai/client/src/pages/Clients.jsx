import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Clients() {
    return (
        <>
        <Navbar /> 

        <main className="clients-page">
            <div className="page-heading">
                <div>
                    <h1> Clients </h1>
                    <p> Manage your fitness coaching clients. </p>
                </div>

                <Link className="primary-link" to="/clients/add">
                  Add Client 
                </Link>
            </div>

            <p> Your saved clients will appear hear. </p>
        </main>
        </>
    );
}

export default Clients;