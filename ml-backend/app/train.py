"""
ExoHunt ML Training Pipeline - ULTIMATE VERSION
Tests MULTIPLE algorithms and selects the BEST performer
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import (
    classification_report, 
    confusion_matrix, 
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score
)

# ML Algorithms
from sklearn.ensemble import (
    RandomForestClassifier,
    GradientBoostingClassifier,
    AdaBoostClassifier,
    ExtraTreesClassifier
)
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.naive_bayes import GaussianNB
from xgboost import XGBClassifier
from lightgbm import LGBMClassifier
from catboost import CatBoostClassifier

import joblib
import json
from pathlib import Path
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
warnings.filterwarnings('ignore')


def load_data():
    """Load preprocessed Kepler data"""
    print("📂 Loading data...")
    
    data_path = Path('data/processed/kepler_processed.csv')
    if not data_path.exists():
        raise FileNotFoundError("❌ Processed data not found! Run download_data.py first.")
    
    df = pd.read_csv(data_path)
    
    print(f"✅ Loaded {len(df)} samples")
    print(f"   - Exoplanets: {df['is_exoplanet'].sum()}")
    print(f"   - Non-Exoplanets: {len(df) - df['is_exoplanet'].sum()}")
    
    return df


def prepare_features(df):
    """Prepare feature matrix and target vector"""
    print("\n🔧 Preparing features...")
    
    # Feature columns
    feature_columns = [
        'koi_period',      # Orbital period (days)
        'koi_duration',    # Transit duration (hours)
        'koi_depth',       # Transit depth (ppm)
        'koi_prad',        # Planetary radius (Earth radii)
        'koi_teq',         # Equilibrium temperature (K)
        'koi_insol',       # Insolation flux (Earth flux)
        'koi_steff',       # Stellar effective temperature (K)
        'koi_slogg',       # Stellar surface gravity
        'koi_srad'         # Stellar radius (Solar radii)
    ]
    
    X = df[feature_columns].values
    y = df['is_exoplanet'].values
    
    print(f"✅ Feature matrix shape: {X.shape}")
    print(f"✅ Target distribution: {np.bincount(y)}")
    
    return X, y, feature_columns


def get_all_models():
    """Define all ML models to test"""
    models = {
        'Random Forest': RandomForestClassifier(
            n_estimators=300,
            max_depth=25,
            min_samples_split=4,
            min_samples_leaf=2,
            max_features='sqrt',
            random_state=42,
            n_jobs=-1,
            class_weight='balanced'
        ),
        
        'XGBoost': XGBClassifier(
            n_estimators=300,
            max_depth=10,
            learning_rate=0.1,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=42,
            n_jobs=-1,
            eval_metric='logloss'
        ),
        
        'LightGBM': LGBMClassifier(
            n_estimators=300,
            max_depth=15,
            learning_rate=0.1,
            num_leaves=50,
            random_state=42,
            n_jobs=-1,
            verbose=-1
        ),
        
        'CatBoost': CatBoostClassifier(
            iterations=300,
            depth=10,
            learning_rate=0.1,
            random_state=42,
            verbose=0
        ),
        
        'Gradient Boosting': GradientBoostingClassifier(
            n_estimators=200,
            max_depth=8,
            learning_rate=0.1,
            random_state=42
        ),
        
        'Extra Trees': ExtraTreesClassifier(
            n_estimators=300,
            max_depth=25,
            min_samples_split=4,
            random_state=42,
            n_jobs=-1,
            class_weight='balanced'
        ),
        
        'AdaBoost': AdaBoostClassifier(
            n_estimators=200,
            learning_rate=1.0,
            random_state=42
        ),
        
        'Logistic Regression': LogisticRegression(
            max_iter=1000,
            random_state=42,
            n_jobs=-1,
            class_weight='balanced'
        ),
        
        'SVM (RBF)': SVC(
            kernel='rbf',
            C=10,
            gamma='scale',
            probability=True,
            random_state=42,
            class_weight='balanced'
        ),
        
        'K-Nearest Neighbors': KNeighborsClassifier(
            n_neighbors=7,
            weights='distance',
            n_jobs=-1
        ),
        
        'Decision Tree': DecisionTreeClassifier(
            max_depth=20,
            min_samples_split=5,
            random_state=42,
            class_weight='balanced'
        ),
        
        'Naive Bayes': GaussianNB()
    }
    
    return models


def train_and_evaluate_all(X_train, y_train, X_test, y_test, models):
    """Train all models and compare performance"""
    print("\n" + "🔥"*30)
    print(" "*8 + "TRAINING ALL ML ALGORITHMS")
    print("🔥"*30 + "\n")
    
    results = []
    
    for name, model in models.items():
        print(f"🤖 Training {name}...")
        
        try:
            # Train model
            model.fit(X_train, y_train)
            
            # Make predictions
            y_pred = model.predict(X_test)
            
            # Calculate metrics
            accuracy = accuracy_score(y_test, y_pred)
            precision = precision_score(y_test, y_pred, zero_division=0)
            recall = recall_score(y_test, y_pred, zero_division=0)
            f1 = f1_score(y_test, y_pred, zero_division=0)
            
            # ROC-AUC (if model supports predict_proba)
            try:
                y_proba = model.predict_proba(X_test)[:, 1]
                roc_auc = roc_auc_score(y_test, y_proba)
            except:
                roc_auc = 0.0
            
            # Cross-validation
            cv_scores = cross_val_score(model, X_train, y_train, cv=5, scoring='accuracy', n_jobs=-1)
            cv_mean = cv_scores.mean()
            
            results.append({
                'Model': name,
                'Accuracy': accuracy,
                'Precision': precision,
                'Recall': recall,
                'F1 Score': f1,
                'ROC-AUC': roc_auc,
                'CV Mean': cv_mean,
                'CV Std': cv_scores.std(),
                'model_object': model
            })
            
            print(f"   ✅ Accuracy: {accuracy:.4f} | F1: {f1:.4f} | ROC-AUC: {roc_auc:.4f}\n")
            
        except Exception as e:
            print(f"   ❌ Failed: {str(e)}\n")
            continue
    
    return results


def display_results(results):
    """Display comparison table of all models"""
    print("\n" + "="*80)
    print(" "*25 + "🏆 MODEL COMPARISON 🏆")
    print("="*80 + "\n")
    
    # Create DataFrame
    df_results = pd.DataFrame(results)
    df_results = df_results.drop('model_object', axis=1)
    df_results = df_results.sort_values('F1 Score', ascending=False)
    
    # Display formatted table
    print(df_results.to_string(index=False, float_format=lambda x: f'{x:.4f}'))
    
    print("\n" + "="*80 + "\n")
    
    return df_results


def get_best_model(results):
    """Select best model based on F1 Score"""
    best_result = max(results, key=lambda x: x['F1 Score'])
    
    print("🥇 BEST MODEL SELECTED!")
    print("="*60)
    print(f"   Model Name:      {best_result['Model']}")
    print(f"   Accuracy:        {best_result['Accuracy']:.4f} ({best_result['Accuracy']*100:.2f}%)")
    print(f"   Precision:       {best_result['Precision']:.4f} ({best_result['Precision']*100:.2f}%)")
    print(f"   Recall:          {best_result['Recall']:.4f} ({best_result['Recall']*100:.2f}%)")
    print(f"   F1 Score:        {best_result['F1 Score']:.4f} ({best_result['F1 Score']*100:.2f}%)")
    print(f"   ROC-AUC:         {best_result['ROC-AUC']:.4f} ({best_result['ROC-AUC']*100:.2f}%)")
    print(f"   CV Accuracy:     {best_result['CV Mean']:.4f} (+/- {best_result['CV Std']*2:.4f})")
    print("="*60 + "\n")
    
    return best_result


def evaluate_detailed(model, X_train, y_train, X_test, y_test, feature_names, model_name):
    """Detailed evaluation of best model"""
    print(f"\n📊 DETAILED EVALUATION - {model_name}")
    print("="*60)
    
    # Predictions
    y_train_pred = model.predict(X_train)
    y_test_pred = model.predict(X_test)
    
    # Probabilities
    try:
        y_test_proba = model.predict_proba(X_test)[:, 1]
        roc_auc = roc_auc_score(y_test, y_test_proba)
    except:
        y_test_proba = None
        roc_auc = 0.0
    
    # Calculate metrics
    train_accuracy = accuracy_score(y_train, y_train_pred)
    test_accuracy = accuracy_score(y_test, y_test_pred)
    precision = precision_score(y_test, y_test_pred)
    recall = recall_score(y_test, y_test_pred)
    f1 = f1_score(y_test, y_test_pred)
    
    # Confusion Matrix
    cm = confusion_matrix(y_test, y_test_pred)
    print(f"\n📈 CONFUSION MATRIX")
    print(f"   True Negatives:  {cm[0,0]:>4}  |  False Positives: {cm[0,1]:>4}")
    print(f"   False Negatives: {cm[1,0]:>4}  |  True Positives:  {cm[1,1]:>4}")
    
    # Classification Report
    print(f"\n📋 CLASSIFICATION REPORT")
    print(classification_report(y_test, y_test_pred, target_names=['Non-Exoplanet', 'Exoplanet']))
    
    # Feature Importance (if available)
    if hasattr(model, 'feature_importances_'):
        print(f"\n⭐ TOP 5 MOST IMPORTANT FEATURES")
        importances = model.feature_importances_
        indices = np.argsort(importances)[::-1]
        
        for i in range(min(5, len(feature_names))):
            idx = indices[i]
            print(f"   {i+1}. {feature_names[idx]:<20} : {importances[idx]:.4f}")
        
        feature_importances_dict = {
            feature_names[i]: float(importances[i]) 
            for i in range(len(feature_names))
        }
    else:
        feature_importances_dict = {}
    
    return {
        'train_accuracy': float(train_accuracy),
        'test_accuracy': float(test_accuracy),
        'precision': float(precision),
        'recall': float(recall),
        'f1_score': float(f1),
        'roc_auc': float(roc_auc),
        'confusion_matrix': cm.tolist(),
        'feature_importances': feature_importances_dict
    }


def save_model(model, scaler, metrics, feature_names, model_name, all_results):
    """Save best model and all results"""
    print("\n💾 Saving models and results...")
    
    models_dir = Path('models/trained')
    models_dir.mkdir(parents=True, exist_ok=True)
    
    # Save best model
    model_path = models_dir / 'exoplanet_model.pkl'
    joblib.dump(model, model_path)
    print(f"   ✅ Best model saved: {model_path}")
    
    # Save scaler
    scaler_path = models_dir / 'scaler.pkl'
    joblib.dump(scaler, scaler_path)
    print(f"   ✅ Scaler saved: {scaler_path}")
    
    # Save metadata
    metadata = {
        'best_model': model_name,
        'model_type': type(model).__name__,
        'feature_names': feature_names,
        'metrics': metrics,
        'training_date': pd.Timestamp.now().isoformat(),
        'all_models_tested': len(all_results),
        'all_results': all_results.to_dict('records') if isinstance(all_results, pd.DataFrame) else []
    }
    
    metadata_path = models_dir / 'model_metadata.json'
    with open(metadata_path, 'w') as f:
        json.dump(metadata, f, indent=2)
    print(f"   ✅ Metadata saved: {metadata_path}")


def plot_confusion_matrix(cm, model_name, save_path='models/trained/confusion_matrix.png'):
    """Plot confusion matrix"""
    plt.figure(figsize=(8, 6))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                xticklabels=['Non-Exoplanet', 'Exoplanet'],
                yticklabels=['Non-Exoplanet', 'Exoplanet'])
    plt.title(f'Confusion Matrix - {model_name}')
    plt.ylabel('True Label')
    plt.xlabel('Predicted Label')
    plt.tight_layout()
    plt.savefig(save_path, dpi=300)
    print(f"   ✅ Confusion matrix saved: {save_path}")
    plt.close()


def plot_model_comparison(df_results, save_path='models/trained/model_comparison.png'):
    """Plot comparison of all models"""
    fig, axes = plt.subplots(2, 2, figsize=(15, 10))
    
    metrics = ['Accuracy', 'Precision', 'Recall', 'F1 Score']
    
    for idx, metric in enumerate(metrics):
        ax = axes[idx // 2, idx % 2]
        df_sorted = df_results.sort_values(metric, ascending=True)
        ax.barh(df_sorted['Model'], df_sorted[metric], color='skyblue')
        ax.set_xlabel(metric)
        ax.set_title(f'{metric} Comparison')
        ax.set_xlim(0, 1)
        
        # Add value labels
        for i, v in enumerate(df_sorted[metric]):
            ax.text(v + 0.01, i, f'{v:.3f}', va='center')
    
    plt.tight_layout()
    plt.savefig(save_path, dpi=300, bbox_inches='tight')
    print(f"   ✅ Model comparison plot saved: {save_path}")
    plt.close()


def main():
    """Main training pipeline"""
    print("\n" + "🚀"*30)
    print(" "*6 + "EXOHUNT ULTIMATE ML TRAINING PIPELINE")
    print("🚀"*30 + "\n")
    
    # Load data
    df = load_data()
    
    # Prepare features
    X, y, feature_names = prepare_features(df)
    
    # Split data
    print("\n✂️  Splitting data (80% train, 20% test)...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"   Training set: {len(X_train)} samples")
    print(f"   Test set:     {len(X_test)} samples")
    
    # Scale features
    print("\n📏 Scaling features...")
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    print("   ✅ Features scaled using StandardScaler")
    
    # Get all models
    models = get_all_models()
    print(f"\n🤖 Testing {len(models)} ML algorithms...")
    
    # Train and evaluate all models
    results = train_and_evaluate_all(X_train_scaled, y_train, X_test_scaled, y_test, models)
    
    # Display results
    df_results = display_results(results)
    
    # Get best model
    best_result = get_best_model(results)
    best_model = best_result['model_object']
    best_name = best_result['Model']
    
    # Detailed evaluation
    metrics = evaluate_detailed(best_model, X_train_scaled, y_train, 
                               X_test_scaled, y_test, feature_names, best_name)
    
    # Plot confusion matrix
    plot_confusion_matrix(np.array(metrics['confusion_matrix']), best_name)
    
    # Plot model comparison
    plot_model_comparison(df_results)
    
    # Save everything
    save_model(best_model, scaler, metrics, feature_names, best_name, df_results)
    
    print("\n" + "✅"*30)
    print(" "*8 + "🎉 TRAINING COMPLETE! 🎉")
    print("✅"*30 + "\n")
    
    print("🏆 BEST MODEL SELECTED:")
    print(f"   Model:     {best_name}")
    print(f"   Accuracy:  {metrics['test_accuracy']*100:.2f}%")
    print(f"   F1 Score:  {metrics['f1_score']*100:.2f}%")
    
    print("\n📁 Generated Files:")
    print("   - models/trained/exoplanet_model.pkl")
    print("   - models/trained/scaler.pkl")
    print("   - models/trained/model_metadata.json")
    print("   - models/trained/confusion_matrix.png")
    print("   - models/trained/model_comparison.png")


if __name__ == "__main__":
    main()