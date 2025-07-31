import { useState, type Dispatch, type SetStateAction, type SyntheticEvent } from 'react'
import { Visibility, Weather, type DiaryEntry } from '../../../packages/types'
import { createEntry } from '../diaryService';

const AddNewEntryForm = (
  {diaryEntries, setDiaryEntries}: 
  {diaryEntries: DiaryEntry[], setDiaryEntries: Dispatch<SetStateAction<DiaryEntry[]>>}
) => {
  const [date, setDate] = useState('');
  const [visibility, setVisibility] = useState<Visibility>(Visibility.Great);
  const [weather, setWeather] = useState<Weather>(Weather.Sunny);
  const [comment, setComment] = useState('');

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();
    const entryToAdd = {
      id: diaryEntries.length + 1,
      date,
      visibility,
      weather,
      comment
    };
    createEntry(entryToAdd).then(entry => {
      setDiaryEntries([...diaryEntries, entry]);
    }).catch(error => {
      console.error('Failed to add entry:', error);
    });
  }

  return (
    <form onSubmit={addEntry}>
      <input value={date} onChange={(e) => setDate(e.target.value)} />
      
      <select value={visibility} onChange={(e) => setVisibility(e.target.value as Visibility)}>
        {Object.values(Visibility).map(v => (
          <option key={v} value={v}>{v}</option>
        ))}
      </select>
      
      <select value={weather} onChange={(e) => setWeather(e.target.value as Weather)}>
        {Object.values(Weather).map(w => (
          <option key={w} value={w}>{w}</option>
        ))}
      </select>

      <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
      <button type="submit">Add Entry</button>
    </form>
  );
};

export default AddNewEntryForm;