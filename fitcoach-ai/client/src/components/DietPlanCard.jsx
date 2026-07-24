import { useState } from "react";

function DietPlanCard({
  plan,
  onDelete,
  onUpdate,
}) {
  const [editing, setEditing] =
    useState(false);

  const [formData, setFormData] =
    useState({
      title: plan.title || "",
      dailyCalories:
        plan.dailyCalories || 0,
      protein: plan.protein || 0,
      carbs: plan.carbs || 0,
      fat: plan.fat || 0,
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
      dailyCalories: Number(
        formData.dailyCalories
      ),
      protein: Number(
        formData.protein
      ),
      carbs: Number(formData.carbs),
      fat: Number(formData.fat),
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
            <strong>Calories:</strong>{" "}
            {plan.dailyCalories}
          </p>

          <p>
            <strong>Protein:</strong>{" "}
            {plan.protein} g
          </p>

          <p>
            <strong>Carbs:</strong>{" "}
            {plan.carbs} g
          </p>

          <p>
            <strong>Fat:</strong>{" "}
            {plan.fat} g
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
          <h2>Edit Diet Plan</h2>

          <label>
            Title
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </label>

          <label>
            Daily calories
            <input
              name="dailyCalories"
              type="number"
              min="0"
              value={
                formData.dailyCalories
              }
              onChange={handleChange}
            />
          </label>

          <label>
            Protein
            <input
              name="protein"
              type="number"
              min="0"
              value={formData.protein}
              onChange={handleChange}
            />
          </label>

          <label>
            Carbohydrates
            <input
              name="carbs"
              type="number"
              min="0"
              value={formData.carbs}
              onChange={handleChange}
            />
          </label>

          <label>
            Fat
            <input
              name="fat"
              type="number"
              min="0"
              value={formData.fat}
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

export default DietPlanCard;