const RemovePerson = ( {name, id, handleRemovePerson} ) => {
  return (
    <button
      type="button"
      onClick={() => {
        if (window.confirm(`Delete ${name} ?`)) {
          // Call the function to remove the person
          handleRemovePerson(id)
          console.log("Person removed");
        }
      }}
    >delete</button>
  )
}

export default RemovePerson