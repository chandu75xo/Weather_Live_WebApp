import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Weather.css";

const Weather = () => {
  const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
  const cities = [
    "Hyderabad",
    "Vijayawada",
    "Delhi",
    "Mumbai",
    "Chennai",
    "Bangalore",
    "Kolkata",
    "Jaipur",
    "Kochi",
    "Ahmedabad",
    "Noida",
    "Darjeeling",
  ];
  const [weatherData, setWeatherData] = useState([]);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const promises = cities.map((city) =>
          axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          )
        );
        const results = await Promise.all(promises);
        const formattedData = results.map((result) => ({
          city: result.data.name,
          temperature: result.data.main.temp,
          description: result.data.weather[0].description,
          humidity: result.data.main.humidity,
          windSpeed: result.data.wind.speed,
        }));
        setWeatherData(formattedData);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeather();
  }, [API_KEY, cities]);

  const handleClick = (event) => {
    const card = event.currentTarget;
    card.classList.toggle("expanded");
  };

  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Live Weather Report
      </h2>
      <div
        style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}
      >
        {weatherData.map((data, index) => (
          <div key={index} className="weather-card" onClick={handleClick}>
            <h3>{data.city}</h3>
            <p>
              <strong>Temperature:</strong> {data.temperature}°C
            </p>
            <p>
              <strong>Description:</strong> {data.description}
            </p>
            <p>
              <strong>Humidity:</strong> {data.humidity}%
            </p>
            <p>
              <strong>Wind Speed:</strong> {data.windSpeed} m/s
            </p>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Link to="/">
          <button
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
              backgroundColor: "#DC3545",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Back
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Weather;
