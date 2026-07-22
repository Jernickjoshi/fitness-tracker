import { useState, useEffect } from "react";
import "./App.css";
import supabase from "./supabaseClient";
import { useWorkouts } from "./hooks/useWorkouts";
import "./components/ProfileHeader";
import AuthScreen from "./components/AuthScreen";
import WorkoutForm from "./components/WorkoutForm";
import ProgressChart from "./components/ProgressChart";
import ProfileHeader from "./components/ProfileHeader";
import WorkoutList from "./components/WorkoutList";
function App() {
  const [date, setDate] = useState("");
  const [routineType, setRoutineType] = useState("Push");
  const [durationTime, setDurationTime] = useState("");
  const [weight, setWeight] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [session, setSession] = useState(null);
  const { workouts, isLoading, addWorkout, deleteWorkout, updateWorkout } =
    useWorkouts(session);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (date === "" || durationTime === "" || weight === "") {
      setErrorMessage("Please fill out all fields");
      return;
    }
    if (weight <= 0 || durationTime <= 0) {
      setErrorMessage("The Values should be greater than 0!");
      return;
    }

    const newWorkout = {
      date: date,
      routine_type: routineType,
      duration_minutes: durationTime,
      body_weight_kg: weight,
    };
    await addWorkout(newWorkout);

    setDate("");
    setRoutineType("Push");
    setDurationTime("");
    setWeight("");
  };
  const handleDelete = async (id) => {
    await deleteWorkout(id);
  };
  const handleUpdate = async (id, newWeight) => {
    if (!newWeight) return;
    await updateWorkout(id, newWeight);
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
  const sortedWorkouts = [...workouts].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );
  if (!session) {
    return (
      <AuthScreen
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
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
              {sortedWorkouts.map((workout) => (
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
