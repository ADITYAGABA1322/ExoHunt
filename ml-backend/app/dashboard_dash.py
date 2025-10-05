"""
ExoHunt Plotly Dash Dashboard
Advanced interactive visualization platform
"""

import dash
from dash import dcc, html, Input, Output, State
import dash_bootstrap_components as dbc
import plotly.graph_objects as go
import plotly.express as px
import requests
import pandas as pd
import numpy as np

# Initialize app with dark theme
app = dash.Dash(__name__, external_stylesheets=[dbc.themes.CYBORG])
app.title = "ExoHunt - AI Exoplanet Discovery"

# API endpoint
API_URL = "http://localhost:8000"

# Examples
EXAMPLES = {
    'exoplanet': {
        'period': 3.52, 'duration': 2.8, 'depth': 615.0,
        'prad': 2.26, 'teq': 1540.0, 'insol': 340.0,
        'steff': 5455.0, 'slogg': 4.467, 'srad': 0.927
    },
    'non-exoplanet': {
        'period': 19.89, 'duration': 1.78, 'depth': 10829.0,
        'prad': 14.6, 'teq': 638.0, 'insol': 39.3,
        'steff': 5853.0, 'slogg': 4.544, 'srad': 0.868
    }
}

# Layout
app.layout = dbc.Container([
    # Header
    dbc.Row([
        dbc.Col([
            html.H1("🌟 ExoHunt", className="text-center mb-2"),
            html.H4("AI-Powered Exoplanet Discovery Platform", className="text-center text-muted mb-4"),
            dbc.Badge("90.44% Accuracy", color="success", className="me-2"),
            dbc.Badge("Stacking Ensemble", color="info"),
        ], width=12)
    ]),
    
    html.Hr(),
    
    # Main content
    dbc.Row([
        # Left column - Inputs
        dbc.Col([
            dbc.Card([
                dbc.CardHeader(html.H4("🔬 Input Parameters")),
                dbc.CardBody([
                    # Quick load buttons
                    dbc.ButtonGroup([
                        dbc.Button("🌍 Exoplanet Example", id="btn-exoplanet", color="success", outline=True),
                        dbc.Button("⭕ Non-Exoplanet", id="btn-non-exoplanet", color="danger", outline=True),
                    ], className="mb-4 w-100"),
                    
                    # Input fields
                    dbc.Row([
                        dbc.Col([
                            dbc.Label("Orbital Period (days)"),
                            dbc.Input(id="input-period", type="number", value=3.52, step=0.01),
                        ], width=6),
                        dbc.Col([
                            dbc.Label("Transit Duration (hours)"),
                            dbc.Input(id="input-duration", type="number", value=2.8, step=0.01),
                        ], width=6),
                    ], className="mb-3"),
                    
                    dbc.Row([
                        dbc.Col([
                            dbc.Label("Transit Depth (ppm)"),
                            dbc.Input(id="input-depth", type="number", value=615.0, step=0.1),
                        ], width=6),
                        dbc.Col([
                            dbc.Label("Planet Radius (Earth radii)"),
                            dbc.Input(id="input-prad", type="number", value=2.26, step=0.01),
                        ], width=6),
                    ], className="mb-3"),
                    
                    dbc.Row([
                        dbc.Col([
                            dbc.Label("Equilibrium Temperature (K)"),
                            dbc.Input(id="input-teq", type="number", value=1540.0, step=0.1),
                        ], width=6),
                        dbc.Col([
                            dbc.Label("Insolation Flux (Earth flux)"),
                            dbc.Input(id="input-insol", type="number", value=340.0, step=0.1),
                        ], width=6),
                    ], className="mb-3"),
                    
                    dbc.Row([
                        dbc.Col([
                            dbc.Label("Stellar Temperature (K)"),
                            dbc.Input(id="input-steff", type="number", value=5455.0, step=0.1),
                        ], width=4),
                        dbc.Col([
                            dbc.Label("Stellar Surface Gravity"),
                            dbc.Input(id="input-slogg", type="number", value=4.467, step=0.001),
                        ], width=4),
                        dbc.Col([
                            dbc.Label("Stellar Radius (Solar radii)"),
                            dbc.Input(id="input-srad", type="number", value=0.927, step=0.001),
                        ], width=4),
                    ], className="mb-4"),
                    
                    dbc.Button("🔍 Predict Exoplanet", id="btn-predict", color="primary", size="lg", className="w-100"),
                ])
            ], className="mb-4"),
        ], width=5),
        
        # Right column - Results
        dbc.Col([
            # Result card
            dbc.Card([
                dbc.CardHeader(html.H4("🎯 Prediction Results")),
                dbc.CardBody([
                    dbc.Spinner([
                        html.Div(id="prediction-result")
                    ])
                ])
            ], className="mb-4"),
            
            # Charts
            dbc.Card([
                dbc.CardHeader(html.H4("📊 Visualization")),
                dbc.CardBody([
                    dcc.Graph(id="probability-chart"),
                    dcc.Graph(id="confidence-gauge"),
                ])
            ])
        ], width=7),
    ]),
    
    # Footer
    html.Hr(),
    dbc.Row([
        dbc.Col([
            html.P("🌟 ExoHunt - Powered by Advanced Machine Learning", className="text-center text-muted"),
            html.P("Model: Stacking Ensemble | Accuracy: 90.44% | F1 Score: 90.43%", className="text-center text-muted"),
        ], width=12)
    ])
], fluid=True, className="p-4")


# Callbacks
@app.callback(
    [Output(f"input-{param}", "value") for param in EXAMPLES['exoplanet'].keys()],
    [Input("btn-exoplanet", "n_clicks"), Input("btn-non-exoplanet", "n_clicks")],
    prevent_initial_call=True
)
def load_example(n_exo, n_non):
    ctx = dash.callback_context
    if not ctx.triggered:
        return dash.no_update
    
    button_id = ctx.triggered[0]['prop_id'].split('.')[0]
    
    if button_id == "btn-exoplanet":
        example = EXAMPLES['exoplanet']
    else:
        example = EXAMPLES['non-exoplanet']
    
    return list(example.values())


@app.callback(
    [Output("prediction-result", "children"),
     Output("probability-chart", "figure"),
     Output("confidence-gauge", "figure")],
    Input("btn-predict", "n_clicks"),
    [State(f"input-{param}", "value") for param in EXAMPLES['exoplanet'].keys()],
    prevent_initial_call=True
)
def predict(n_clicks, *values):
    if not n_clicks:
        return dash.no_update
    
    # Prepare payload
    param_names = list(EXAMPLES['exoplanet'].keys())
    payload = {name: float(value) for name, value in zip(param_names, values)}
    
    try:
        response = requests.post(f"{API_URL}/predict", json=payload)
        
        if response.status_code == 200:
            result = response.json()
            
            # Result alert
            if result['is_exoplanet']:
                result_alert = dbc.Alert([
                    html.H3("✅ Exoplanet Detected!", className="alert-heading"),
                    html.P(result['classification'], className="mb-0"),
                    html.Hr(),
                    html.P(f"Confidence: {result['confidence']*100:.2f}%", className="mb-0")
                ], color="success")
            else:
                result_alert = dbc.Alert([
                    html.H3("❌ Not an Exoplanet", className="alert-heading"),
                    html.P(result['classification'], className="mb-0"),
                    html.Hr(),
                    html.P(f"Confidence: {result['confidence']*100:.2f}%", className="mb-0")
                ], color="danger")
            
            # Probability chart
            prob_fig = go.Figure(data=[
                go.Bar(
                    x=['Exoplanet', 'Non-Exoplanet'],
                    y=[result['probability_exoplanet']*100, result['probability_non_exoplanet']*100],
                    marker_color=['#28a745', '#dc3545'],
                    text=[f"{result['probability_exoplanet']*100:.2f}%", f"{result['probability_non_exoplanet']*100:.2f}%"],
                    textposition='auto',
                )
            ])
            prob_fig.update_layout(
                title="Probability Distribution",
                yaxis_title="Probability (%)",
                template="plotly_dark",
                height=300
            )
            
            # Confidence gauge
            gauge_fig = go.Figure(go.Indicator(
                mode="gauge+number",
                value=result['confidence']*100,
                title={'text': "Confidence Level"},
                gauge={
                    'axis': {'range': [0, 100]},
                    'bar': {'color': "#28a745" if result['is_exoplanet'] else "#dc3545"},
                    'steps': [
                        {'range': [0, 50], 'color': "#343a40"},
                        {'range': [50, 75], 'color': "#495057"},
                        {'range': [75, 100], 'color': "#6c757d"}
                    ],
                    'threshold': {
                        'line': {'color': "white", 'width': 4},
                        'thickness': 0.75,
                        'value': 90
                    }
                }
            ))
            gauge_fig.update_layout(template="plotly_dark", height=300)
            
            return result_alert, prob_fig, gauge_fig
            
        else:
            return dbc.Alert("❌ Prediction failed", color="danger"), {}, {}
            
    except Exception as e:
        return dbc.Alert(f"❌ Error: {str(e)}", color="danger"), {}, {}


if __name__ == '__main__':
    app.run(debug=True, port=8050) 