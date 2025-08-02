import patientService from '../services/patients';
import { useEffect, useState } from 'react';
import { PatientEntry } from '../types';
import { useParams } from 'react-router-dom';
import DisplayPatientEntries from './DisplayPatientEntries';

const PatientInfo = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<PatientEntry | null>(null);
  //const [diagnosesMap, setDiagnosesMap] = useState<Map<string, Diagnosis>>(new Map());

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const patientData = await patientService.getPatientById(id);
        //const diagnosesData = patientData.entries.flatMap(entry => entry.diagnosisCodes || []);
        setPatient(patientData);

        // const uniqueCodes = new Set<string>();
        // patientData.entries.forEach(entry => {
        //   entry.diagnosisCodes?.forEach(code => uniqueCodes.add(code));
        // });
        // const diagnosesData = new Map<string, Diagnosis>();
        // await Promise.all(
        //   Array.from(uniqueCodes).map(async (code) => {
        //     const diagnosis = await diagnosesService.getDiagnosesByCode(code);
        //     if (diagnosis) {
        //       diagnosesData.set(code, diagnosis);
        //     }
        //   })
        // );
        // setDiagnosesMap(diagnosesData);
      } else {
        setPatient(null);
        //setDiagnosesMap(new Map());
      }
    };

    fetchData();
  }, [id]);

  // const getDiagnosisName = (code: string): string => {
  //   return diagnosesMap.get(code)?.name || 'Unknown diagnosis';
  // };

  return (
    <div>
      {patient ? (
        <div>
          <h2><strong>Name:</strong> {patient.name}</h2>
          <p><strong>Occupation:</strong> {patient.occupation}</p>
          <p><strong>Gender:</strong> {patient.gender}</p>
          <p><strong>SSN:</strong> {patient.ssn}</p>
          <p><strong>Date of Birth:</strong> {patient.dateOfBirth}</p>
          <h3>Entries</h3>
          {patient.entries.length > 0 ? (
            <ul>
              {patient.entries.map((entry) => (
                <DisplayPatientEntries key={entry.id} entry={entry} />
              ))}
            </ul>
          ) : (
            <p>No entries available.</p>
          )}
        </div>

      ) : (
        <p>Loading patient information...</p>
      )}
    </div>
  );
};

export default PatientInfo;
