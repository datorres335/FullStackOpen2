import { useState, useEffect } from 'react'
import type { DiaryEntry } from '../../packages/types'
import AddNewEntryForm from './components/AddNewEntryForm'
import { getAllEntries } from './diaryService'

const App = () => {
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([])

  useEffect(() => {
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
          <hr style={{height: "1px", backgroundColor: "#e0e0e0", margin: "20px 0"}}/>
          <p>
            <strong>{entry.date}</strong> <br /> <br />
            Visibility: {entry.visibility} <br />
            Weather: {entry.weather} <br />
            Comment: {entry.comment}
          </p>
        </div>
      ))}
    </>
  )
}

export default App
