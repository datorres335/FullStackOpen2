import deepFreeze from 'deep-freeze'
import counterReducer from './reducer'

describe('unicafe reducer', () => {
  const initialState = {
    good: 0,
    ok: 0,
    bad: 0
  }

  test('should return a proper initial state when called with undefined state', () => {
    const state = {}
    const action = {
      type: 'DO_NOTHING'
    }

    const newState = counterReducer(undefined, action)
    deepFreeze(newState)
    expect(newState).toEqual(initialState)
  })

  test('good is incremented', () => {
    const action = {
      type: 'GOOD'
    }
    const state = initialState

    deepFreeze(state) //The deepFreeze(state) command ensures that the reducer does not change the state of the store given to it as a parameter. 
    const newState = counterReducer(state, action)
    expect(newState).toEqual({
      good: 1,
      ok: 0,
      bad: 0
    })
    deepFreeze(newState)
  })

  test('ok is incremented', () => {
    const action = {
      type: 'OK'
    }
    const state = initialState

    deepFreeze(state) //The deepFreeze(state) command ensures that the reducer does not change the state of the store given to it as a parameter. 
    const newState = counterReducer(state, action)
    expect(newState).toEqual({
      good: 0,
      ok: 1,
      bad: 0
    })
    deepFreeze(newState)
  })

  test('bad is incremented', () => {
    const action = {
      type: 'BAD'
    }
    const state = initialState

    deepFreeze(state) //The deepFreeze(state) command ensures that the reducer does not change the state of the store given to it as a parameter. 
    const newState = counterReducer(state, action)
    expect(newState).toEqual({
      good: 0,
      ok: 0,
      bad: 1
    })
    deepFreeze(newState)
  })

  test('reset stats button resets all state values to zero', () => {
    const action = {
      type: 'ZERO'
    }
    const state = initialState

    deepFreeze(state) //The deepFreeze(state) command ensures that the reducer does not change the state of the store given to it as a parameter. 
    const newState = counterReducer(state, action)
    expect(newState).toEqual({
      good: 0,
      ok: 0,
      bad: 0
    })
    deepFreeze(newState)
  })
})