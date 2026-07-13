import { Link } from "react-router-dom";

function ClientCard({ client }) {
    return (
        <article className="client-card">
            <div className="client-card-header">
                <div>
                    <h2> {client.name} </h2>
                    <p> {client.goal} </p>
                </div>

                <span className="client-level"> {client.fitnessLevel} </span>
            </div>

            <div className="client-card-details">
                <p>
                    <strong> Age:</strong> {client.age}
                </p>

                <p>
                    <strong> Workout Days:</strong> {client.workoutDays} per week
                </p>

                <p> 
                    <strong> Equipment:</strong> {client.equipment}
                </p>

                <p>
                    <strong> Diet:</strong> {client.dietPreference}
                </p>
            </div>

            <Link className="secondary-link" to= {`/clients/${client._id}`}>
               View Client
            </Link>
        </article>
    );
}

export default ClientCard;