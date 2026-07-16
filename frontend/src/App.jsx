import { useState, useEffect } from "react";
import "./App.css";
import supabase from "./supabaseClient";
import "./components/ProfileHeader";
import AuthScreen from "./components/AuthScreen";
import WorkoutForm from "./components/WorkoutForm";
import ProgressChart from "./components/ProgressChart";
import ProfileHeader from "./components/ProfileHeader";
import WorkoutList from "./components/WorkoutList";
const API_URL = "https://fitness-tracker-api-z3i9.onrender.com/api/workouts";
function App() {
  const [workouts, setWorkouts] = useState([]);
  const [date, setDate] = useState("");
  const [routineType, setRoutineType] = useState("Push");
  const [durationTime, setDurationTime] = useState("");
  const [weight, setWeight] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
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
  const handleUpdate = async (id, newWeight) => {
    if (!newWeight) return;
    const workoutToUpdate = workouts.find((w) => w.id === id);
    const updatedWorkout = { ...workoutToUpdate, body_weight_kg: newWeight };
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(updatedWorkout),
    });
    setWorkouts(workouts.map((w) => (w.id === id ? updatedWorkout : w)));
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
      try {
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
      } catch (error) {
        console.error("Error fetching workouts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkouts();
  }, [session]);
  const sortedWorkouts = [...workouts].sort(
    (a, b) => new Date(a.date) - new Date(b.date),
  );
  if (!session) {
    return (
      <AuthScreen
        email={email}
        setEmail={setEmail}
        password={setPassword}
        onSignUp={handleSignUp}
        onLogIn={handleLogIn}
        errorMessage={errorMessage}
      />
    );
  } else {
    return (
      <div>
        <ProfileHeader session={session} onSignOut={handleSignOut} />
        <div>
          <h1>My Fitness Tracker💪</h1>
          {isLoading ? (
            <div style={{ textAlign: "center", margin: "50px 0" }}>
              <h2>Loading your data... ⏳</h2>
            </div>
          ) : (
            <>
              <WorkoutForm
                date={date}
                setDate={setDate}
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
                submitForm={handleSubmit}
                routineType={routineType}
                setRoutineType={setRoutineType}
                weight={weight}
                setWeight={setWeight}
                durationTime={durationTime}
                setDurationTime={setDurationTime}
              />
              {workouts.length > 0 && (
                <ProgressChart sortedWorkouts={sortedWorkouts} />
              )}
              {workouts.map((workout) => (
                <WorkoutList
                  key={workout.id}
                  workout={workout}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              ))}
            </>
          )}
        </div>
      </div>
    );
  }
}

export default App;
