import patientService from '../services/patients';
import { useEffect, useState } from 'react';
import { Patient } from '../types';
import { useParams } from 'react-router-dom';

const PatientInfo = () => {
   const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      if (id) {
        const patientData = await patientService.getPatientById(id);
        setPatient(patientData);
      } else {
        setPatient(null);
      }
    };

    fetchPatient();
  }, [id]);

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
                <li key={entry.id}>
                  <p><strong>Date:</strong> {entry.date}</p>
                  <p><strong>Description:</strong> {entry.description}</p>
                  {entry.diagnosisCodes && (
                    <div>
                      <strong>Diagnosis Codes:</strong>
                      <ul>
                        {entry.diagnosisCodes.map((code) => (
                          <li key={code}>{code}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
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
