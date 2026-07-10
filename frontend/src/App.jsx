import { useState, useEffect } from "react";
import "./App.css";

const API_URL = "https://fitness-tracker-api-z3i9.onrender.com/api/workouts";
function App() {
  const [workouts, setWorkouts] = useState([]);
  const [date, setDate] = useState("");
  const [routineType, setRoutineType] = useState("Push");
  const [durationTime, setDurationTime] = useState("");
  const [weight, setWeight] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (date === "" || durationTime === "" || weight === "") {
      setErrorMessage("Please fill out all fields");
      return;
    }

    const newWorkout = {
      date: date,
      routine_type: routineType,
      duration_minutes: durationTime,
      body_weight_kg: weight,
    };
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newWorkout),
    });
    const responseData = await response.json();
    setWorkouts([...workouts, responseData[0]]);
    setDate("");
    setRoutineType("Push");
    setDurationTime("");
    setWeight("");
  };
  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    setWorkouts(workouts.filter((workout) => workout.id != id));
  };
  const handleUpdate = async (workout) => {
    const newWeight = prompt("Enter new body weight: ", workout.body_weight_kg);
    const updatedWorkout = { ...workout, body_weight_kg: newWeight };
    await fetch(`${API_URL}/${workout.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedWorkout),
    });
    setWorkouts(
      workouts.map((w) => (w.id === workout.id ? updatedWorkout : w)),
    );
  };
  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        setWorkouts(data);
      })
      .catch((error) => console.log("Error fetching workouts:", error));
  }, []);
  return (
    <div>
      <h1>My Fitness Tracker</h1>
      <form onSubmit={handleSubmit} className="workout-form">
        <input
          className="input-field"
          type="date"
          placeholder="Date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setDate(setErrorMessage(""));
          }}
        />
        <select
          className="input-field"
          value={routineType}
          onChange={(e) => {
            setRoutineType(e.target.value);
            setRoutineType(setErrorMessage(""));
          }}
        >
          <option value="push">Push</option>
          <option value="pull">Pull</option>
          <option value="legs">Legs</option>
        </select>
        <input
          className="input-field"
          type="number"
          placeholder="Duration (minutes)"
          value={durationTime}
          onChange={(e) => {
            setDurationTime(e.target.value);
            setDurationTime(setErrorMessage(""));
          }}
        />
        <input
          className="input-field"
          type="number"
          placeholder="Body Weight (kg)"
          value={weight}
          onChange={(e) => {
            setWeight(e.target.value);
            setWeight(setErrorMessage(""));
          }}
        />
        <button type="submit" className="submit-btn">
          Add Workout
        </button>
        <p className="error-message">{errorMessage}</p>
      </form>
      {workouts.map((workout) => (
        <div
          key={workout.id}
          style={{ border: "1px solid grey", margin: "10px", padding: "10px" }}
        >
          <h2>{workout.routine_type} Day</h2>
          <p>{workout.date}</p>
          <p>{workout.duration_minutes} Minutes</p>
          <p>{workout.body_weight_kg} kg</p>
          <button onClick={() => handleDelete(workout.id)} className="map-btn">
            Delete Workout
          </button>
          <button onClick={() => handleUpdate(workout)} className="map-btn">
            Update weight
          </button>
        </div>
      ))}
    </div>
  );
}
export default App;
