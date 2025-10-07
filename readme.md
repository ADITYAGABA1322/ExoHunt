# 🌌 ExoHunt - Exoplanet Discovery Platform

[![NASA Space Apps Challenge](https://img.shields.io/badge/NASA-Space%20Apps%20Challenge-blue.svg)](https://www.spaceappschallenge.org/)
[![Machine Learning](https://img.shields.io/badge/ML-Exoplanet%20Detection-green.svg)](https://github.com/yourusername/exohunt)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js-black.svg)](https://nextjs.org/)
[![Python](https://img.shields.io/badge/Backend-Python-yellow.svg)](https://python.org/)

## 🚀 Overview

ExoHunt is an innovative machine learning platform designed for the NASA Space Apps Challenge that leverages real NASA datasets (Kepler, K2, TESS) to predict and discover exoplanets. The project combines advanced ML algorithms with an intuitive web interface to make exoplanet discovery accessible and interactive.

## ✨ Features

- 🔬 **Advanced ML Models**: Multi-algorithm approach using ensemble methods for exoplanet detection
- 📊 **Real NASA Data**: Integration with Kepler, K2, and TESS mission datasets
- 🎯 **Interactive Dashboard**: Real-time predictions and data visualization
- 📈 **Data Analytics**: Comprehensive exploration of exoplanet characteristics
- 🌐 **Modern UI/UX**: Responsive Next.js frontend with space-themed design
- 🔄 **Real-time API**: FastAPI backend for seamless data processing

## 🏗️ Project Architecture

```
exohunt/
├── ml-backend/                 # Python ML Backend
│   ├── api/                   # FastAPI endpoints
│   ├── app/                   # Core ML applications
│   ├── data/                  # NASA datasets & processing
│   ├── notebooks/             # Jupyter analysis notebooks
│   └── tests/                 # Backend testing suite
└── next.js-frontend/          # Next.js Frontend
    ├── src/
    │   ├── app/              # App router pages
    │   └── components/       # React components
    └── public/               # Static assets
```

## 🛠️ Technology Stack

### Backend (ml-backend/)
- **Framework**: FastAPI
- **ML Libraries**: 
  - CatBoost (Primary classifier)
  - Scikit-learn
  - Pandas, NumPy
- **Data Processing**: Custom NASA data pipeline
- **Deployment**: Vercel serverless functions

### Frontend (next.js-frontend/)
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Components**: Custom React components
- **Visualization**: Interactive charts and graphs
- **Deployment**: Vercel

### Data Sources
- **Kepler Mission**: Confirmed exoplanet candidates
- **K2 Mission**: Extended Kepler observations
- **TESS Mission**: Transiting Exoplanet Survey Satellite data

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 18+
- npm or yarn

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/exohunt.git
cd exohunt/ml-backend
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Download NASA datasets**
```bash
cd data
python download_data.py
```

5. **Start the API server**
```bash
cd api
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd ../next.js-frontend
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Start development server**
```bash
npm run dev
# or
yarn dev
```

The frontend will be available at `http://localhost:3000`

## 📊 Data Pipeline

### Raw Data Processing
```
NASA Archives → Raw CSV Files → Data Cleaning → Feature Engineering → ML-Ready Dataset
```

### Supported Datasets
- **kepler_raw.csv**: Original Kepler mission data
- **k2_raw.csv**: K2 extended mission observations
- **tess_raw.csv**: TESS survey data

### Processed Outputs
- **unified_exoplanets.csv**: Combined and cleaned dataset
- **kepler_processed.csv**: Processed Kepler-specific features
- **kepler_sample.csv**: Sample dataset for testing

## 🤖 Machine Learning Models

### Primary Classifier: CatBoost
- **Why CatBoost**: Excellent performance on categorical features common in astronomical data
- **Features**: 
  - Orbital period
  - Transit depth
  - Stellar magnitude
  - Planet radius
  - Host star properties

### Model Performance
- **Accuracy**: ~94% on validation set
- **Precision**: High precision for confirmed exoplanets
- **Recall**: Optimized to minimize false negatives

### Training Pipeline
```bash
cd ml-backend/app
python train.py              # Basic training
python train_advanced.py     # Advanced ensemble methods
```

## 🎯 API Endpoints

### Core Endpoints
- `GET /` - Health check
- `POST /predict` - Single exoplanet prediction
- `POST /batch-predict` - Batch predictions
- `GET /models/status` - Model information
- `GET /data/stats` - Dataset statistics

### Example API Usage
```python
import requests

# Single prediction
response = requests.post("http://localhost:8000/predict", json={
    "orbital_period": 365.25,
    "transit_depth": 0.001,
    "stellar_magnitude": 12.5,
    "planet_radius": 1.0
})

print(response.json())
# Output: {"prediction": "confirmed", "confidence": 0.89}
```

## 🎨 Frontend Components

### Core Components
- **ExoHuntDashboard**: Main application interface
- **PredictionForm**: Input form for exoplanet parameters
- **ResultsVisualization**: Charts and prediction results
- **DataExplorer**: Interactive data exploration
- **ModelConfig**: ML model configuration interface

### Key Features
- **Real-time Predictions**: Instant ML model inference
- **Interactive Visualizations**: D3.js powered charts
- **Responsive Design**: Mobile-first approach
- **Space Theme**: Immersive astronomical UI

## 📈 Development Workflow

### Running Tests
```bash
# Backend tests
cd ml-backend
python -m pytest tests/

# Frontend tests (if implemented)
cd next.js-frontend
npm test
```

### Development Dashboards
```bash
# Streamlit dashboard
cd ml-backend/app
streamlit run dashboard_streamlit.py

# Dash dashboard
python dashboard_dash.py
```

## 🚀 Deployment

### Backend (Vercel)
The FastAPI backend is configured for Vercel serverless deployment:
```bash
cd ml-backend
vercel deploy
```

### Frontend (Vercel)
```bash
cd next.js-frontend
vercel deploy
```

## 🔬 NASA Space Apps Challenge

### Challenge Theme
**"Exoplanet Exploration"** - Develop innovative solutions for exoplanet discovery and characterization

### Our Solution
ExoHunt addresses the challenge by:
1. **Democratizing Discovery**: Making exoplanet detection accessible to researchers and enthusiasts
2. **Data Integration**: Combining multiple NASA mission datasets
3. **ML Innovation**: Applying state-of-the-art machine learning to astronomical data
4. **Interactive Learning**: Educational platform for understanding exoplanet science

### Impact
- **Scientific**: Advanced ML techniques for astronomical discovery
- **Educational**: Interactive learning about exoplanets
- **Accessibility**: User-friendly interface for complex astronomical data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.



## 🙏 Acknowledgments

- **NASA** for providing open access to mission data
- **Kepler, K2, and TESS** mission teams
- **Space Apps Challenge** organizers
- **Open source community** for amazing tools and libraries

## Demo

-  [https://exohunt.vercel.app](https://exohunt.vercel.app)

---

<div align="center">
  <strong>🌌 Discovering worlds beyond our solar system, one prediction at a time 🌌</strong>
</div>