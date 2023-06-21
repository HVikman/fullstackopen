import "./App.css";
import { useState, useEffect } from "react";
import apiService from "./services/api";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    apiService.getAll().then((response) => {
      setCountries(response.data);
    });
  }, []);
  console.log(countries.length, "countries");

  const handleFilterChange = (event) => {
    console.log(event.target.value);
    setFilter(event.target.value);
  };

  const countriesToShow = countries.filter((country) =>
    country.name.common.toLowerCase().startsWith(filter.toLowerCase())
  );

  return (
    <div>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <CountryList countries={countriesToShow} setFilter={setFilter} />
    </div>
  );
};
const CountryList = ({ countries, setFilter }) => {
  const handleClick = (name) => {
    console.log(name);
    setFilter(name);
  };
  return (
    <div>
      {countries.length === 1 ? (
        countries.map((c) => <CountryInfo country={c} />)
      ) : countries.length > 10 ? (
        <p>Too many countries</p>
      ) : (
        countries.map((c) => (
          <p key={c.name.common}>
            {c.name.common}{" "}
            <button type="button" onClick={() => handleClick(c.name.common)}>
              show
            </button>
          </p>
        ))
      )}
    </div>
  );
};
const Filter = ({ filter, handleFilterChange }) => {
  return (
    <div>
      Search countries: <input value={filter} onChange={handleFilterChange} />
    </div>
  );
};
const CountryInfo = ({ country }) => {
  console.log("CountryInfo rendered");
  const [weather, setWeather] = useState(null);
  useEffect(() => {
    console.log("Fetching weather");
    if (weather === null) {
      apiService
        .weather(country.capitalInfo.latlng[0], country.capitalInfo.latlng[1])
        .then((response) => {
          setWeather(response.data.current_weather);
        });
    }
  });
  console.log(weather);
  console.log(country);

  const languages = Object.values(country.languages);
  return (
    <div>
      <h1>{country.name.common}</h1>
      <img src={country.flags.png} alt={country.name.common} />
      <p>{country.capital}</p>
      <p>
        {country.area} m<sup>2</sup>
      </p>
      <h3>Languages</h3>

      <ul>
        {languages.map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      {weather && (
        <div>
          <h3>Weather in {country.capital}</h3>
          <p>Temperature: {weather.temperature}&deg;C</p>
          <p>Wind speed: {weather.windspeed} km/h</p>
        </div>
      )}
    </div>
  );
};
export default App;
