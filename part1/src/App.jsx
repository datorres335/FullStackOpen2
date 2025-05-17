const Header = (props) => {
  return (
    <h1>{props.course}</h1>
  )
}

const Content = (props) => {
  return(
    <div>
      {props.parts.map((part, i) => (
        <p key={i}> {/* the key prop seems redundant but its necessary when iterating thru indexes in an array */}
          <Part part={part.name} exercises={props.parts[i].exercises}/>
        </p>
      ))}
    </div>
  )
}

const Part = (props) => {
  return (
    <>
      {props.part} {props.exercises}
    </>
  )
}

const Total = (props) => {
  const total = props.parts.reduce((sum, part) => sum + part.exercises, 0)
  return(
    <p>{total}</p>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const parts = [
    {
      name: 'Fundamentals of React',
      exercises: 10
    },
    {
      name: 'Using props to pass data',
      exercises: 7
    },
    {
      name: 'State of a component',
      exercises: 14
    }
  ]

  return (
    <div>
      <Header course={course}/>
      <Content parts={parts}/>
      <Total parts={parts}/>
    </div>
  )
}

export default App