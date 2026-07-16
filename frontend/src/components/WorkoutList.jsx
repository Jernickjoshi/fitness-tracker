import { useState } from "react";
function WorkoutList({ workout, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(null);
  const [editWeight, setEditWeight] = useState(workout.body_weight_kg);
  const formatTime = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours === 0) {
      return `${minutes} Minutes`; // E.g., "45 Minutes"
    } else if (minutes === 0) {
      return `${hours} Hour${hours > 1 ? "s" : ""}`; // E.g., "1 Hour" or "2 Hours"
    } else {
      return `${hours} Hour${hours > 1 ? "s" : ""} ${minutes} Minutes`; // E.g., "1 Hour 15 Minutes"
    }
  };
  return (
    <div
      key={workout.id}
      style={{
        border: "1px solid grey",
        margin: "10px",
        padding: "10px",
      }}
    >
      <h2>{workout.routine_type} Day</h2>
      <p>{workout.date}</p>
      <p>{formatTime(workout.duration_minutes)}</p>
      {isEditing ? (
        <div style={{ marginBottom: "10px" }}>
          <input
            type="number"
            step="0.1"
            value={editWeight}
            onChange={(e) => setEditWeight(e.target.value)}
            style={{ width: "80px", marginRight: "10px" }}
          />
          <button
            onClick={() => {
              onUpdate(workout.id, editWeight);
              setIsEditing(false);
            }}
            className="map-btn"
          >
            Save
          </button>
          <button onClick={() => setIsEditing(false)} className="map-btn">
            Cancel
          </button>
        </div>
      ) : (
        <div>
          <p>{workout.body_weight_kg} kg</p>
          <button
            className="map-btn"
            onClick={() => setIsEditing(true)} // Turn ON edit mode
          >
            Update weight
          </button>
        </div>
      )}
      <button onClick={() => onDelete(workout.id)} className="map-btn">
        Delete Workout
      </button>
    </div>
  );
}

export default WorkoutList;
