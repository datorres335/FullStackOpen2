import express, { Response } from 'express';
import patientService from '../services/patientService';
import { NonSensitivePatientEntry, PatientEntry } from '../types';

const router = express.Router();

router.get('/', (_req, res: Response<NonSensitivePatientEntry[]>) => {
  res.send(patientService.getNonSensitiveEntries());
});

router.get('/:id', (req, res: Response<PatientEntry | null>) => {
  const patient = patientService.findById(req.params.id);

  if (patient) {
    res.send(patient);
  } else {
    res.sendStatus(404);
  }
});

router.post('/', (_req, res) => {
  res.send('Creating a new patient!');
});

export default router;