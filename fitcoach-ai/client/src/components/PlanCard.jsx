import { useState } from "react";
import { Link } from "react-router-dom";

function PlanCard({ plan }) {
  const [expanded, setExpanded] = useState(false);

  const clientName = plan.client?.name || "Deleted client";

  return (
    <article className="plan-card">
      <div className="plan-card-header">
        <div>
          <h2>{clientName}</h2>

          <p>
            Created{" "}
            {new Date(plan.createdAt).toLocaleDateString()}
          </p>
        </div>

        <span className="plan-status">Saved</span>
      </div>

      {plan.client && (
        <div className="plan-client-summary">
          <p>
            <strong>Goal:</strong> {plan.client.goal}
          </p>

          <p>
            <strong>Fitness level:</strong>{" "}
            {plan.client.fitnessLevel}
          </p>

          <p>
            <strong>Diet:</strong>{" "}
            {plan.client.dietPreference}
          </p>
        </div>
      )}

      <div className="plan-card-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Hide Plan" : "View Plan"}
        </button>

        {plan.client?._id && (
          <Link
            className="secondary-link"
            to={`/clients/${plan.client._id}`}
          >
            View Client
          </Link>
        )}
      </div>

      {expanded && (
        <div className="plan-card-content">
          <section className="plan-section">
            <h3>Workout Plan</h3>
            <pre>{plan.workoutPlan}</pre>
          </section>

          <section className="plan-section">
            <h3>Diet Plan</h3>
            <pre>{plan.dietPlan}</pre>
          </section>
        </div>
      )}
    </article>
  );
}

export default PlanCard;