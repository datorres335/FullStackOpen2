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
          <Part part={part} exercises={props.exercises[i]}/>
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
  const total = props.exercises.reduce((acc, curr) => acc + curr, 0)
  return(
    <p>{total}</p>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = {
    name: 'Fundamentals of React',
    exercises: 10
  }
  const part2 = {
    name: 'Using props to pass data',
    exercises: 7
  }
  const part3 = {
    name: 'State of a component',
    exercises: 14
  }
  const parts = [part1.name, part2.name, part3.name]
  const exercises = [part1.exercises, part2.exercises, part3.exercises]

  return (
    <div>
      <Header course={course}/>
      <Content parts={parts} exercises={exercises}/>
      <Total exercises={exercises}/>
    </div>
  )
}

export default App