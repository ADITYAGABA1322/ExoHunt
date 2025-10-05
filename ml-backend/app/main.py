from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib
import numpy as np
from pathlib import Path
import json
from typing import List, Dict

app = FastAPI(title="ExoHunt API", version="2.0-ADVANCED")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load advanced model
MODEL_PATH = Path("models/trained/exoplanet_model_advanced.pkl")
SCALER_PATH = Path("models/trained/scaler_advanced.pkl")
METADATA_PATH = Path("models/trained/model_metadata_advanced.json")

model = None
scaler = None
metadata = None

@app.on_event("startup")
async def load_model():
    """Load model on startup"""
    global model, scaler, metadata
    
    try:
        model = joblib.load(MODEL_PATH)
        scaler = joblib.load(SCALER_PATH)
        
        with open(METADATA_PATH, 'r') as f:
            metadata = json.load(f)
        
        print("✅ Advanced model loaded successfully!")
        print(f"   Accuracy: {metadata['metrics']['accuracy']*100:.2f}%")
        print(f"   F1 Score: {metadata['metrics']['f1_score']*100:.2f}%")
        
    except Exception as e:
        print(f"❌ Failed to load model: {e}")


class PlanetInput(BaseModel):
    """Input schema for planet prediction"""
    period: float = Field(..., description="Orbital period (days)", gt=0)
    duration: float = Field(..., description="Transit duration (hours)", gt=0)
    depth: float = Field(..., description="Transit depth (ppm)", gt=0)
    prad: float = Field(..., description="Planet radius (Earth radii)", gt=0)
    teq: float = Field(..., description="Equilibrium temperature (K)", gt=0)
    insol: float = Field(..., description="Insolation flux (Earth flux)", gt=0)
    steff: float = Field(..., description="Stellar temperature (K)", gt=0)
    slogg: float = Field(..., description="Stellar surface gravity", gt=0)
    srad: float = Field(..., description="Stellar radius (Solar radii)", gt=0)


class PredictionResponse(BaseModel):
    """Response schema"""
    is_exoplanet: bool
    confidence: float
    probability_exoplanet: float
    probability_non_exoplanet: float
    classification: str
    model_metrics: Dict


def engineer_features(data: PlanetInput) -> np.ndarray:
    """
    Engineer the same 30 features used in training
    THIS IS CRITICAL - must match train_advanced.py exactly!
    """
    # Base features
    features = {
        'period': data.period,
        'duration': data.duration,
        'depth': data.depth,
        'prad': data.prad,
        'teq': data.teq,
        'insol': data.insol,
        'steff': data.steff,
        'slogg': data.slogg,
        'srad': data.srad
    }
    
    # Physics-based derived features (SAME AS TRAINING!)
    features['transit_depth_ratio'] = data.depth / (data.prad**2 + 1e-10)
    features['duration_period_ratio'] = data.duration / (data.period + 1e-10)
    features['stellar_density'] = 10**data.slogg / (data.srad**2 + 1e-10)
    features['stellar_luminosity'] = (data.srad**2) * (data.steff**4)
    features['planet_density'] = (data.prad**3) / (data.period**2 + 1e-10)
    features['equilibrium_temp_ratio'] = data.teq / (data.steff + 1e-10)
    features['irradiation_ratio'] = data.insol / (data.teq + 1e-10)
    
    # Orbital mechanics
    features['semi_major_axis'] = ((data.period / 365.25)**2 * data.srad)**(1/3)
    features['orbital_velocity'] = (2 * np.pi * features['semi_major_axis']) / (data.period + 1e-10)
    
    # Habitability indicators
    features['habitable_zone_distance'] = features['semi_major_axis'] / (np.sqrt(data.insol) + 1e-10)
    features['surface_gravity'] = data.slogg * (data.prad**2)
    
    # Statistical transformations
    features['log_period'] = np.log10(data.period + 1)
    features['log_insol'] = np.log10(data.insol + 1)
    features['log_depth'] = np.log10(data.depth + 1)
    features['sqrt_prad'] = np.sqrt(data.prad)
    
    # Interaction features
    features['prad_teq_interaction'] = data.prad * data.teq
    features['period_depth_interaction'] = data.period * data.depth
    features['insol_steff_interaction'] = data.insol * data.steff
    
    # Polynomial features
    features['period_squared'] = data.period**2
    features['prad_squared'] = data.prad**2
    features['depth_squared'] = data.depth**2
    
    # Convert to array in correct order
    feature_order = metadata['feature_names']
    feature_array = np.array([features[name] for name in feature_order])
    
    return feature_array.reshape(1, -1)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "🚀 ExoHunt Advanced API v2.0",
        "status": "operational",
        "model_loaded": model is not None,
        "accuracy": f"{metadata['metrics']['accuracy']*100:.2f}%" if metadata else "N/A"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    if model is None or scaler is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    return {
        "status": "healthy",
        "model": "StackingClassifier",
        "metrics": metadata['metrics'] if metadata else {}
    }


@app.post("/predict", response_model=PredictionResponse)
async def predict_exoplanet(planet: PlanetInput):
    """
    Predict if candidate is an exoplanet
    
    Returns probability and classification with 90%+ accuracy!
    """
    if model is None or scaler is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        # Engineer features (30 features total)
        X = engineer_features(planet)
        
        # Scale features
        X_scaled = scaler.transform(X)
        
        # Predict
        prediction = model.predict(X_scaled)[0]
        probabilities = model.predict_proba(X_scaled)[0]
        
        # Extract probabilities
        prob_non_exoplanet = float(probabilities[0])
        prob_exoplanet = float(probabilities[1])
        
        # Confidence (max probability)
        confidence = max(prob_exoplanet, prob_non_exoplanet)
        
        # Classification
        if prob_exoplanet >= 0.9:
            classification = "🌟 Highly Likely Exoplanet"
        elif prob_exoplanet >= 0.7:
            classification = "✨ Probable Exoplanet"
        elif prob_exoplanet >= 0.5:
            classification = "🔍 Possible Exoplanet"
        elif prob_exoplanet >= 0.3:
            classification = "❓ Unlikely Exoplanet"
        else:
            classification = "❌ Not an Exoplanet"
        
        return PredictionResponse(
            is_exoplanet=bool(prediction),
            confidence=confidence,
            probability_exoplanet=prob_exoplanet,
            probability_non_exoplanet=prob_non_exoplanet,
            classification=classification,
            model_metrics={
                "accuracy": metadata['metrics']['accuracy'],
                "f1_score": metadata['metrics']['f1_score'],
                "roc_auc": metadata['metrics']['roc_auc']
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@app.post("/batch-predict")
async def batch_predict(planets: List[PlanetInput]):
    """Batch prediction endpoint"""
    if model is None or scaler is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    results = []
    for planet in planets:
        try:
            result = await predict_exoplanet(planet)
            results.append(result.dict())
        except Exception as e:
            results.append({"error": str(e)})
    
    return {"predictions": results, "total": len(results)}


@app.get("/model-info")
async def model_info():
    """Get detailed model information"""
    if metadata is None:
        raise HTTPException(status_code=503, detail="Model metadata not available")
    
    return {
        "model_type": metadata['model_type'],
        "features_used": len(metadata['feature_names']),
        "feature_names": metadata['feature_names'],
        "training_date": metadata['training_date'],
        "metrics": metadata['metrics'],
        "notes": metadata['notes']
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)