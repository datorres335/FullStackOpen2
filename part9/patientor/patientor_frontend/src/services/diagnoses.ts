import axios from "axios";
import { Diagnosis } from "../types";
import { apiBaseUrl } from "../constants";

const getDiagnosesByCode = async (code: string) => {
  try {
    const { data } = await axios.get<Diagnosis>(
      `${apiBaseUrl}/diagnoses/${code}`
    );
    return data;
  } catch (error) {
    console.error(`Failed to fetch diagnosis with code ${code}:`, error);
    return undefined;
  }
};

export default {
  getDiagnosesByCode
};