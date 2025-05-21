import RemovePerson from "./RemovePerson"

const Persons = ( {searchName, persons, filteredPersons, handleRemovePerson} ) => {
  return (
    <>
      { 
        searchName === '' ?
        persons.map((person, index) => 
          <div key={index}>
            {person.name} {person.number} <RemovePerson name={person.name} id={person.id} handleRemovePerson={handleRemovePerson}/>
          </div>
        ) :
        filteredPersons.map((person, index) => 
          <div key={index}>
            {person.name} {person.number} <RemovePerson name={person.name} id={person.id} handleRemovePerson={handleRemovePerson}/>
          </div>
        )
      }
    </>
  )
}

export default Persons