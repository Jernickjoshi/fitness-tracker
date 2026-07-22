import { useState, useEffect } from "react";
const API_URL = "https://fitness-tracker-api-z3i9.onrender.com/api/workouts";
export const useWorkouts = (session) => {
    const [workouts, setWorkouts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

      useEffect(() => {
        const fetchWorkouts = async () => {
          try {
            if (!session) return;
    
            const response = await fetch(API_URL, {
              method: "GET",
              headers: {
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
      const addWorkout = async (workoutObject) => {
      const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(workoutObject),
    });
    const responseData = await response.json();
    setWorkouts([])
}
const deleteWorkout = async (id) => {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    setWorkouts(workouts.filter((workout) => workout.id !== id));
  };

  const updateWorkout = async (id, newWeight) => {
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
      return { workouts, isLoading, addWorkout, deleteWorkout, updateWorkout}
};

