import { useState } from 'react'

const Button = ( props ) => {
  const {handleClick, text} = props
  
  return (
    <button onClick={handleClick}>
      {text}
    </button>
  )
}

const Statistics = (props) => {
  const {good, neutral, bad} = props

  if (good + neutral + bad === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }
  
  return (
    <table>
      <tbody>
        <tr><td>good</td><td>{good}</td></tr>
        <tr><td>neutral</td><td>{neutral}</td></tr>
        <tr><td>bad</td><td>{bad}</td></tr>
        <tr><td>all</td><td>{good + neutral + bad}</td></tr>
        <tr><td>average</td><td>{((good - bad) / (good + neutral + bad))}</td></tr>
        <tr><td>positive</td><td>{((good) / (good + neutral + bad)) * 100}%</td></tr>
      </tbody>
    </table>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => setGood(good + 1)} text="good" />
      <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="bad" />

      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App