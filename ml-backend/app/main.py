from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from huggingface_hub import hf_hub_download
from mangum import Mangum  # serverless adapter
import joblib
import numpy as np
import json
from typing import List, Dict

app = FastAPI(title="ExoHunt API", version="2.0-ADVANCED")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Hugging Face model repo
REPO_ID = "XcodeAddy/exoplanet-model-advanced"  # Replace with your repo ID

# Globals
model = None
scaler = None
metadata = None

@app.on_event("startup")
async def load_model():
    """Download & load model from Hugging Face Hub"""
    global model, scaler, metadata
    try:
        model_path = hf_hub_download(repo_id=REPO_ID, filename="exoplanet_model_advanced.pkl")
        scaler_path = hf_hub_download(repo_id=REPO_ID, filename="scaler_advanced.pkl")
        metadata_path = hf_hub_download(repo_id=REPO_ID, filename="model_metadata_advanced.json")

        model = joblib.load(model_path)
        scaler = joblib.load(scaler_path)

        with open(metadata_path, "r") as f:
            metadata = json.load(f)

    except Exception as e:
        print(f"Failed to load model: {e}")

# Pydantic models
class PlanetInput(BaseModel):
    period: float; duration: float; depth: float; prad: float
    teq: float; insol: float; steff: float; slogg: float; srad: float

class PredictionResponse(BaseModel):
    is_exoplanet: bool
    confidence: float
    probability_exoplanet: float
    probability_non_exoplanet: float
    classification: str
    model_metrics: Dict

# Feature engineering
def engineer_features(data: PlanetInput) -> np.ndarray:
    features = {
        'period': data.period, 'duration': data.duration, 'depth': data.depth,
        'prad': data.prad, 'teq': data.teq, 'insol': data.insol,
        'steff': data.steff, 'slogg': data.slogg, 'srad': data.srad
    }

    # Derived features
    features['transit_depth_ratio'] = data.depth / (data.prad**2 + 1e-10)
    features['duration_period_ratio'] = data.duration / (data.period + 1e-10)
    features['stellar_density'] = 10**data.slogg / (data.srad**2 + 1e-10)
    features['stellar_luminosity'] = (data.srad**2) * (data.steff**4)
    features['planet_density'] = (data.prad**3) / (data.period**2 + 1e-10)
    features['equilibrium_temp_ratio'] = data.teq / (data.steff + 1e-10)
    features['irradiation_ratio'] = data.insol / (data.teq + 1e-10)
    features['semi_major_axis'] = ((data.period / 365.25)**2 * data.srad)**(1/3)
    features['orbital_velocity'] = (2 * np.pi * features['semi_major_axis']) / (data.period + 1e-10)
    features['habitable_zone_distance'] = features['semi_major_axis'] / (np.sqrt(data.insol) + 1e-10)
    features['surface_gravity'] = data.slogg * (data.prad**2)
    features['log_period'] = np.log10(data.period + 1)
    features['log_insol'] = np.log10(data.insol + 1)
    features['log_depth'] = np.log10(data.depth + 1)
    features['sqrt_prad'] = np.sqrt(data.prad)
    features['prad_teq_interaction'] = data.prad * data.teq
    features['period_depth_interaction'] = data.period * data.depth
    features['insol_steff_interaction'] = data.insol * data.steff
    features['period_squared'] = data.period**2
    features['prad_squared'] = data.prad**2
    features['depth_squared'] = data.depth**2

    feature_order = metadata['feature_names']
    feature_array = np.array([features[name] for name in feature_order])
    return feature_array.reshape(1, -1)

# Routes
@app.get("/")
async def root():
    return {"message": "ExoHunt ML backend running!", "model_loaded": model is not None}

@app.post("/predict", response_model=PredictionResponse)
async def predict_exoplanet(planet: PlanetInput):
    if model is None or scaler is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    X = engineer_features(planet)
    X_scaled = scaler.transform(X)
    prediction = model.predict(X_scaled)[0]
    probabilities = model.predict_proba(X_scaled)[0]
    prob_non = float(probabilities[0])
    prob_exo = float(probabilities[1])
    confidence = max(prob_non, prob_exo)
    classification = (
        "🌟 Highly Likely Exoplanet" if prob_exo >= 0.9 else
        "✨ Probable Exoplanet" if prob_exo >= 0.7 else
        "🔍 Possible Exoplanet" if prob_exo >= 0.5 else
        "❓ Unlikely Exoplanet" if prob_exo >= 0.3 else
        "❌ Not an Exoplanet"
    )
    return PredictionResponse(
        is_exoplanet=bool(prediction),
        confidence=confidence,
        probability_exoplanet=prob_exo,
        probability_non_exoplanet=prob_non,
        classification=classification,
        model_metrics=metadata['metrics']
    )

# Wrap FastAPI for serverless
handler = Mangum(app)