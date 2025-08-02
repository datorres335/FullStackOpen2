import express, { Response } from 'express';
import diagnosesService from '../services/diagnosesService';
import { DiagnosisEntry } from '../types';

const router = express.Router();

router.get('/', (_req, res: Response<DiagnosisEntry[]>) => {
  res.send(diagnosesService.getDiagnoses());
});

router.get('/:code', (req, res: Response<DiagnosisEntry | { error: string }>) => {
  const code = req.params.code;
  const diagnosis = diagnosesService.getDiagnosesByCode(code);
  if (diagnosis) {
    res.send(diagnosis);
  } else {
    res.status(404).send({ error: `Diagnosis with code ${code} not found` });
  }
});

export default router;