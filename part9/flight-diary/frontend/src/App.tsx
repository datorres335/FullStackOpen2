import { useState, useEffect } from 'react'
import type { DiaryEntry } from '../../packages/types'
import AddNewEntryForm from './components/AddNewEntryForm'
import { getAllEntries } from './diaryService'

const App = () => {
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([])

  useEffect(() => {
    // Fetch initial diary entries from the server or local storage
    const fetchDiaryEntries = async () => {
      const entries = await getAllEntries()
      setDiaryEntries(entries)
    }

    fetchDiaryEntries()
  }, [])

  return (
    <>
      <h1>Flight Diary</h1>
      <AddNewEntryForm diaryEntries={diaryEntries} setDiaryEntries={setDiaryEntries} />
      <h2>Diary Entries</h2>
      {diaryEntries.map(entry => (
        <div key={entry.id}>
          <p>{entry.date} - {entry.weather} - {entry.visibility}</p>
          <p>{entry.comment}</p>
        </div>
      ))}
    </>
  )
}

export default App
