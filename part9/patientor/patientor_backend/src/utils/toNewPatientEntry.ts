import { NewPatientEntry, Gender } from "../types";
import z from "zod";

const entrySchema = z.object({
    // Define the structure based on your Entry type
    id: z.string(),
    date: z.string(),
    specialist: z.string(),
    diagnosisCodes: z.array(z.string()).optional(),
    description: z.string(),
});

export const newPatientEntrySchema = z.object({
    name: z.string(),
    dateOfBirth: z.iso.date(),
    ssn: z.string(),
    gender: z.enum(Gender),
    occupation: z.string().optional(),
    entries: z.array(entrySchema).optional().default([])
});

export const toNewPatientEntry = (object: unknown): NewPatientEntry => {
  return newPatientEntrySchema.parse(object);
};