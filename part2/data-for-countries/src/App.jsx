import { useState, useEffect } from 'react'
import countriesService from './services/countries'

const App = () => {
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const [searchCountry, setSearchCountry] = useState('')

  useEffect(() => {
    countriesService
      .getAll()
      .then(response => {
        setCountries(response)
      })
  }, [searchCountry])

  const handleSearch = (event) => {
    const filteredCountries = countries.filter(country => country.name.common.toLowerCase().includes(event.target.value.toLowerCase()))
    setSearchCountry(event.target.value)
    setFilteredCountries(filteredCountries)
    console.log(filteredCountries)
    
  }

  return (
    <div>
      find countries <input value={searchCountry} onChange={handleSearch} /> <br />
      {
        filteredCountries.length > 10 ? 
        <p>Too many matches, specify another filter</p> : 
        filteredCountries.length <= 10 && filteredCountries.length > 1 ?
        filteredCountries.map(country =>
          <div key={country.name.common}>
            {country.name.common}
          </div>
        ) :
        filteredCountries.map((country, i) =>
          <div key={i}>
            <h1>{country.name.common}</h1>
            <p>Capital {country.capital}</p>
            <p>Area {country.area}</p>
            <h2>Languages</h2>
            <ul>
              {/* We use Object.values here because country.languages is an object, not an array.
                  Object.values(country.languages) returns an array of language names, allowing us to use map. */}
              {Object.values(country.languages).map((language, j) => 
                <li key={j}>{language}</li>
              )}
            </ul>
            <img src={country.flags.png} alt={`Flag of ${country.name.common}`} />
          </div>
        )
      }
    </div>
  )
}

export default App
