import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personServices from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchName, setSearchName] = useState('')
  const [filteredPersons, setFilteredPersons] = useState([])

  useEffect(() => {
    console.log('effect used')
    personServices
      .getAll()
      .then(response => {
        setPersons(response)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      setNewName('')
      setNewNumber('')
    }
    else {
      const personObject = {
        name: newName,
        number: newNumber,
      }

      personServices
        .create(personObject)
        .then(response => {
          setPersons(persons.concat(response))
          setNewName('')
          setNewNumber('')
        })
    } 
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
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