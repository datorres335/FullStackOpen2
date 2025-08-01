import { z } from 'zod';
import { newPatientEntrySchema } from './utils/toNewPatientEntry';

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other'
}

export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Entry {
  id: string;
  date: string;
  //type: string; // is this field necessary?
  specialist: string;
  diagnosisCodes?: Array<Diagnosis['code']>;
  description: string;
}

export interface PatientEntry {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation?: string;
  entries: Entry[];
}

export type NewPatientEntry = z.infer<typeof newPatientEntrySchema>; 

export interface DiagnosisEntry {
  code: string;
  name: string;
  latin?: string;
}

export type NonSensitivePatientEntry = Omit<PatientEntry, 'ssn'>;