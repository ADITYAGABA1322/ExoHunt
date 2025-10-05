"""
ExoHunt ADVANCED ML Training Pipeline
- Multi-dataset fusion (Kepler + K2 + TESS)
- SMOTE for class imbalance
- Bayesian hyperparameter optimization
- Advanced ensemble stacking
- Target: 90%+ accuracy
"""

import pandas as pd
import numpy as np
from pathlib import Path
import warnings
warnings.filterwarnings('ignore')

# ML Core
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.preprocessing import StandardScaler, RobustScaler
from sklearn.metrics import (
    classification_report, confusion_matrix, accuracy_score,
    precision_score, recall_score, f1_score, roc_auc_score, roc_curve
)

# Algorithms
from sklearn.ensemble import (
    RandomForestClassifier, GradientBoostingClassifier,
    ExtraTreesClassifier, StackingClassifier, VotingClassifier
)
from xgboost import XGBClassifier
from lightgbm import LGBMClassifier
from catboost import CatBoostClassifier

# Advanced techniques
from imblearn.over_sampling import SMOTE, ADASYN
from imblearn.combine import SMOTETomek
from sklearn.feature_selection import SelectKBest, mutual_info_classif
from skopt import BayesSearchCV
from skopt.space import Real, Integer, Categorical

import joblib
import json
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime


class AdvancedExoplanetTrainer:
    """Advanced ML trainer with all optimizations"""
    
    def __init__(self):
        self.scaler = RobustScaler()  # Better for outliers than StandardScaler
        self.best_model = None
        self.feature_names = None
        self.metrics = {}
        
    def load_unified_data(self):
        """Load unified multi-dataset"""
        print("\n" + "📂"*30)
        print(" "*5 + "LOADING UNIFIED MULTI-DATASET")
        print("📂"*30 + "\n")
        
        # Try unified dataset first
        unified_path = Path('data/processed/unified_exoplanets.csv')
        
        if unified_path.exists():
            print("✅ Loading unified dataset (Kepler + K2 + TESS)...")
            df = pd.read_csv(unified_path)
            print(f"   Total samples: {len(df)}")
        else:
            print("⚠️  Unified dataset not found, loading Kepler only...")
            df = pd.read_csv('data/processed/kepler_processed.csv')
            print(f"   Kepler samples: {len(df)}")
        
        print(f"   - Exoplanets: {df['is_exoplanet'].sum()}")
        print(f"   - Non-Exoplanets: {len(df) - df['is_exoplanet'].sum()}")
        print(f"   - Class ratio: {(df['is_exoplanet'].sum() / len(df) * 100):.2f}% exoplanets")
        
        return df
    
    def engineer_advanced_features(self, df):
        """Create advanced physics-based features"""
        print("\n🔬 Engineering advanced features...")
        
        base_features = [
            'period', 'duration', 'depth', 'prad', 
            'teq', 'insol', 'steff', 'slogg', 'srad'
        ]
        
        # Map column names (handle both unified and Kepler-only format)
        col_map = {}
        for feat in base_features:
            # Try unified format first
            if feat in df.columns:
                col_map[feat] = feat
            # Try Kepler format
            elif f'koi_{feat}' in df.columns:
                col_map[feat] = f'koi_{feat}'
        
        print(f"   Found {len(col_map)} base features")
        
        # Create feature DataFrame
        X = pd.DataFrame()
        
        # Add base features
        for feat_name, col_name in col_map.items():
            X[feat_name] = df[col_name]
        
        # Physics-based derived features
        print("   Creating physics-based features...")
        
        # Transit geometry
        X['transit_depth_ratio'] = X['depth'] / (X['prad']**2 + 1e-10)
        X['duration_period_ratio'] = X['duration'] / (X['period'] + 1e-10)
        
        # Stellar characteristics
        X['stellar_density'] = 10**X['slogg'] / (X['srad']**2 + 1e-10)
        X['stellar_luminosity'] = (X['srad']**2) * (X['steff']**4)
        
        # Planet characteristics
        X['planet_density'] = (X['prad']**3) / (X['period']**2 + 1e-10)
        X['equilibrium_temp_ratio'] = X['teq'] / (X['steff'] + 1e-10)
        X['irradiation_ratio'] = X['insol'] / (X['teq'] + 1e-10)
        
        # Orbital mechanics
        X['semi_major_axis'] = ((X['period'] / 365.25)**2 * X['srad'])**(1/3)
        X['orbital_velocity'] = (2 * np.pi * X['semi_major_axis']) / (X['period'] + 1e-10)
        
        # Habitability indicators
        X['habitable_zone_distance'] = X['semi_major_axis'] / (np.sqrt(X['insol']) + 1e-10)
        X['surface_gravity'] = X['slogg'] * (X['prad']**2)
        
        # Statistical transformations
        X['log_period'] = np.log10(X['period'] + 1)
        X['log_insol'] = np.log10(X['insol'] + 1)
        X['log_depth'] = np.log10(X['depth'] + 1)
        X['sqrt_prad'] = np.sqrt(X['prad'])
        
        # Interaction features (most predictive combinations)
        X['prad_teq_interaction'] = X['prad'] * X['teq']
        X['period_depth_interaction'] = X['period'] * X['depth']
        X['insol_steff_interaction'] = X['insol'] * X['steff']
        
        # Polynomial features (carefully selected)
        X['period_squared'] = X['period']**2
        X['prad_squared'] = X['prad']**2
        X['depth_squared'] = X['depth']**2
        
        print(f"   ✅ Created {X.shape[1]} total features")
        
        return X
    
    def handle_class_imbalance(self, X, y):
        """Apply SMOTE to balance classes"""
        print("\n⚖️  Handling class imbalance with SMOTE...")
        
        print(f"   Before SMOTE:")
        print(f"      - Exoplanets: {np.sum(y)}")
        print(f"      - Non-Exoplanets: {len(y) - np.sum(y)}")
        print(f"      - Ratio: {np.sum(y) / len(y) * 100:.2f}%")
        
        # Use SMOTETomek for better results (SMOTE + Tomek links)
        smote_tomek = SMOTETomek(random_state=42, n_jobs=-1)
        X_balanced, y_balanced = smote_tomek.fit_resample(X, y)
        
        print(f"   After SMOTE-Tomek:")
        print(f"      - Exoplanets: {np.sum(y_balanced)}")
        print(f"      - Non-Exoplanets: {len(y_balanced) - np.sum(y_balanced)}")
        print(f"      - Ratio: {np.sum(y_balanced) / len(y_balanced) * 100:.2f}%")
        
        return X_balanced, y_balanced
    
    def feature_selection(self, X, y, k=30):
        """Select top K most informative features"""
        print(f"\n🎯 Selecting top {k} features...")
        
        selector = SelectKBest(mutual_info_classif, k=min(k, X.shape[1]))
        X_selected = selector.fit_transform(X, y)
        
        # Get selected feature names
        feature_mask = selector.get_support()
        selected_features = X.columns[feature_mask].tolist()
        
        print(f"   ✅ Selected features: {len(selected_features)}")
        print(f"   Top 10: {selected_features[:10]}")
        
        return X_selected, selected_features
    
    def bayesian_optimize_xgboost(self, X, y):
        """Bayesian optimization for XGBoost"""
        print("\n🔮 Bayesian optimization for XGBoost...")
        
        param_space = {
            'n_estimators': Integer(200, 1000),
            'max_depth': Integer(5, 15),
            'learning_rate': Real(0.01, 0.3, prior='log-uniform'),
            'subsample': Real(0.6, 1.0),
            'colsample_bytree': Real(0.6, 1.0),
            'min_child_weight': Integer(1, 10),
            'gamma': Real(0, 5)
        }
        
        xgb_model = XGBClassifier(
            random_state=42,
            n_jobs=-1,
            eval_metric='logloss'
        )
        
        bayes_search = BayesSearchCV(
            xgb_model,
            param_space,
            n_iter=30,  # Number of parameter settings to sample
            cv=5,
            scoring='f1',
            n_jobs=-1,
            random_state=42,
            verbose=0
        )
        
        bayes_search.fit(X, y)
        
        print(f"   ✅ Best F1 score: {bayes_search.best_score_:.4f}")
        print(f"   Best params: {bayes_search.best_params_}")
        
        return bayes_search.best_estimator_
    
    def create_stacking_ensemble(self, X, y):
        """Create advanced stacking ensemble"""
        print("\n🏗️  Building stacking ensemble...")
        
        # Base models (diverse set)
        base_models = [
            ('rf', RandomForestClassifier(
                n_estimators=500,
                max_depth=25,
                min_samples_split=5,
                min_samples_leaf=2,
                max_features='sqrt',
                random_state=42,
                n_jobs=-1,
                class_weight='balanced'
            )),
            
            ('xgb', XGBClassifier(
                n_estimators=500,
                max_depth=10,
                learning_rate=0.05,
                subsample=0.8,
                colsample_bytree=0.8,
                min_child_weight=3,
                gamma=0.1,
                random_state=42,
                n_jobs=-1,
                eval_metric='logloss'
            )),
            
            ('lgbm', LGBMClassifier(
                n_estimators=500,
                max_depth=15,
                learning_rate=0.05,
                num_leaves=50,
                min_child_samples=20,
                random_state=42,
                n_jobs=-1,
                verbose=-1
            )),
            
            ('catboost', CatBoostClassifier(
                iterations=500,
                depth=10,
                learning_rate=0.05,
                random_state=42,
                verbose=0
            )),
            
            ('extra', ExtraTreesClassifier(
                n_estimators=500,
                max_depth=25,
                min_samples_split=5,
                random_state=42,
                n_jobs=-1,
                class_weight='balanced'
            ))
        ]
        
        # Meta-model (Gradient Boosting)
        meta_model = GradientBoostingClassifier(
            n_estimators=200,
            max_depth=5,
            learning_rate=0.05,
            random_state=42
        )
        
        # Create stacking classifier
        stacking = StackingClassifier(
            estimators=base_models,
            final_estimator=meta_model,
            cv=5,
            n_jobs=-1
        )
        
        print("   Base models:")
        for name, _ in base_models:
            print(f"      - {name}")
        print(f"   Meta-model: {type(meta_model).__name__}")
        
        return stacking
    
    def train_and_evaluate(self, df):
        """Main training pipeline"""
        print("\n" + "🔥"*30)
        print(" "*5 + "ADVANCED TRAINING PIPELINE")
        print("🔥"*30)
        
        # Engineer features
        X = self.engineer_advanced_features(df)
        y = df['is_exoplanet'].values
        
        # Handle imbalance
        X_balanced, y_balanced = self.handle_class_imbalance(X, y)
        
        # Feature selection
        X_selected, self.feature_names = self.feature_selection(
            pd.DataFrame(X_balanced, columns=X.columns), 
            y_balanced, 
            k=35
        )
        
        # Split data
        print("\n✂️  Splitting data (80% train, 20% test)...")
        X_train, X_test, y_train, y_test = train_test_split(
            X_selected, y_balanced, 
            test_size=0.2, 
            random_state=42, 
            stratify=y_balanced
        )
        
        # Scale features
        print("\n📏 Scaling features with RobustScaler...")
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train stacking ensemble
        print("\n🤖 Training Stacking Ensemble...")
        stacking_model = self.create_stacking_ensemble(X_train_scaled, y_train)
        stacking_model.fit(X_train_scaled, y_train)
        
        # Evaluate
        y_pred = stacking_model.predict(X_test_scaled)
        y_proba = stacking_model.predict_proba(X_test_scaled)[:, 1]
        
        # Calculate metrics
        self.metrics = {
            'accuracy': accuracy_score(y_test, y_pred),
            'precision': precision_score(y_test, y_pred),
            'recall': recall_score(y_test, y_pred),
            'f1_score': f1_score(y_test, y_pred),
            'roc_auc': roc_auc_score(y_test, y_proba)
        }
        
        # Cross-validation
        print("\n🔄 Performing 10-fold cross-validation...")
        cv_scores = cross_val_score(
            stacking_model, X_train_scaled, y_train,
            cv=10, scoring='f1', n_jobs=-1
        )
        self.metrics['cv_mean'] = cv_scores.mean()
        self.metrics['cv_std'] = cv_scores.std()
        
        # Print results
        print("\n" + "🏆"*30)
        print(" "*8 + "FINAL RESULTS")
        print("🏆"*30 + "\n")
        
        print(f"   Accuracy:  {self.metrics['accuracy']*100:.2f}%")
        print(f"   Precision: {self.metrics['precision']*100:.2f}%")
        print(f"   Recall:    {self.metrics['recall']*100:.2f}%")
        print(f"   F1 Score:  {self.metrics['f1_score']*100:.2f}%")
        print(f"   ROC-AUC:   {self.metrics['roc_auc']*100:.2f}%")
        print(f"   CV F1:     {self.metrics['cv_mean']*100:.2f}% (+/- {self.metrics['cv_std']*2*100:.2f}%)")
        
        # Confusion matrix
        cm = confusion_matrix(y_test, y_pred)
        print(f"\n📊 Confusion Matrix:")
        print(f"   TN: {cm[0,0]:>5} | FP: {cm[0,1]:>5}")
        print(f"   FN: {cm[1,0]:>5} | TP: {cm[1,1]:>5}")
        
        self.best_model = stacking_model
        
        return X_test_scaled, y_test, y_pred, y_proba, cm
    
    def save_model(self):
        """Save the trained model"""
        print("\n💾 Saving model...")
        
        models_dir = Path('models/trained')
        models_dir.mkdir(parents=True, exist_ok=True)
        
        # Save model
        joblib.dump(self.best_model, models_dir / 'exoplanet_model_advanced.pkl')
        joblib.dump(self.scaler, models_dir / 'scaler_advanced.pkl')
        
        # Save metadata
        metadata = {
            'model_type': 'StackingClassifier',
            'feature_names': self.feature_names,
            'metrics': {k: float(v) for k, v in self.metrics.items()},
            'training_date': datetime.now().isoformat(),
            'notes': 'Advanced model with SMOTE, feature engineering, and stacking'
        }
        
        with open(models_dir / 'model_metadata_advanced.json', 'w') as f:
            json.dump(metadata, f, indent=2)
        
        print("   ✅ Model saved successfully")


def main():
    """Run advanced training"""
    print("\n" + "🚀"*30)
    print(" "*3 + "EXOHUNT ADVANCED ML TRAINING")
    print("🚀"*30)
    
    trainer = AdvancedExoplanetTrainer()
    
    # Load data
    df = trainer.load_unified_data()
    
    # Train and evaluate
    trainer.train_and_evaluate(df)
    
    # Save model
    trainer.save_model()
    
    print("\n" + "✅"*30)
    print(" "*10 + "🎉 COMPLETE! 🎉")
    print("✅"*30)


if __name__ == "__main__":
    main()