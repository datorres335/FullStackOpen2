import patientService from '../services/patients';
import { useEffect, useState } from 'react';
import { PatientEntry, Entry } from '../types';
import { useParams } from 'react-router-dom';
import DisplayPatientEntries from './DisplayPatientEntries';
import NewEntryForm from './NewEntryForm';

const PatientInfo = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<PatientEntry | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const patientData = await patientService.getPatientById(id);
          setPatient(patientData);
        } catch (error) {
          console.error('Error fetching patient:', error);
          setError('Failed to fetch patient data');
        }
      }
    };

    fetchData();
  }, [id]);

  const handleAddEntry = async (entry: Omit<Entry, 'id'>) => {
    if (!id || !patient) return;
    
    try {
      const newEntry = await patientService.addEntry(id, entry);
      setPatient({
        ...patient,
        entries: patient.entries.concat(newEntry)
      });
      setShowForm(false);
      setError('');
    } catch (error) {
      console.error('Error adding entry:', error);
      setError('Failed to add entry');
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setError('');
  };

  if (error && !showForm) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

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
          {!showForm && (
            <button onClick={() => setShowForm(true)}>Add New Entry</button>
          )}
          
          {showForm && (
            <NewEntryForm 
              onSubmit={handleAddEntry} 
              onCancel={handleCancelForm}
              error={error}
            />
          )}
          
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