function ClientForm({
  formData,
  handleChange,
  handleSubmit,
  submitting,
  buttonText,
}) {
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="name">Client name</label>

          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter client name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="age">Age</label>

          <input
            id="age"
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            min="13"
            max="100"
            placeholder="Enter age"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="goal">Fitness goal</label>

          <select
            id="goal"
            name="goal"
            value={formData.goal}
            onChange={handleChange}
            required
          >
            <option value="">Select a goal</option>
            <option value="Lose body fat">Lose body fat</option>
            <option value="Gain muscle">Gain muscle</option>
            <option value="Improve strength">Improve strength</option>
            <option value="Improve endurance">Improve endurance</option>
            <option value="General fitness">General fitness</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="fitnessLevel">Fitness level</label>

          <select
            id="fitnessLevel"
            name="fitnessLevel"
            value={formData.fitnessLevel}
            onChange={handleChange}
            required
          >
            <option value="">Select a level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="workoutDays">Workout days per week</label>

          <input
            id="workoutDays"
            type="number"
            name="workoutDays"
            value={formData.workoutDays}
            onChange={handleChange}
            min="1"
            max="7"
            placeholder="Example: 4"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="equipment">Available equipment</label>

          <select
            id="equipment"
            name="equipment"
            value={formData.equipment}
            onChange={handleChange}
            required
          >
            <option value="">Select equipment</option>
            <option value="Full gym">Full gym</option>
            <option value="Home gym">Home gym</option>
            <option value="Dumbbells only">Dumbbells only</option>
            <option value="Resistance bands">Resistance bands</option>
            <option value="No equipment">No equipment</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="dietPreference">Diet preference</label>

          <select
            id="dietPreference"
            name="dietPreference"
            value={formData.dietPreference}
            onChange={handleChange}
            required
          >
            <option value="">Select a diet</option>
            <option value="Balanced">Balanced</option>
            <option value="High protein">High protein</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Vegan">Vegan</option>
            <option value="Low carbohydrate">Low carbohydrate</option>
            <option value="Mediterranean">Mediterranean</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="foodRestrictions">
            Allergies or foods to avoid
          </label>

          <input
            id="foodRestrictions"
            type="text"
            name="foodRestrictions"
            value={formData.foodRestrictions}
            onChange={handleChange}
            placeholder="Example: dairy, peanuts"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="notes">Coach notes</label>

        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="5"
          placeholder="Add relevant client notes"
        />
      </div>

      <button type="submit" disabled={submitting}>
        {submitting ? "Saving..." : buttonText}
      </button>
    </form>
  );
}

export default ClientForm;