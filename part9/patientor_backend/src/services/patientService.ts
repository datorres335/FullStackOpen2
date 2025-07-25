import patientData from '../data/patientEntries';
import { PatientEntry } from '../types';

const patients: PatientEntry[] = patientData;

const getPatients = () => {
  return patients;
};

const addPatient = () => {
  return null;
};

export default {
  getPatients,
  addPatient
};