import React from "react";
import { Link } from "react-router-dom";
import "./WelcomePage.css";

const WelcomePage = () => {
  return (
    <div className="welcome-page-container">
      <h1 className="welcome-page-title">Welcome to Weather Web App</h1>
      <p className="welcome-page-description">
        Choose an option below to get started:
      </p>
      <div className="button-container">
        <Link to="/live-weather">
          <button className="welcome-page-button">Live Weather Report</button>
        </Link>
        <Link to="/weather-predictor">
          <button className="welcome-page-button">Weather Predictor</button>
        </Link>
      </div>
    </div>
  );
};

export default WelcomePage;
