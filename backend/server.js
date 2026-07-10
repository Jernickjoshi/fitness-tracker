const express = require('express');
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://nbmzlsmlmzffvzffquuf.supabase.co';
const supabaseKey = 'sb_publishable_ALvvrJD_ymKOAGfB9ylyVg_F3D4FnE-';
const supabase = createClient(supabaseUrl, supabaseKey);

// Our first API Endpoint (The "Read" in CRUD)
app.get('/api/workouts', async (req, res) => {
    const { data, error } = await supabase.from('workouts').select('*');
    if (error) {
        console.error('Error fetching workouts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    res.json(data);

});

app.post('/api/workouts', async (req, res) => {
    const newWorkout  = req.body;
    const { data, error } = await supabase.from('workouts').insert([newWorkout]).select();
    if(error) {
        console.error('Error inserting workout:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
    res.status(201).json(data);
})

app.delete('/api/workouts/:id', async (req, res) => {
    const workoutId = req.params.id;
    const { data, error } = await supabase.from('workouts').delete().eq('id', workoutId).select();
    if (error) {
        console.error('Error deleting workout:', error);
        res.status(500).json({error: 'Internal server error'});
        return;
    }
    res.status(200).json(data);
});
app.put('/api/workouts/:id', async (req, res) => {
    const workoutId = req.params.id;
    const updatedWorkoutId = req.body;
    const { data, error } = await supabase.from('workouts').update(updatedWorkoutId).eq('id', workoutId).select();
    if (error) {
        console.error('Error updating workout:', error);
        res.status(500).json({error: 'Internal server error'});
        return;
    }
    res.status(200).json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);   
});