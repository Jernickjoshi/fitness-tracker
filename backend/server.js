require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Our first API Endpoint (The "Read" in CRUD)
app.get('/api/workouts', async (req, res) => {
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({ error: 'Unauthorized: Missing Token' });
    }
    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    const { data, error } = await supabase.from('workouts').select('*');
    if (error) {
        console.error('Error fetching workouts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    res.json(data);

});

app.post('/api/workouts', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split(' ')[1];
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }

  const { date, routine_type, duration_minutes, body_weight_kg } = req.body;
  if (!date || !routine_type || !duration_minutes || !body_weight_kg) {
    return res.status(400).json({ error: "All fields are strictly required." });
  }

  const workoutToSave = { ...req.body, user_id: user.id };

  const { data, error } = await supabase.from('workouts').insert([workoutToSave]).select();
  
  if (error) {
    console.error('Error inserting workout:', error);
    res.status(500).json({ error: 'Internal Server Error' });
    return;
  }
  
  res.status(201).json(data);
});

app.delete('/api/workouts/:id', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized: Missing token' });
  
  const token = authHeader.split(' ')[1];
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) return res.status(401).json({ error: 'Unauthorized: Invalid token' });

  const workoutId = req.params.id;

  const { error } = await supabase
    .from('workouts')
    .delete()
    .eq('id', workoutId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting workout:', error);
    res.status(500).json({ error: 'Internal Server Error' });
    return;
  }
  
  res.status(204).send();
});

app.put('/api/workouts/:id', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized: Missing token' });
  
  const token = authHeader.split(' ')[1];
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) return res.status(401).json({ error: 'Unauthorized: Invalid token' });

  const workoutId = req.params.id;
  const updatedWorkout = req.body;

  const { data, error } = await supabase
    .from('workouts')
    .update(updatedWorkout)
    .eq('id', workoutId)
    .eq('user_id', user.id)
    .select();

  if (error) {
    console.error('Error updating workout:', error);
    res.status(500).json({ error: 'Internal Server Error' });
    return;
  }
  res.json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);   
});