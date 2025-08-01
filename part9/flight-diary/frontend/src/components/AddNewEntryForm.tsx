import { useState, type Dispatch, type SetStateAction, type SyntheticEvent } from 'react'
import { Visibility, Weather, type DiaryEntry } from '../../../packages/types'
import { createEntry } from '../diaryService';
import axios from 'axios';

const AddNewEntryForm = (
  {diaryEntries, setDiaryEntries}: 
  {diaryEntries: DiaryEntry[], setDiaryEntries: Dispatch<SetStateAction<DiaryEntry[]>>}
) => {
  const [date, setDate] = useState('');
  const [visibility, setVisibility] = useState<Visibility>(Visibility.Great);
  const [weather, setWeather] = useState<Weather>(Weather.Sunny);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string>('');

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();
    setError(''); 
    const entryToAdd = {
      id: diaryEntries.length + 1,
      date,
      visibility,
      weather,
      comment
    };
    createEntry(entryToAdd).then(entry => {
      setDiaryEntries([...diaryEntries, entry]);
      setDate('');
      setVisibility(Visibility.Great);
      setWeather(Weather.Sunny);
      setComment('');
    }).catch(error => {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const errorMessage = error.response.data?.message || error.response.data || 'Unknown error occurred';
          setError(`Failed to create entry: ${errorMessage}`);
        } else if (error.request) {
          setError('Failed to create entry: No response from server');
        } else {
          setError(`Failed to create entry: ${error.message}`);
        }
      } else {
        setError('Failed to create entry: Unknown error occurred');
      }
      console.error('Failed to add entry:', error);
    });
  }

  return (
    <div>
      {error && (
        <div style={{ color: 'red', marginBottom: '10px', padding: '10px', border: '1px solid red', borderRadius: '4px' }}>
          {error}
        </div>
      )}
      <form onSubmit={addEntry}>
        Date <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <br />
        Visibility <select value={visibility} onChange={(e) => setVisibility(e.target.value as Visibility)}>
          {Object.values(Visibility).map(v => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
        <br />
        Weather <select value={weather} onChange={(e) => setWeather(e.target.value as Weather)}>
          {Object.values(Weather).map(w => (
            <option key={w} value={w}>{w}</option>
          ))}
        </select>
        <br />
        Comment <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
        <br />
        <button type="submit">Add Entry</button>
      </form>
    </div>
  );
};

export default AddNewEntryForm;