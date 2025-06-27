import React from 'react'
import ReactDOM from 'react-dom/client'

import { createStore } from 'redux'
import reducer from './reducer'

const store = createStore(reducer)
store.subscribe(() => {
  // subscribe is called every time an action is dispatched
  console.log('State changed:', store.getState())
})
console.log('Initial state of store:', store.getState())

const App = () => {
  const good = () => {
    store.dispatch({
      type: 'GOOD'
    })
  }

  const ok = () => {
    store.dispatch({
      type: 'OK'
    })
  }

  const bad = () => {
    store.dispatch({
      type: 'BAD'
    })
  }

  const zero = () => {
    store.dispatch({
      type: 'ZERO'
    })
  }

  return (
    <div>
      <button onClick={good}>good</button> 
      <button onClick={ok}>ok</button> 
      <button onClick={bad}>bad</button>
      <button onClick={zero}>reset stats</button>
      <div>good {store.getState().good}</div>
      <div>ok {store.getState().ok}</div>
      <div>bad {store.getState().bad}</div>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))

const renderApp = () => {
  root.render(<App />)
}

renderApp()
store.subscribe(renderApp) // React is not able to automatically re-render the application when the Redux store changes. We need to call the renderApp function every time the state of the store changes
