import axios from "axios";
import { Diagnosis } from "../types";
import { apiBaseUrl } from "../constants";

const isValidDiagnosisCode = (code: string): boolean => {
  return /^[A-Z]\d{2}(\.\d{1,2})?$/.test(code);
};

const getDiagnosesByCode = async (code: string): Promise<Diagnosis | undefined> => {
  if (!isValidDiagnosisCode(code)) {
    console.warn(`Invalid diagnosis code format: ${code}`);
    return undefined;
  }

  try {
    const { data } = await axios.get<Diagnosis>(
      `${apiBaseUrl}/diagnoses/${code}`
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      console.warn(`Diagnosis code not found: ${code}`);
    } else {
      console.error(`Failed to fetch diagnosis with code ${code}:`, error);
    }
    return undefined;
  }
};

const getAll = async (): Promise<Diagnosis[]> => {
  try {
    const { data } = await axios.get<Diagnosis[]>(`${apiBaseUrl}/diagnoses`);
    return data;
  } catch (error) {
    console.error('Failed to fetch all diagnoses:', error);
    return [];
  }
};

export default {
  getDiagnosesByCode,
  getAll
};