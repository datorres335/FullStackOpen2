import express from 'express';
import { calculateBmi } from './bmiCalculator';
const app = express();

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

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
  } catch (error) {
    return res.status(400).json({
      error: "malformatted parameters"
    });
  }
})

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});