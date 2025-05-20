const Persons = ( {searchName, persons, filteredPersons} ) => {
  return (
    <>
      { 
        searchName === '' ?
        persons.map((person, index) => 
          <div key={index}>
            {person.name} {person.number}
          </div>
        ) :
        filteredPersons.map((person, index) => 
          <div key={index}>
            {person.name} {person.number}
          </div>
        )
      }
    </>
  )
}

export default Persons