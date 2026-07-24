import { useState } from "react";

function WorkoutPlanCard({
  plan,
  onDelete,
  onUpdate,
}) {
  const [editing, setEditing] =
    useState(false);

  const [formData, setFormData] =
    useState({
      title: plan.title || "",
      weeks: plan.weeks || 4,
      workoutDays:
        plan.workoutDays || 3,
      notes: plan.notes || "",
    });

  const handleChange = (event) => {
    const { name, value } =
      event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    await onUpdate(plan._id, {
      title: formData.title,
      weeks: Number(formData.weeks),
      workoutDays: Number(
        formData.workoutDays
      ),
      notes: formData.notes,
    });

    setEditing(false);
  };

  return (
    <article className="plan-card">
      {!editing ? (
        <>
          <h2>{plan.title}</h2>

          <p>
            <strong>Client:</strong>{" "}
            {plan.client?.name ||
              "Unknown client"}
          </p>

          <p>
            <strong>Weeks:</strong>{" "}
            {plan.weeks}
          </p>

          <p>
            <strong>Training days:</strong>{" "}
            {plan.workoutDays}
          </p>

          {plan.notes && (
            <p>
              <strong>Notes:</strong>{" "}
              {plan.notes}
            </p>
          )}

          <div className="plan-actions">
            <button
              type="button"
              onClick={() =>
                setEditing(true)
              }
            >
              Update Plan
            </button>

            <button
              type="button"
              className="delete-button"
              onClick={() =>
                onDelete(plan._id)
              }
            >
              Delete Plan
            </button>
          </div>
        </>
      ) : (
        <>
          <h2>Edit Workout Plan</h2>

          <label>
            Title
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </label>

          <label>
            Weeks
            <input
              name="weeks"
              type="number"
              min="1"
              value={formData.weeks}
              onChange={handleChange}
            />
          </label>

          <label>
            Training days
            <input
              name="workoutDays"
              type="number"
              min="1"
              max="7"
              value={
                formData.workoutDays
              }
              onChange={handleChange}
            />
          </label>

          <label>
            Notes
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            />
          </label>

          <div className="plan-actions">
            <button
              type="button"
              onClick={handleSave}
            >
              Save Changes
            </button>

            <button
              type="button"
              onClick={() =>
                setEditing(false)
              }
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </article>
  );
}

export default WorkoutPlanCard;