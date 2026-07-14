import { useState, useEffect } from "react";
import "./App.css";
import supabase from "./supabaseClient";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
const API_URL = "https://fitness-tracker-api-z3i9.onrender.com/api/workouts";
function App() {
  const [workouts, setWorkouts] = useState([]);
  const [date, setDate] = useState("");
  const [routineType, setRoutineType] = useState("Push");
  const [durationTime, setDurationTime] = useState("");
  const [weight, setWeight] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
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
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      method: "DELETE",
    });
    setWorkouts(workouts.filter((workout) => workout.id != id));
  };
  const handleUpdate = async (workout) => {
    const newWeight = prompt("Enter new body weight: ", workout.body_weight_kg);
    const updatedWorkout = { ...workout, body_weight_kg: newWeight };
    await fetch(`${API_URL}/${workout.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(updatedWorkout),
    });
    setWorkouts(
      workouts.map((w) => (w.id === workout.id ? updatedWorkout : w)),
    );
  };
  const handleSignUp = async () => {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    if (error) {
      setErrorMessage(error.message); // Show the error on screen!
    } else {
      setErrorMessage(""); // Clear the error if successful
    }
  };
  const handleLogIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) {
      setErrorMessage(error.message); // Show the error on screen!
    } else {
      setErrorMessage(""); // Clear the error if successful
    }
  };
  const handleSignOut = async () => {
    const { data, error } = await supabase.auth.signOut();
  };
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);
  useEffect(() => {
    const fetchWorkouts = async () => {
      // If there is no active session, do not try to fetch data!
      if (!session) return;

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          // Flash the ID badge to the backend!
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setWorkouts(data);
      }
    };

    fetchWorkouts();
  }, [session]);
  const sortedWorkouts = [...workouts].sort(
    (a, b) => new Date(a.date) - new Date(b.date),
  );
  if (!session) {
    return (
      <div className="auth-container">
        <h1>My Fitness Tracker💪</h1>
        <input
          className="auth-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div>
          <button className="auth-btn" onClick={handleSignUp}>
            Sign Up
          </button>
          <button className="auth-btn" onClick={handleLogIn}>
            Log In
          </button>
          <p className="error-message">{errorMessage}</p>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <h1>My Fitness Tracker💪</h1>
        <form onSubmit={handleSubmit} className="workout-form">
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
          <p className="error-message">{errorMessage}</p>
        </form>
        {workouts.length > 0 && (
          <div>
            <h1>Weight Progress Chart</h1>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sortedWorkouts}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" stroke="#fff" tick={{ fill: "#fff" }} />
                <YAxis
                  stroke="#fff"
                  tick={{ fill: "#fff" }}
                  domain={["dataMin - 2", "dataMax + 2"]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#2a2a2a",
                    border: "1px solid #1db954",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  itemStyle={{ color: "#1db954" }}
                />
                <Line
                  type="monotone"
                  dataKey="body_weight_kg"
                  name="Weight(kg)"
                  stroke="#1db954"
                  strokeWidth={3}
                  dot={{
                    r: 5,
                    fill: "#121212",
                    stroke: "#1db954",
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        {workouts.map((workout) => (
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
            <p>{workout.duration_minutes} Minutes</p>
            <p>{workout.body_weight_kg} kg</p>
            <button
              onClick={() => handleDelete(workout.id)}
              className="map-btn"
            >
              Delete Workout
            </button>
            <button onClick={() => handleUpdate(workout)} className="map-btn">
              Update weight
            </button>
          </div>
        ))}
        <button onClick={handleSignOut}>Log Out</button>
      </div>
    );
  }
}

export default App;
