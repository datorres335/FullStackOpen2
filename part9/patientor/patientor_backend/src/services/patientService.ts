import patientData from '../data/patientEntries';
import { 
  PatientEntry,
  NewPatientEntry,
  NonSensitivePatientEntry 
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

export default {
  getPatients,
  getNonSensitiveEntries,
  addPatient,
  findById
};