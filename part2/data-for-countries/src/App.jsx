import { useState, useEffect } from 'react'
import countriesService from './services/countries'
import axios from 'axios'

const apiKey = import.meta.env.VITE_OPEN_WEATHER_API_KEY

const ShowWeather = ( {country} ) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    if (country){
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${country}&appid=${apiKey}&units=metric`

      axios
        .get(url)
        .then(response => {
          setWeather(response.data)
          console.log(response.data)
        })
        .catch(error => {
          console.error('Error fetching weather data:', error)
        })
    }
  }, [country])

  if (!weather) {
    return <p>Loading weather...</p>
  }

  return (
    <div>
      <h2>Weather in {country}</h2>
      <p>Temperature: {weather.main.temp}°C</p>
      <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} />
      <div>Wind: {weather.wind.speed} m/s</div>
    </div>
  )
}

const ShowDetails = ( {country} ) => {
  return (
    <div>
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
      <ShowWeather country={country.name.common} />
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const [searchCountry, setSearchCountry] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

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

  const handleShowDetails = (country) => {
    setSelectedCountry(country)
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
            {country.name.common} <button onClick={() => handleShowDetails(country)}>show</button>
            {selectedCountry !== null && selectedCountry.name.common === country.name.common && <ShowDetails country={selectedCountry} />}
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
            <ShowWeather country={country.name.common} />
          </div>
        )
      }
    </div>
  )
}

export default App
