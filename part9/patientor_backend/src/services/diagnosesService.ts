import diagnosesData from "../data/diagnosisEntries";
import { DiagnosisEntry } from "../types";

const diagnoses: DiagnosisEntry[] = diagnosesData;

const getDiagnoses = (): DiagnosisEntry[] => {
  return diagnoses;
};

export default {
  getDiagnoses
};