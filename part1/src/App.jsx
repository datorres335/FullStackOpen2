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
          {part} {props.exercises[i]}
        </p>
      ))}
    </div>
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
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14
  const parts = [part1, part2, part3]
  const exercises = [exercises1, exercises2, exercises3]

  return (
    <div>
      <Header course={course}/>
      <Content parts={parts} exercises={exercises}/>
      <Total exercises={exercises}/>
    </div>
  )
}

export default App