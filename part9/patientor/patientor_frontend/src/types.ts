export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other"
}

export interface Patient {
  id: string;
  name: string;
  occupation: string;
  gender: Gender;
  ssn?: string;
  dateOfBirth?: string;
  entries: Entry[];
}

export type PatientFormValues = Omit<Patient, "id" | "entries">;

export interface Entry {
  id: string;
  date: string;
  //type: string; // is this field necessary?
  specialist: string;
  diagnosisCodes?: Array<Diagnosis['code']>;
  description: string;
}

export type NonSensitivePatient = Omit<Patient, "ssn" | "entries">;