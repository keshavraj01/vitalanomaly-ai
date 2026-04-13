// import React, { useState } from "react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

import Hero from "./components/Hero";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const fileInputRef = React.useRef();
  const [fileName, setFileName] = useState("");

  const [loggedIn, setLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const savedLogin = localStorage.getItem("loggedIn");
    const savedUser = localStorage.getItem("username");

    if (savedLogin === "true") {
      setLoggedIn(true);
      setUsername(savedUser);
    }
  }, []);


  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    setFileName(selectedFile.name); // 🔥 NEW
    uploadFile(selectedFile);
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:8000/upload", formData);
      setResult(res.data);

      setTimeout(() => {
        window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
      }, 300);
    } catch (err) {
      alert("Error uploading file");
    }

    setLoading(false);
  };

  // DOWNLOAD REPORT
  const downloadReport = () => {
    let text = "Health Anomaly Detection Report\n\n";

    text += "Summary:\n";
    Object.entries(result.health_summary).forEach(([k, v]) => {
      text += `${k}: ${v}\n`;
    });

    text += "\nDetected Features:\n";
    result.columns.forEach((col) => {
      text += `- ${col}\n`;
    });

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "report.txt";
    a.click();
  };

  // LOGIN / REGISTER SCREEN
  if (!loggedIn) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        {showRegister ? (
          <>
            <Register />
            <p
              onClick={() => setShowRegister(false)}
              style={{ cursor: "pointer", color: "blue" }}
            >
              Already have account? Login
            </p>
          </>
        ) : (
          <>
            <Login setLoggedIn={setLoggedIn} />
            <p
              onClick={() => setShowRegister(true)}
              style={{ cursor: "pointer", color: "blue" }}
            >
              New user? Register
            </p>
          </>
        )}
      </div>
    );
  }

  // DASHBOARD (AFTER LOGIN)
  return (
    <>
      {/* HEADER */}
      <div className="header">
        <h3>👋 Welcome, {username}</h3>

        <button
          onClick={() => {
            localStorage.removeItem("loggedIn");
            localStorage.removeItem("username");
            setLoggedIn(false);
          }}
        >
          Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="container">

        {loading && <p style={{ textAlign: "center" }}>⏳ Processing... Please wait</p>}

        {/* HERO SECTION */}
        <Hero
          onUploadClick={() => fileInputRef.current.click()}
          fileName={fileName}
        />

        {/* HIDDEN FILE INPUT */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileSelect}
        />

        {/* RESULTS */}
        {result && (
          <div className="results-section">
            {/* Summary */}
            <div className="card">
              <h2>Health Summary</h2>
              <div className="summary-grid">
                {Object.entries(result.health_summary).map(([key, value]) => {
                  let color = "#e3f2fd";

                  if (key === "Critical") color = "#ffebee";
                  else if (key === "Risk") color = "#fff8e1";
                  else if (key === "Normal") color = "#e8f5e9";

                  return (
                    <div className="summary-item" key={key} style={{ background: color }}>
                      <h3>{key}</h3>
                      <p>{value}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Features */}
            <div className="card">
              <h2>Detected Features</h2>
              <ul>
                {result.columns.map((col, i) => (
                  <li key={i}>{col}</li>
                ))}
              </ul>
            </div>

            {/* Graphs */}
            <div className="card">
              <h2>Graphs</h2>

              {Object.keys(result.plots).map((col, index) => (
                <div key={index} className="graph">
                  <h3>{col}</h3>
                  <img
                    src={`data:image/png;base64,${result.plots[col]}`}
                    alt={col}
                  />
                </div>
              ))}
            </div>

            {/* Download */}
            <button onClick={downloadReport} style={{ marginTop: "10px" }}>
              📥 Download Report
            </button>
          </div>
        )}
      </div>
    </>
  );
}
export default App;