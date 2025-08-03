import { useState, useEffect } from 'react';
import { Diagnosis } from '../types';
import diagnosesService from '../services/diagnoses';

interface Props {
  selectedCodes: string[];
  onCodesChange: (codes: string[]) => void;
}

const DiagnosisCodeSelector = ({ selectedCodes, onCodesChange }: Props) => {
  const [allDiagnoses, setAllDiagnoses] = useState<Diagnosis[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      const diagnoses = await diagnosesService.getAll();
      setAllDiagnoses(diagnoses);
    };
    fetchDiagnoses();
  }, []);

  const filteredDiagnoses = allDiagnoses.filter(diagnosis => 
    (diagnosis.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
     diagnosis.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
    !selectedCodes.includes(diagnosis.code)
  );

  const addDiagnosisCode = (diagnosis: Diagnosis) => {
    onCodesChange([...selectedCodes, diagnosis.code]);
    setSearchTerm('');
    setShowDropdown(false);
  };

  const removeDiagnosisCode = (codeToRemove: string) => {
    onCodesChange(selectedCodes.filter(code => code !== codeToRemove));
  };

  const getDiagnosisName = (code: string): string => {
    const diagnosis = allDiagnoses.find(d => d.code === code);
    return diagnosis?.name || 'Unknown';
  };

  return (
    <div style={{ position: 'relative' }}>
      <label>Diagnosis Codes</label>
      
      <div style={{ marginBottom: '0.5rem' }}>
        {selectedCodes.map(code => (
          <div 
            key={code} 
            style={{ 
              display: 'inline-block', 
              backgroundColor: '#e3f2fd', 
              padding: '0.25rem 0.5rem', 
              margin: '0.25rem',
              borderRadius: '4px',
              border: '1px solid #90caf9'
            }}
          >
            <span>{code} - {getDiagnosisName(code)}</span>
            <button 
              type="button"
              onClick={() => removeDiagnosisCode(code)}
              style={{ 
                marginLeft: '0.5rem', 
                background: 'none', 
                border: 'none', 
                color: '#f44336',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <input
        type="text"
        value={searchTerm}
        onChange={({ target }) => {
          setSearchTerm(target.value);
          setShowDropdown(target.value.length > 0);
        }}
        onFocus={() => setShowDropdown(searchTerm.length > 0)}
        placeholder="Search diagnosis codes or names..."
        style={{ width: '100%', padding: '0.5rem' }}
      />

      {showDropdown && filteredDiagnoses.length > 0 && (
        <div style={{ 
          position: 'absolute', 
          top: '100%', 
          left: 0, 
          right: 0, 
          backgroundColor: 'white', 
          border: '1px solid #ccc',
          maxHeight: '200px',
          overflowY: 'auto',
          zIndex: 1000,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          {filteredDiagnoses.slice(0, 10).map(diagnosis => (
            <div
              key={diagnosis.code}
              onClick={() => addDiagnosisCode(diagnosis)}
              style={{ 
                padding: '0.5rem', 
                cursor: 'pointer',
                borderBottom: '1px solid #eee'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              <strong>{diagnosis.code}</strong> - {diagnosis.name}
              {diagnosis.latin && <div style={{ fontSize: '0.8em', color: '#666' }}>{diagnosis.latin}</div>}
            </div>
          ))}
        </div>
      )}

      {showDropdown && (
        <div 
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            zIndex: 999 
          }}
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default DiagnosisCodeSelector;