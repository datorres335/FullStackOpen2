import patientData from '../data/patientEntries';
import { PatientEntry, NonSensitivePatientEntry } from '../types';

const patients: PatientEntry[] = patientData;

const getPatients = (): PatientEntry[] => {
  return patients;
};

const getNonSensitiveEntries = (): NonSensitivePatientEntry[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};

const addPatient = () => {
  return null;
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