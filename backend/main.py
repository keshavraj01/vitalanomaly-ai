from pydantic import BaseModel

# simple in-memory storage (for demo)
users_db = {}

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import io

# 🔥 NEW IMPORTS (IMPORTANT)
import matplotlib.pyplot as plt
import base64
from io import BytesIO

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def detect_columns(df):
    
    detected = {}
    cols = {col.lower().replace("_", " ").strip(): col for col in df.columns}
    
    hr_keywords = ["heart rate", "hr", "pulse"]
    for key in cols:
        if any(k in key for k in hr_keywords):
            detected["hr"] = cols[key]
    
    spo2_keywords = ["spo2", "oxygen", "o2"]
    for key in cols:
        if any(k in key for k in spo2_keywords):
            detected["spo2"] = cols[key]
    
    resp_keywords = ["respiration", "breath", "resp"]
    for key in cols:
        if any(k in key for k in resp_keywords):
            detected["resp"] = cols[key]
    
    for key in cols:
        if "systolic" in key:
            detected["bp_sys"] = cols[key]
    
    for key in cols:
        if "diastolic" in key:
            detected["bp_dia"] = cols[key]
    
    for key in cols:
        if "blood pressure" in key or key.strip() == "bp":
            detected["bp_full"] = cols[key]
    
    return detected



def detect_anomalies(df):
    
    results = {}
    
    for col in df.columns:
        
        upper = df[col].quantile(0.99)
        lower = df[col].quantile(0.01)
        
        mask = (df[col] > upper) | (df[col] < lower)
        
        results[col] = {
            "upper": upper,
            "lower": lower,
            "mask": mask
        }
    
    return results



def classify_health_dynamic(df):
    
    labels = []
    
    for _, row in df.iterrows():
        
        if "SpO2" in df.columns and row.get("SpO2", 100) < 90:
            labels.append("Critical")
        
        elif "Heart Rate" in df.columns and row.get("Heart Rate", 0) > 100:
            labels.append("Risk")
        
        else:
            labels.append("Normal")
    
    return labels



def generate_plot(df, anomalies, feature):
    
    plt.figure(figsize=(8,3))
    
    values = df[feature]
    
    plt.plot(values)
    
    upper = anomalies[feature]["upper"]
    lower = anomalies[feature]["lower"]
    
    plt.axhline(upper, linestyle='--')
    plt.axhline(lower, linestyle='--')
    
    mask = anomalies[feature]["mask"]
    
    plt.scatter(df.index[mask], values[mask], color='red', s=10)
    
    plt.title(feature)
    
    buffer = BytesIO()
    plt.savefig(buffer, format="png")
    plt.close()
    
    buffer.seek(0)
    
    image_base64 = base64.b64encode(buffer.read()).decode()
    
    return image_base64

class User(BaseModel):
    username: str
    password: str


@app.post("/register")
def register(user: User):
    
    if user.username in users_db:
        return {"message": "User already exists"}
    
    users_db[user.username] = user.password
    
    return {"message": "User registered successfully"}

@app.post("/login")
def login(user: User):
    
    if user.username not in users_db:
        return {"message": "User not found"}
    
    if users_db[user.username] != user.password:
        return {"message": "Invalid password"}
    
    return {"message": "Login successful"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    
    contents = await file.read()
    
    df = pd.read_csv(io.BytesIO(contents))
    
    # Fix malformed CSV
    if df.shape[1] == 1:
        df = df.iloc[:, 0].str.split(",", expand=True)
        df.columns = df.iloc[0]
        df = df[1:]
        df = df.reset_index(drop=True)
    
    df.columns = df.columns.str.strip()
    
    detected = detect_columns(df)
    
    selected_data = pd.DataFrame()
    
    if "hr" in detected:
        selected_data["Heart Rate"] = pd.to_numeric(df[detected["hr"]], errors='coerce')
    
    if "spo2" in detected:
        selected_data["SpO2"] = pd.to_numeric(df[detected["spo2"]], errors='coerce')
    
    if "resp" in detected:
        selected_data["Respiration"] = pd.to_numeric(df[detected["resp"]], errors='coerce')
    
    if "bp_sys" in detected:
        selected_data["Systolic"] = pd.to_numeric(df[detected["bp_sys"]], errors='coerce')
    
    if "bp_dia" in detected:
        selected_data["Diastolic"] = pd.to_numeric(df[detected["bp_dia"]], errors='coerce')
    
    if "bp_full" in detected:
        sys = []
        dia = []
        for val in df[detected["bp_full"]]:
            try:
                s, d = str(val).split('/')
                sys.append(float(s))
                dia.append(float(d))
            except:
                sys.append(np.nan)
                dia.append(np.nan)
        selected_data["Systolic"] = sys
        selected_data["Diastolic"] = dia
    
    selected_data = selected_data.fillna(selected_data.mean())
    
    if selected_data.shape[1] == 0:
        return {"error": "No valid health features detected"}
    
    anomalies = detect_anomalies(selected_data)
    labels = classify_health_dynamic(selected_data)
    
    from collections import Counter
    
    # 🔥 NEW: generate plots
    plots = {}
    for col in selected_data.columns:
        plots[col] = generate_plot(selected_data, anomalies, col)
    
    return {
        "columns": selected_data.columns.tolist(),
        "health_summary": dict(Counter(labels)),
        "plots": plots
    }