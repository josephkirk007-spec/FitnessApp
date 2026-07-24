function DietPlanCard({ plan }) {
  return (
    <article className="plan-card">
      <h2>{plan.title}</h2>

      <p>
        <strong>Client:</strong>{" "}
        {plan.client?.name || "Unknown client"}
      </p>

      <p>
        <strong>Daily calories:</strong>{" "}
        {plan.dailyCalories}
      </p>

      <p>
        <strong>Protein:</strong>{" "}
        {plan.protein} g
      </p>

      <p>
        <strong>Carbohydrates:</strong>{" "}
        {plan.carbs} g
      </p>

      <p>
        <strong>Fat:</strong>{" "}
        {plan.fat} g
      </p>

      <p>
        <strong>Diet preference:</strong>{" "}
        {plan.dietPreference}
      </p>
    </article>
  );
}

export default DietPlanCard;