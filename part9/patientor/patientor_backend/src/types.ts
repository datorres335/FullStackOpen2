import { z } from 'zod';
import { newPatientEntrySchema } from './utils/toNewPatientEntry';

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other'
}

export interface PatientEntry {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation?: string;
}

export type NewPatientEntry = z.infer<typeof newPatientEntrySchema>; 

export interface DiagnosisEntry {
  code: string;
  name: string;
  latin?: string;
}

export type NonSensitivePatientEntry = Omit<PatientEntry, 'ssn'>;