import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./PredictForm.css";

const WeatherPredictor = () => {
  const navigate = useNavigate();

  // State for form input
  const [formData, setFormData] = useState({
    humidity: "",
    pressure: "",
    rh1: "",
    rh2: "",
    wind: "",
  });

  // States for API data and prediction results
  const [currentWeather, setCurrentWeather] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [modelUsed, setModelUsed] = useState(null);
  const [modelAccuracies, setModelAccuracies] = useState(null);
  const [modelErrors, setModelErrors] = useState(null);

  // Fetch current weather data when the component mounts
  useEffect(() => {
    const fetchCurrentWeather = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=35&lon=139&appid=cff3cb92d6f50292f547456cb572ec1b&units=metric`
        );

        const data = response.data;
        setCurrentWeather({
          humidity: data.main.humidity,
          pressure: data.main.pressure,
          rh1: data.main.temp_min,
          rh2: data.main.temp_max,
          wind: data.wind.speed,
        });
      } catch (error) {
        console.error("Error fetching current weather:", error);
      }
    };

    fetchCurrentWeather();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input
    const features = Object.values(formData).map((value) => parseFloat(value));
    if (features.some((val) => isNaN(val))) {
      alert("Please fill in all fields with valid numbers.");
      return;
    }

    try {
      const response = await axios.post("https://weather-live-webapp-1.onrender.com/api/predict", {
        features,
      });

      const { temperature, model_used, model_accuracies, model_errors } =
        response.data;

      setPrediction(temperature);
      setModelUsed(model_used);
      setModelAccuracies(model_accuracies);
      setModelErrors(model_errors);
    } catch (error) {
      console.error("Error predicting temperature:", error);
      setPrediction("An error occurred during prediction. Please try again.");
    }
  };

  // Handle form reset
  const handleClear = () => {
    setFormData({
      humidity: "",
      pressure: "",
      rh1: "",
      rh2: "",
      wind: "",
    });
    setPrediction(null);
    setModelUsed(null);
    setModelAccuracies(null);
    setModelErrors(null);
  };

  return (
    <div>
      {prediction === null ? (
        <div className="current-weather">
          {currentWeather && (
            <div>
              <h3>Current Weather Data</h3>
              <p>Humidity: {currentWeather.humidity}%</p>
              <p>Pressure: {currentWeather.pressure} hPa</p>
              <p>RH1 (Min Temp): {currentWeather.rh1} °C</p>
              <p>RH2 (Max Temp): {currentWeather.rh2} °C</p>
              <p>Wind Speed: {currentWeather.wind} m/s</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <h3>Enter Weather Data for Prediction</h3>
            {[
              { label: "Humidity (%)", name: "humidity" },
              { label: "Pressure (hPa)", name: "pressure" },
              { label: "RH1 (Min Temp °C)", name: "rh1" },
              { label: "RH2 (Max Temp °C)", name: "rh2" },
              { label: "Wind Speed (m/s)", name: "wind" },
            ].map(({ label, name }) => (
              <div key={name}>
                <label>
                  {label}:
                  <input
                    type="number"
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
            ))}
            <br />
            <button type="submit">Predict</button>
            <button type="button" onClick={handleClear}>
              Clear
            </button>
          </form>
          <button id="btn1" type="button" onClick={() => navigate("/")}>
            Back
          </button>
        </div>
      ) : (
        <div className="prediction-result-container">
          {typeof prediction === "string" ? (
            <p>{prediction}</p>
          ) : (
            <>
              <h2 style={{ fontSize: "30px", fontFamily: "inherit" }}>
                Prediction Result
              </h2>
              <p className="predict-card">
                Predicted Temperature: {prediction} °F <br></br>Model Used:{" "}
                {modelUsed}
              </p>

              {modelAccuracies && (
                <div className="predict-card">
                  <h3>Model Accuracies</h3>
                  <ul>
                    {Object.entries(modelAccuracies).map(
                      ([model, accuracy]) => (
                        <li key={model}>
                          {model}: {accuracy.toFixed(2)}%
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

              {modelErrors && (
                <div className="predict-card">
                  <h3>Model Errors</h3>
                  <ul>
                    {Object.entries(modelErrors).map(([model, error]) => (
                      <li key={model}>
                        {model}: {error.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
          <button onClick={() => setPrediction(null)}>Back</button>
        </div>
      )}
    </div>
  );
};

export default WeatherPredictor;
