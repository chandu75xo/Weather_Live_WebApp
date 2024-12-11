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
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [showSearchBlock, setShowSearchBlock] = useState(false);
  const [error, setError] = useState("");

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

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&appid=${API_KEY}&units=metric`
      );
      const result = {
        city: response.data.name,
        temperature: response.data.main.temp,
        description: response.data.weather[0].description,
        humidity: response.data.main.humidity,
        windSpeed: response.data.wind.speed,
      };
      setSearchResult(result);
      setError("");
      setShowSearchBlock(true);
    } catch (error) {
      setSearchResult(null);
      setError("No matching results found.");
      setShowSearchBlock(true);
    }
  };

  const handleClick = (event) => {
    const card = event.currentTarget;
    card.classList.toggle("expanded");
  };

  const handleCollapse = () => {
    setShowSearchBlock(false);
    setSearchResult(null);
    setError("");
    setSearchTerm("");
  };

  return (
    <div>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Live Weather Report
      </h1>

      {/* Search Bar */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search for a place..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "16px",
            width: "70%",
            border: "1px solid #ccc",
            borderRadius: "5px",
            marginRight: "10px",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            backgroundColor: "#5FAA43",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
          }}
        >
          🔍
        </button>
      </div>

      {/* Search Results Block */}
      {showSearchBlock && (
        <div
          style={{
            margin: "20px auto",
            color: "#ffffff",
            width: "80%",
            backgroundColor: "rgba(34, 34, 34, 0.85)",
            border: "1px solid #ccc",
            borderRadius: "15px",
            padding: "20px",
            position: "relative",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <button
            onClick={handleCollapse}
            style={{
              position: "absolute",
              top: "8px",
              right: "7px",
              padding: "5px",
              background: "red",
              color: "white",
              border: "none",
              borderRadius: "100%",
              cursor: "pointer",
              width: "35px",
              height: "40px",
              textAlign: "center",
            }}
          >
            ✖
          </button>
          {searchResult ? (
            <>
              <h3>{searchResult.city}</h3>
              <p>
                <strong>Temperature:</strong> {searchResult.temperature}°C
              </p>
              <p>
                <strong>Description:</strong> {searchResult.description}
              </p>
              <p>
                <strong>Humidity:</strong> {searchResult.humidity}%
              </p>
              <p>
                <strong>Wind Speed:</strong> {searchResult.windSpeed} m/s
              </p>
            </>
          ) : (
            <p style={{ textAlign: "center", color: "white" }}>{error}</p>
          )}
        </div>
      )}

      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Top Cities (Weather)
      </h2>
      {/* Weather Cards */}
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

      {/* Back Button */}
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
