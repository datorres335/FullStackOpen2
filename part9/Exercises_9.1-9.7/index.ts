import express from 'express';
const app = express();
app.use(express.json());

import { calculateBmi } from './bmiCalculator';
import { calculator, Operation } from './calculator';
import { calculateExercises, ExerciseValues } from './exerciseCalculator';

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

// you can the values of height and weight as query parameters
// ex: http://localhost:3003/bmi?height=180&weight=72
app.get('/bmi', (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  try {
    const bmiResult = calculateBmi(height, weight);
    
    return res.json({
      weight,
      height,
      bmi: bmiResult
    });
  } catch {
    return res.status(400).json({
      error: "malformatted parameters"
    });
  }
});

app.post('/calculate', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { value1, value2, op } = req.body;

  if (!value1 || isNaN(Number(value1))) {
    return res.status(400).send({ error: '...'});
  }

  const result = calculator(Number(value1), Number(value2), op as Operation);
  res.send({ result });
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { target, daily_exercises } = req.body;

  if (!target || !daily_exercises) {
    return res.status(400).send({ error: 'parameters missing' });
  }

  if (isNaN(Number(target)) || !Array.isArray(daily_exercises)) {
    return res.status(400).send({ error: 'malformatted parameters' });
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const result: ExerciseValues = calculateExercises(Number(target), daily_exercises);
  res.send({ result });
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});