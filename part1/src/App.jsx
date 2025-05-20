import { useState } from 'react'

const Button = ( props ) => {
  const {handleClick, text} = props
  console.log(props);
  
  return (
    <button onClick={handleClick}>
      {text}
    </button>
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
      good {good} <br/>
      neutral {neutral} <br/>
      bad {bad} <br/>
      all {good + neutral + bad} <br/>
      average {((good - bad) / (good + neutral + bad))} <br/>
      positive {((good) / (good + neutral + bad)) * 100} %
    </div>
  )
}

export default App