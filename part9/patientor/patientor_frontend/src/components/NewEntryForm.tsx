import { useState, SyntheticEvent } from "react";
import { Entry, Diagnosis, HealthCheckRating, HealthCheckEntry, HospitalEntry, OccupationalHealthcareEntry } from "../types";
import DiagnosisCodeSelector from "./DiagnosisCodeSelector";

interface Props {
  onSubmit: (entry: Omit<Entry, 'id'>) => void;
  onCancel: () => void;
  error?: string;
}

const NewEntryForm = ({ onSubmit, onCancel, error }: Props) => {
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState<Array<Diagnosis['code']>>([]);
  const [type, setType] = useState<"Hospital" | "OccupationalHealthcare" | "HealthCheck">("HealthCheck");
  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(HealthCheckRating.Healthy);
  const [discharge, setDischarge] = useState<{ date: string; criteria: string }>({ date: "", criteria: "" });
  const [employerName, setEmployerName] = useState("");
  const [sickLeave, setSickLeave] = useState<{ startDate: string; endDate: string }>({ startDate: "", endDate: "" });

  const isValidDiagnosisCode = (code: string): boolean => {
    return /^[A-Z]\d{2}(\.\d{1,2})?$/.test(code.trim());
  };

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();

    const validDiagnosisCodes = diagnosisCodes.filter(code => {
      const trimmedCode = code.trim();
      return trimmedCode !== "" && isValidDiagnosisCode(trimmedCode);
    });

    // Check if any invalid codes were entered
    const invalidCodes = diagnosisCodes.filter(code => {
      const trimmedCode = code.trim();
      return trimmedCode !== "" && !isValidDiagnosisCode(trimmedCode);
    });

    if (invalidCodes.length > 0) {
      alert(`Invalid diagnosis codes: ${invalidCodes.join(', ')}. Please use format like M24.2, Z57.1`);
      return;
    }

    const baseEntry = {
      description,
      date,
      specialist,
      diagnosisCodes: validDiagnosisCodes
    };

    switch (type) {
      case "HealthCheck": {
        const healthCheckEntry: Omit<HealthCheckEntry, 'id'> = { 
          ...baseEntry, 
          type, 
          healthCheckRating 
        };
        onSubmit(healthCheckEntry);
        break;
      }
      case "Hospital": {
        const hospitalEntry: Omit<HospitalEntry, 'id'> = { 
          ...baseEntry, 
          type, 
          discharge 
        };
        onSubmit(hospitalEntry);
        break;
      }
      case "OccupationalHealthcare": {
        const occupationalEntry: Omit<OccupationalHealthcareEntry, 'id'> = { 
          ...baseEntry, 
          type, 
          employerName,
          ...(sickLeave.startDate && sickLeave.endDate && { sickLeave })
        };
        onSubmit(occupationalEntry);
        break;
      }
      default:
        return;
    }
  };

  return (
    <div>
      <h2>Add New Entry</h2>
      {error && (
        <div style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#ffe6e6', border: '1px solid #ff0000' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Entry Type</label>
          <select 
            value={type} 
            onChange={({ target }) => setType(target.value as "Hospital" | "OccupationalHealthcare" | "HealthCheck")}
          >
            <option value="HealthCheck">Health Check</option>
            <option value="Hospital">Hospital</option>
            <option value="OccupationalHealthcare">Occupational Healthcare</option>
          </select>
        </div>
        <div>
          <label>Description</label>
          <input
            type="text"
            value={description}
            onChange={({ target }) => setDescription(target.value)}
            required
          />
        </div>
        <div>
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={({ target }) => setDate(target.value)}
            required
          />
        </div>
        <div>
          <label>Specialist</label>
          <input
            type="text"
            value={specialist}
            onChange={({ target }) => setSpecialist(target.value)}
            required
          />
        </div>
        <div>
          <DiagnosisCodeSelector 
            selectedCodes={diagnosisCodes}
            onCodesChange={setDiagnosisCodes}
          />
        </div>

        {type === "HealthCheck" && (
          <div>
            <label>Health Check Rating</label>
            <select 
              value={healthCheckRating} 
              onChange={({ target }) => setHealthCheckRating(Number(target.value) as HealthCheckRating)}
            >
              <option value={HealthCheckRating.Healthy}>Healthy</option>
              <option value={HealthCheckRating.LowRisk}>Low Risk</option>
              <option value={HealthCheckRating.HighRisk}>High Risk</option>
              <option value={HealthCheckRating.CriticalRisk}>Critical Risk</option>
            </select>
          </div>
        )}

        {type === "Hospital" && (
          <>
            <div>
              <label>Discharge Date</label>
              <input
                type="date"
                value={discharge.date}
                onChange={({ target }) => setDischarge({ ...discharge, date: target.value })}
                required
              />
            </div>
            <div>
              <label>Discharge Criteria</label>
              <input
                type="text"
                value={discharge.criteria}
                onChange={({ target }) => setDischarge({ ...discharge, criteria: target.value })}
                required
              />
            </div>
          </>
        )}

        {type === "OccupationalHealthcare" && (
          <>
            <div>
              <label>Employer Name</label>
              <input
                type="text"
                value={employerName}
                onChange={({ target }) => setEmployerName(target.value)}
                required
              />
            </div>
            <div>
              <label>Sick Leave Start Date (optional)</label>
              <input
                type="date"
                value={sickLeave.startDate}
                onChange={({ target }) => setSickLeave({ ...sickLeave, startDate: target.value })}
              />
            </div>
            <div>
              <label>Sick Leave End Date (optional)</label>
              <input
                type="date"
                value={sickLeave.endDate}
                onChange={({ target }) => setSickLeave({ ...sickLeave, endDate: target.value })}
              />
            </div>
          </>
        )}

        <button type="submit">Add Entry</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default NewEntryForm;