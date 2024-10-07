import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

export default function Weather() {
  const [city, setCity] = useState("Paris"); // Default city
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState("C"); // Unit toggle between Celsius and Fahrenheit

  useEffect(() => {
    const fetchWeather = async () => {
      if (!city) return;

      setLoading(true);

      try {
        const apiKey = `8ca7dd4e61360b90fb66918853670e48`; // Replace with your actual API key
        const units = unit === "C" ? "metric" : "imperial";
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;

        const weatherResponse = await axios.get(weatherUrl);
        const currentWeather = weatherResponse.data;
        const roundedTemperature = Math.round(currentWeather.main.temp);
        const timezoneOffset = currentWeather.timezone;

        setWeatherData({
          city: currentWeather.name,
          temperature: roundedTemperature,
          description: currentWeather.weather[0].description,
          humidity: currentWeather.main.humidity,
          wind: currentWeather.wind.speed,
          icon: currentWeather.weather[0].icon,
          timezoneOffset,
        });
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city, unit]); // Re-fetch data when unit changes

  const handleSubmit = (e) => {
    e.preventDefault();
    const inputCity = e.target.elements.city.value;
    setCity(inputCity);
    e.target.reset();
  };

  const toggleUnit = (selectedUnit) => {
    setUnit(selectedUnit);
  };

  if (loading) return <h4>Loading...</h4>;
  if (error) return <h4>{error}</h4>;

  return (
    <div>
      <h3>React Weather App</h3>

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-9">
            <input
              type="text"
              id="city"
              placeholder="Enter a city..."
              required
            />
          </div>
          <div className="col-3">
            <button type="submit">Search</button>
          </div>
        </div>
      </form>

      {weatherData && (
        <div className="WeatherInfo">
          <div className="row">
            <div className="col-6">
              <h1>{weatherData.city}</h1>
              <ul className="city-info">
                <li>
                  <span>
                    {moment()
                      .utcOffset(weatherData.timezoneOffset / 60)
                      .format("dddd HH:mm")}
                  </span>
                  , {weatherData.description}
                </li>
                <li>
                  Humidity:{" "}
                  <strong className="humidity">{weatherData.humidity}%</strong>,
                  Wind: <strong className="wind">{weatherData.wind} m/s</strong>
                </li>
              </ul>
            </div>

            <div className="col-6">
              <div className="temperature-container d-flex justify-content-end">
                <span className="icon">
                  <img
                    src={`http://openweathermap.org/img/wn/${weatherData.icon}.png`}
                    alt={weatherData.description}
                    className="main-icon"
                  />
                </span>
                <span className="temperature">{weatherData.temperature}</span>

                <div className="unit-toggle">
                  <span
                    className={`unit-option ${unit === "C" ? "active" : ""}`}
                    onClick={() => toggleUnit("C")}
                  >
                    °C
                  </span>{" "}
                  |{" "}
                  <span
                    className={`unit-option ${unit === "F" ? "active" : ""}`}
                    onClick={() => toggleUnit("F")}
                  >
                    °F
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
