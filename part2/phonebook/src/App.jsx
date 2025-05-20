import axios from 'axios'
import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchName, setSearchName] = useState('')
  const [filteredPersons, setFilteredPersons] = useState([])

  useEffect(() => {
    console.log('effect used')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,
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
      <Filter 
        searchName={searchName} 
        handleSearchChange={handleSearchChange} 
      />
      <h2>Add a new</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons 
        searchName={searchName}
        persons={persons}
        filteredPersons={filteredPersons}
      />
    </div>
  )
}

export default App