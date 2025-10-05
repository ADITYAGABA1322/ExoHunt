"""
ExoHunt Streamlit Dashboard
Beautiful interactive UI for exoplanet predictions
"""

import streamlit as st
import requests
import pandas as pd
import plotly.graph_objects as go
import plotly.express as px
from pathlib import Path
import json

# Page config
st.set_page_config(
    page_title="ExoHunt - AI Exoplanet Discovery",
    page_icon="🌟",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
<style>
    .main {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .stButton>button {
        width: 100%;
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        color: white;
        font-weight: bold;
        border-radius: 10px;
        padding: 15px;
        border: none;
    }
    .stButton>button:hover {
        background: linear-gradient(90deg, #764ba2 0%, #667eea 100%);
    }
    .metric-card {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 15px;
        padding: 20px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
</style>
""", unsafe_allow_html=True)

# API endpoint
API_URL = "http://localhost:8000"

# Header
st.markdown("""
# 🌟 ExoHunt
### AI-Powered Exoplanet Discovery Platform
*Utilizing advanced machine learning with 90.44% accuracy*
""")

# Sidebar
with st.sidebar:
    st.image("https://via.placeholder.com/300x200/667eea/ffffff?text=ExoHunt", use_column_width=True)
    
    st.markdown("### 🚀 Model Information")
    
    try:
        response = requests.get(f"{API_URL}/model-info")
        if response.status_code == 200:
            model_info = response.json()
            st.metric("Model Type", model_info['model_type'])
            st.metric("Features Used", model_info['features_used'])
            st.metric("Accuracy", f"{model_info['metrics']['accuracy']*100:.2f}%")
            st.metric("F1 Score", f"{model_info['metrics']['f1_score']*100:.2f}%")
    except:
        st.error("⚠️ Backend not running")
    
    st.markdown("---")
    st.markdown("### 📚 Quick Examples")
    
    if st.button("🌍 Load Exoplanet Example"):
        st.session_state.example = 'exoplanet'
    
    if st.button("⭕ Load Non-Exoplanet"):
        st.session_state.example = 'non-exoplanet'

# Main content
col1, col2 = st.columns([1, 1])

with col1:
    st.markdown("### 🔬 Input Parameters")
    
    # Load examples
    if 'example' not in st.session_state:
        st.session_state.example = None
    
    if st.session_state.example == 'exoplanet':
        defaults = {
            'period': 3.52, 'duration': 2.8, 'depth': 615.0,
            'prad': 2.26, 'teq': 1540.0, 'insol': 340.0,
            'steff': 5455.0, 'slogg': 4.467, 'srad': 0.927
        }
    elif st.session_state.example == 'non-exoplanet':
        defaults = {
            'period': 19.89, 'duration': 1.78, 'depth': 10829.0,
            'prad': 14.6, 'teq': 638.0, 'insol': 39.3,
            'steff': 5853.0, 'slogg': 4.544, 'srad': 0.868
        }
    else:
        defaults = {
            'period': 3.52, 'duration': 2.8, 'depth': 615.0,
            'prad': 2.26, 'teq': 1540.0, 'insol': 340.0,
            'steff': 5455.0, 'slogg': 4.467, 'srad': 0.927
        }
    
    with st.form("prediction_form"):
        period = st.number_input("Orbital Period (days)", value=defaults['period'], format="%.2f")
        duration = st.number_input("Transit Duration (hours)", value=defaults['duration'], format="%.2f")
        depth = st.number_input("Transit Depth (ppm)", value=defaults['depth'], format="%.1f")
        prad = st.number_input("Planet Radius (Earth radii)", value=defaults['prad'], format="%.2f")
        teq = st.number_input("Equilibrium Temperature (K)", value=defaults['teq'], format="%.1f")
        insol = st.number_input("Insolation Flux (Earth flux)", value=defaults['insol'], format="%.1f")
        steff = st.number_input("Stellar Temperature (K)", value=defaults['steff'], format="%.1f")
        slogg = st.number_input("Stellar Surface Gravity", value=defaults['slogg'], format="%.3f")
        srad = st.number_input("Stellar Radius (Solar radii)", value=defaults['srad'], format="%.3f")
        
        submitted = st.form_submit_button("🔍 Predict Exoplanet", use_container_width=True)

with col2:
    st.markdown("### 🎯 Prediction Results")
    
    if submitted:
        with st.spinner("🌌 Analyzing stellar data..."):
            try:
                payload = {
                    "period": period, "duration": duration, "depth": depth,
                    "prad": prad, "teq": teq, "insol": insol,
                    "steff": steff, "slogg": slogg, "srad": srad
                }
                
                response = requests.post(f"{API_URL}/predict", json=payload)
                
                if response.status_code == 200:
                    result = response.json()
                    
                    # Main result
                    if result['is_exoplanet']:
                        st.success(f"## ✅ {result['classification']}")
                    else:
                        st.error(f"## ❌ {result['classification']}")
                    
                    # Confidence gauge
                    fig_gauge = go.Figure(go.Indicator(
                        mode="gauge+number+delta",
                        value=result['confidence'] * 100,
                        title={'text': "Confidence Level"},
                        domain={'x': [0, 1], 'y': [0, 1]},
                        gauge={
                            'axis': {'range': [0, 100]},
                            'bar': {'color': "darkgreen" if result['is_exoplanet'] else "darkred"},
                            'steps': [
                                {'range': [0, 50], 'color': "lightgray"},
                                {'range': [50, 75], 'color': "gray"},
                                {'range': [75, 100], 'color': "lightgreen"}
                            ],
                            'threshold': {
                                'line': {'color': "red", 'width': 4},
                                'thickness': 0.75,
                                'value': 90
                            }
                        }
                    ))
                    fig_gauge.update_layout(height=300, margin=dict(l=20, r=20, t=50, b=20))
                    st.plotly_chart(fig_gauge, use_container_width=True)
                    
                    # Probability bars
                    prob_df = pd.DataFrame({
                        'Category': ['Exoplanet', 'Non-Exoplanet'],
                        'Probability': [
                            result['probability_exoplanet'] * 100,
                            result['probability_non_exoplanet'] * 100
                        ]
                    })
                    
                    fig_bar = px.bar(
                        prob_df, x='Category', y='Probability',
                        color='Category',
                        color_discrete_map={'Exoplanet': '#10b981', 'Non-Exoplanet': '#ef4444'},
                        title="Probability Distribution"
                    )
                    fig_bar.update_layout(height=300, showlegend=False)
                    st.plotly_chart(fig_bar, use_container_width=True)
                    
                    # Model metrics
                    st.markdown("### 📊 Model Performance")
                    metric_col1, metric_col2, metric_col3 = st.columns(3)
                    
                    with metric_col1:
                        st.metric("Accuracy", f"{result['model_metrics']['accuracy']*100:.2f}%")
                    with metric_col2:
                        st.metric("F1 Score", f"{result['model_metrics']['f1_score']*100:.2f}%")
                    with metric_col3:
                        st.metric("ROC-AUC", f"{result['model_metrics']['roc_auc']*100:.2f}%")
                    
                else:
                    st.error("❌ Prediction failed")
                    
            except Exception as e:
                st.error(f"❌ Error: {str(e)}")
                st.info("Make sure the backend is running: `cd ml-backend && uvicorn app.main:app`")
    else:
        st.info("👆 Enter parameters and click Predict to discover exoplanets!")
        st.image("https://via.placeholder.com/600x400/667eea/ffffff?text=Awaiting+Prediction", use_column_width=True)

# Footer
st.markdown("---")
st.markdown("""
<div style='text-align: center; color: rgba(255,255,255,0.6);'>
    <p>🌟 ExoHunt - Powered by Advanced Machine Learning</p>
    <p>Model: Stacking Ensemble | Accuracy: 90.44% | F1 Score: 90.43%</p>
</div>
""", unsafe_allow_html=True)