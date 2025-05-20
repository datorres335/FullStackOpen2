const Course = ( {course} ) => {
  const { name, parts } = course

  return (
    <div>
      <h1>{name}</h1>
      {parts.map(part => (
        <p key={part.id}>
          {part.name} {part.exercises}
        </p>
      ))}
      <p><b>total of {parts.reduce((sum, part) => sum + part.exercises, 0)} exercises </b></p>
    </div>
  )
}

export default Course