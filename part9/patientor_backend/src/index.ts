import express from 'express';
import patientRouter from './routes/patientRouter';
import diagnosesRouter from './routes/diagnosesRouter';
const app = express();
app.use(express.json());

const PORT = 3001;

app.get('/api/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});

// app.get('/api/patients', (_req, res) => {
//   res.json([]);
// });

app.use('/api/patients', patientRouter);
app.use('/api/diagnoses', diagnosesRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});