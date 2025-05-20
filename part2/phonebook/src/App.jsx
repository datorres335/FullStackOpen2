import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchName, setSearchName] = useState('')
  const [filteredPersons, setFilteredPersons] = useState([])

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      phone: newNumber,
    }

    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
  }
  const handleNameChange = (event) => {
    if (persons.some(person => person.name === event.target.value)) {
      alert(`${event.target.value} is already added to phonebook`)
      setNewName('')
    }
    else {setNewName(event.target.value)}
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleSearchChange = (event) => {
    const input = event.target.value
    setFilteredPersons(persons.filter(person => person.name.toLowerCase().includes(input.toLowerCase())))
    setSearchName(input)
    console.log(input);
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <div>
        filter shown with <input value={searchName} onChange={handleSearchChange}/>
      </div>
      <h2>add a new</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} /> <br />
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      { 
        searchName === '' ?
        persons.map((person, index) => 
          <div key={index}>
            {person.name} {person.phone}
          </div>
        ) :
        filteredPersons.map((person, index) => 
          <div key={index}>
            {person.name} {person.phone}
          </div>
        )
      }
    </div>
  )
}

export default App