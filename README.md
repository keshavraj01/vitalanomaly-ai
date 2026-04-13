# 🚀 VitalAnomaly AI  
### Precision Anomaly Detection for Physiological Data

---

## 🧠 Overview

**VitalAnomaly AI** is a full-stack AI-powered web application that detects anomalies in physiological health data such as:

- ❤️ Heart Rate  
- 🫁 Blood Oxygen (SpO₂)  
- 💉 Blood Pressure  
- 🌬️ Respiration Rate  

The system automatically processes uploaded datasets, detects abnormal patterns, classifies health conditions, and visualizes results in an interactive dashboard.

---

## 🎯 Problem Statement

Modern healthcare systems generate large volumes of physiological data from wearable devices and medical sensors.

However:
- Manual monitoring is inefficient  
- Critical anomalies may go unnoticed  
- Different datasets have inconsistent formats  

👉 This project solves these challenges by:
- Automatically detecting anomalies  
- Handling multiple dataset formats  
- Providing real-time visualization  

---

## 🚀 Features

- 📁 Upload CSV health datasets
- 🔍 Automatic feature detection (HR, SpO₂, BP, Respiration)
- ⚙️ Data preprocessing & cleaning
- 📊 Graph visualization with anomaly points
- 🚨 Anomaly detection using statistical methods
- 🧠 Health classification (Normal / Risk / Critical)
- 🌐 Full-stack dashboard (React + FastAPI)
- 🔐 Login & Register system
- 📥 Downloadable report

---

## 🏗️ System Architecture

User Upload → FastAPI Backend → ML Processing → JSON Response → React Dashboard

---

## ⚙️ Machine Learning Pipeline

### 🔹 Data Preprocessing
- Column normalization
- Missing value handling
- Dynamic column detection

### 🔹 Feature Extraction
- Heart Rate
- SpO₂
- Blood Pressure (Systolic & Diastolic)
- Respiration Rate

### 🔹 Anomaly Detection

---

## 📊 Output

- Health Summary  
- Detected Features  
- Graphs with anomaly points  
- Threshold lines  
- Downloadable report  

---

## 🛠️ Tech Stack

### 🔹 Backend
- Python
- FastAPI
- Pandas
- NumPy
- Matplotlib

### 🔹 Frontend
- React.js
- Axios
- Chart.js
- CSS

### 🔹 Tools
- VS Code
- Jupyter Notebook
- Git & GitHub

---

## 🔐 Authentication

- Login & Register system  
- Session stored using localStorage  
