const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') { // Avoid logging in test environment
    // This check prevents logging in test environments, which is useful for cleaner test outputs.
    console.log(...params)
  }
}

const error = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(...params)
  }
}

module.exports = { info, error }