import React, {useState, useEffect} from "react";
import { Entry, Diagnosis } from "../types";
import diagnosesService from "../services/diagnoses";

const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
  const [diagnosesMap, setDiagnosesMap] = useState<Map<string, Diagnosis>>(new Map());
  
  useEffect(() => {
    const fetchDiagnoses = async () => {
      if (entry.diagnosisCodes) {
        const uniqueCodes = Array.from(new Set(entry.diagnosisCodes));
        const diagnosesData = new Map<string, Diagnosis>();
        await Promise.all(
          uniqueCodes.map(async (code) => {
            const diagnosis = await diagnosesService.getDiagnosesByCode(code);
            if (diagnosis) {
              diagnosesData.set(code, diagnosis);
            }
          })
        );
        setDiagnosesMap(diagnosesData);
      }
    };
    void fetchDiagnoses();
  }, [entry.diagnosisCodes]);
  
  const getDiagnosisName = (code: string): string => {
    return diagnosesMap.get(code)?.name || 'Unknown diagnosis';
  };

  switch (entry.type) {
    case "Hospital":
      return (
        <div style={{ border: "1px solid black", padding: "10px", marginBottom: "10px" }}>
          <h4>Hospital Entry</h4>
          <p><strong>Date:</strong> {entry.date}</p>
          <p><strong>Description:</strong> {entry.description}</p>
          <p><strong>Specialist:</strong> {entry.specialist}</p>
          {entry.diagnosisCodes && (
            <div>
              <strong>Diagnosis Codes:</strong>
              <ul>
                {entry.diagnosisCodes.map((code) => (
                  <li key={code}>{code} {getDiagnosisName(code)}</li>
                ))}
              </ul>
            </div>
          )}
          <p><strong>Discharge:</strong> {entry.discharge.date} - {entry.discharge.criteria}</p>
        </div>
      );
    case "OccupationalHealthcare":
      return (
        <div style={{ border: "1px solid black", padding: "10px", marginBottom: "10px" }}>
          <h4>Occupational Healthcare Entry</h4>
          <p><strong>Date:</strong> {entry.date}</p>
          <p><strong>Description:</strong> {entry.description}</p>
          <p><strong>Specialist:</strong> {entry.specialist}</p>
          {entry.diagnosisCodes && (
            <div>
              <strong>Diagnosis Codes:</strong>
              <ul>
                {entry.diagnosisCodes.map((code) => (
                  <li key={code}>{code} {getDiagnosisName(code)}</li>
                ))}
              </ul>
            </div>
          )}
          <p><strong>Employer Name:</strong> {entry.employerName}</p>
          {entry.sickLeave && (
            <p><strong>Sick Leave:</strong> {entry.sickLeave.startDate} to {entry.sickLeave.endDate}</p>
          )}
        </div>
      );
    case "HealthCheck":
      return (
        <div style={{ border: "1px solid black", padding: "10px", marginBottom: "10px" }}>
          <h4>Health Check Entry</h4>
          <p><strong>Date:</strong> {entry.date}</p>
          <p><strong>Description:</strong> {entry.description}</p>
          <p><strong>Health Check Rating:</strong> {entry.healthCheckRating}</p>
        </div>
      );
    default:
      return assertNever(entry);
  }
};

const assertNever = (value: never): never => {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};

export default EntryDetails;