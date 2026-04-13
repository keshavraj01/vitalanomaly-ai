import React from "react";
import "./Hero.css";

import gif1 from "../assets/ai.gif";
import gif2 from "../assets/Comp12.gif";
import gif3 from "../assets/error.gif";

function Hero({ onUploadClick, fileName }) {
  return (
    <div className="hero-container">

      {/* LEFT CONTENT */}
      <div className="hero-left">
        <h1 className="brand">VitalAnomaly AI</h1>

        <h2 className="headline">
          Precision Anomaly Detection for <span>Physiological Data</span>
        </h2>

        <p className="subtext">
          Real-time AI monitoring for heart rate, blood oxygen, and activity patterns
          to detect critical health shifts before they become emergencies.
        </p>

        <div className="buttons">
          <button className="primary-btn" onClick={onUploadClick}>
            Upload Health Data →
          </button>

          <button 
            className="secondary-btn"
            onClick={() => window.open("https://drive.google.com/file/d/1nC8RxnJ4eMgD5wMMR9nUtH6OpIeUUiWL/view?usp=sharing", "_blank")}
          >
            View Live Demo
          </button>
        </div>

        {fileName && (
          <p style={{ marginTop: "10px", color: "#cbd5e1" }}>
            Uploaded: {fileName}
          </p>
        )}
      </div>

      {/* RIGHT VISUAL */}
      <div className="hero-right">

        {/* TOP */}
        <div className="gif gif-top">
          <img src={require("../assets/ai.gif")} alt="AI" />
        </div>

        {/* LEFT */}
        <div className="gif gif-left">
          <img src={require("../assets/Comp12.gif")} alt="Processing" />
        </div>

        {/* RIGHT */}
        <div className="gif gif-right">
          <img src={require("../assets/error.gif")} alt="Anomaly" />
        </div>

      </div>

    </div>
  );
}

export default Hero;