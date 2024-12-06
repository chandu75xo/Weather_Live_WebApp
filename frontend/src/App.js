import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import WelcomePage from "./components/WelcomePage";
import Weather from "./components/Weather";
import WeatherPredictor from "./components/WeatherPredictor";

const App = () => {
  return (
    <Router>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/live-weather" element={<Weather />} />
          <Route path="/weather-predictor" element={<WeatherPredictor />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
