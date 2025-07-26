import express, { Response } from 'express';
import diagnosesService from '../services/diagnosesService';
import { DiagnosisEntry } from '../types';

const router = express.Router();

router.get('/api/diagnoses', (_req, res: Response<DiagnosisEntry[]>) => {
  res.send(diagnosesService.getDiagnoses());
});

export default router;