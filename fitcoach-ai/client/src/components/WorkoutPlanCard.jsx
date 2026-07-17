import { useState } from "react";
import { Link } from "react-router-dom";

function WorkoutPlanCard({ 
  plan,
  onDelete,
  onUpdate,
  }) {
   const [expanded, setExpanded] = useState(false);

   const clientName = plan.client?.name || "Deleted Client";

   return (
    <article className="workout-plan-card">
      <div className="workout-plan-header">
        <div>
          <h2>{plan.title}</h2>

          <p>
            Client: <strong>{clientName}</strong>
          </p>

          <p>
            Created:{" "}
            {new Date(plan.createdAt).toLocaleDateString()}
          </p>
        </div>

        <span className="plan-status">Saved</span>
      </div>

      {plan.client && (
        <div className="workout-plan-summary">
          <p>
            <strong>Goal:</strong> {plan.client.goal}
          </p>

          <p>
            <strong>Fitness level:</strong>{" "}
            {plan.client.fitnessLevel}
          </p>

          <p>
            <strong>Equipment:</strong>{" "}
            {plan.client.equipment}
          </p>

          <p>
            <strong>Length:</strong> {plan.weeks} weeks
          </p>

          <p>
            <strong>Workout days:</strong>{" "}
            {plan.workoutDays} per week
          </p>
        </div>
      )}

      <div className="plan-card-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={() => setExpanded((current) => !current)}
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

        <button
          type="button"
          className="secondary-button"
          onClick={() => onUpdate(plan)}
        >
          Update Plan
        </button>

        <button
          type="button"
          className="secondary-button"
          onClick={() => onDelete(plan._id)}
        >
          Delete Plan
        </button>
      </div>

      {expanded && (
        <div className="workout-plan-content">
          {plan.exercises?.map((day) => (
            <section
              key={day._id || day.day}
              className="plan-section"
            >
              <h3>{day.day}</h3>

              {day.foucs && (
                <p>
                  <strong>Focus:</strong> {day.focus}
                </p>
              )}

              <ul>
                {day.workout?.map((exercise, index) => (
                  <li key={`${day.day}-${index}`}>
                    {exercise}
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <section className="plan-section">
            <h3>Coach Guidance</h3>

            <p>{plan.notes || "No additional notes."}</p>
          </section>
        </div>
      )}
    </article>
  );
}

export default WorkoutPlanCard;