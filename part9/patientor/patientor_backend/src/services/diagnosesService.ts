import diagnosesData from "../data/diagnosisEntries";
import { DiagnosisEntry } from "../types";

const diagnoses: DiagnosisEntry[] = diagnosesData;

const getDiagnoses = (): DiagnosisEntry[] => {
  return diagnoses;
};

const getDiagnosesByCode = (code: string): DiagnosisEntry | undefined => {
  return diagnoses.find(diagnosis => diagnosis.code === code);
};

export default {
  getDiagnoses,
  getDiagnosesByCode
};