import axios from "axios";
import { PatientEntry, PatientFormValues, Entry } from "../types";
import { apiBaseUrl } from "../constants";

const getAll = async () => {
  const { data } = await axios.get<PatientEntry[]>(
    `${apiBaseUrl}/patients`
  );

  return data;
};

const getPatientById = async (id: string) => {
  const { data } = await axios.get<PatientEntry>(
    `${apiBaseUrl}/patients/${id}`
  );

  return data;
};

const create = async (object: PatientFormValues) => {
  const { data } = await axios.post<PatientEntry>(
    `${apiBaseUrl}/patients`,
    object
  );

  return data;
};

const addEntry = async (patientId: string, entry: Omit<Entry, 'id'>): Promise<Entry> => {
  const { data } = await axios.post<Entry>(
    `${apiBaseUrl}/patients/${patientId}/entries`,
    entry
  );
  return data;
};

const patientServices = {
  getAll, getPatientById, create, addEntry
};

export default patientServices;
