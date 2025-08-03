import patientData from '../data/patientEntries';
import { 
  PatientEntry,
  NewPatientEntry,
  NonSensitivePatientEntry,
  Entry
} from '../types';
import { v1 as uuid } from 'uuid';

const patients: PatientEntry[] = patientData;

const getPatients = (): PatientEntry[] => {
  return patients;
};

const getNonSensitiveEntries = (): NonSensitivePatientEntry[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation, entries }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
    entries
  }));
};

const addPatient = ( patient: NewPatientEntry): PatientEntry => {
  const newPatientEntry = {
    id: uuid(),
    ...patient,
    entries: []
  };
  patients.push(newPatientEntry);
  return newPatientEntry;
};

const findById = (id: string): PatientEntry | undefined => {
  const entry = patients.find(p => p.id === id);
  return entry;
};

const addEntry = (patient: PatientEntry, entry: Omit<Entry, 'id'>): Entry => {
  const newEntry = {
    id: uuid(),
    ...entry
  } as Entry;
  patient.entries.push(newEntry);
  return newEntry;
};

export default {
  getPatients,
  getNonSensitiveEntries,
  addPatient,
  findById,
  addEntry
};