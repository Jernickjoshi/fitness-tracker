function WorkoutForm({
  date,
  setDate,
  errorMessage,
  setErrorMessage,
  submitForm,
  routineType,
  setRoutineType,
  weight,
  setWeight,
  durationTime,
  setDurationTime,
}) {
  return (
    <form onSubmit={submitForm} className="workout-form">
      <input
        className="input-field"
        type="date"
        placeholder="Date"
        value={date}
        onChange={(e) => {
          setDate(e.target.value);
          setErrorMessage("");
        }}
      />
      <select
        className="input-field"
        value={routineType}
        onChange={(e) => {
          setRoutineType(e.target.value);
          setErrorMessage("");
        }}
      >
        <option value="push">Push</option>
        <option value="pull">Pull</option>
        <option value="legs">Legs</option>
        <option value="cardio">Cardio</option>
      </select>
      <input
        className="input-field"
        type="number"
        placeholder="Duration (minutes)"
        value={durationTime}
        onChange={(e) => {
          setDurationTime(e.target.value);
          setErrorMessage("");
        }}
      />
      <input
        className="input-field"
        type="number"
        step="0.1"
        placeholder="Body Weight (kg)"
        value={weight}
        onChange={(e) => {
          setWeight(e.target.value);
          setErrorMessage("");
        }}
      />
      <button type="submit" className="submit-btn">
        Add Workout
      </button>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </form>
  );
}

export default WorkoutForm;
