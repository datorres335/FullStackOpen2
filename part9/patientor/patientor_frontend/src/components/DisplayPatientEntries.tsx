import { useEffect, useState } from 'react';
import { Entry, Diagnosis } from '../types';
import diagnosesService from '../services/diagnoses';

interface Props {
  entry: Entry;
}

const DisplayPatientEntries = ({ entry }: Props) => {
  const [diagnoses, setDiagnoses] = useState<Map<string, Diagnosis>>(new Map());

  useEffect(() => {
    const fetchDiagnoses = async () => {
      if (entry.diagnosisCodes) {
        const diagnosesMap = new Map<string, Diagnosis>();
        
        for (const code of entry.diagnosisCodes) {
          if (code.trim()) {
            const diagnosis = await diagnosesService.getDiagnosesByCode(code);
            if (diagnosis) {
              diagnosesMap.set(code, diagnosis);
            }
          }
        }
        
        setDiagnoses(diagnosesMap);
      }
    };

    fetchDiagnoses();
  }, [entry.diagnosisCodes]);

  const getDiagnosisName = (code: string): string => {
    const diagnosis = diagnoses.get(code);
    return diagnosis ? diagnosis.name : 'Unknown diagnosis';
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', margin: '0.5rem 0' }}>
      <p><strong>Date:</strong> {entry.date}</p>
      <p><strong>Description:</strong> {entry.description}</p>
      <p><strong>Specialist:</strong> {entry.specialist}</p>
      
      {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && (
        <div>
          <strong>Diagnosis Codes:</strong>
          <ul>
            {entry.diagnosisCodes.map((code) => (
              <li key={code}>
                {code} - {getDiagnosisName(code)}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Add type-specific rendering here */}
      {entry.type === 'HealthCheck' && (
        <p><strong>Health Rating:</strong> {entry.healthCheckRating}</p>
      )}
      
      {entry.type === 'Hospital' && entry.discharge && (
        <p><strong>Discharge:</strong> {entry.discharge.date} - {entry.discharge.criteria}</p>
      )}
      
      {entry.type === 'OccupationalHealthcare' && (
        <>
          <p><strong>Employer:</strong> {entry.employerName}</p>
          {entry.sickLeave && (
            <p><strong>Sick Leave:</strong> {entry.sickLeave.startDate} to {entry.sickLeave.endDate}</p>
          )}
        </>
      )}
    </div>
  );
};

export default DisplayPatientEntries;