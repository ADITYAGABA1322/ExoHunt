"""
ExoHunt Multi-Dataset Pipeline
Downloads Kepler, K2, and TESS data for ultimate accuracy
"""

import pandas as pd
import requests
from io import StringIO
from pathlib import Path
import warnings
warnings.filterwarnings('ignore')

# NASA Dataset URLs
KEPLER_URL = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+*+from+cumulative&format=csv"
K2_URL = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+*+from+k2pandc&format=csv"
TESS_URL = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+*+from+TOI&format=csv"


def download_dataset(url, name):
    """Download dataset from NASA"""
    print(f"\n📡 Downloading {name} dataset...")
    
    try:
        response = requests.get(url, verify=False, timeout=60)
        response.raise_for_status()
        df = pd.read_csv(StringIO(response.text))
        
        # Save raw data
        raw_path = Path(f'data/raw/{name.lower()}_raw.csv')
        raw_path.parent.mkdir(parents=True, exist_ok=True)
        df.to_csv(raw_path, index=False)
        
        print(f"✅ Downloaded {len(df)} {name} objects")
        print(f"📊 Columns: {df.shape[1]}")
        
        return df
    except Exception as e:
        print(f"❌ Failed to download {name}: {str(e)}")
        return None


def unify_datasets(kepler_df, k2_df, tess_df):
    """
    Unify all datasets into one master dataset
    Based on NASA research: combining datasets improves accuracy
    """
    print("\n🔗 Unifying datasets...")
    
    # Common features across all datasets (focusing on transit parameters)
    common_features = {
        # Kepler column names
        'kepler': {
            'period': 'koi_period',
            'duration': 'koi_duration', 
            'depth': 'koi_depth',
            'prad': 'koi_prad',
            'teq': 'koi_teq',
            'insol': 'koi_insol',
            'steff': 'koi_steff',
            'slogg': 'koi_slogg',
            'srad': 'koi_srad',
            'disposition': 'koi_disposition'
        },
        # K2 column names (similar to Kepler)
        'k2': {
            'period': 'pl_orbper',  # Orbital period
            'duration': 'pl_trandur',  # Transit duration
            'depth': 'pl_trandep',  # Transit depth
            'prad': 'pl_rade',  # Planet radius
            'teq': 'pl_eqt',  # Equilibrium temp
            'insol': 'pl_insol',  # Insolation
            'steff': 'st_teff',  # Stellar temp
            'slogg': 'st_logg',  # Stellar gravity
            'srad': 'st_rad',  # Stellar radius
            'disposition': 'pl_def_refname'  # Disposition
        },
        # TESS column names
        'tess': {
            'period': 'pl_orbper',
            'duration': 'pl_trandur',
            'depth': 'pl_trandep',
            'prad': 'pl_rade',
            'teq': 'pl_eqt',
            'insol': 'pl_insol',
            'steff': 'st_teff',
            'slogg': 'st_logg',
            'srad': 'st_rad',
            'disposition': 'tfopwg_disp'
        }
    }
    
    # Process each dataset
    datasets = []
    
    # Kepler
    if kepler_df is not None and not kepler_df.empty:
        kepler_clean = process_kepler(kepler_df, common_features['kepler'])
        kepler_clean['source'] = 'Kepler'
        datasets.append(kepler_clean)
        print(f"   ✅ Kepler: {len(kepler_clean)} samples")
    
    # K2
    if k2_df is not None and not k2_df.empty:
        k2_clean = process_k2(k2_df, common_features['k2'])
        k2_clean['source'] = 'K2'
        datasets.append(k2_clean)
        print(f"   ✅ K2: {len(k2_clean)} samples")
    
    # TESS
    if tess_df is not None and not tess_df.empty:
        tess_clean = process_tess(tess_df, common_features['tess'])
        tess_clean['source'] = 'TESS'
        datasets.append(tess_clean)
        print(f"   ✅ TESS: {len(tess_clean)} samples")
    
    # Combine all datasets
    if datasets:
        unified_df = pd.concat(datasets, ignore_index=True)
        print(f"\n🎉 Total unified samples: {len(unified_df)}")
        return unified_df
    else:
        print("❌ No datasets available to unify")
        return pd.DataFrame()


def process_kepler(df, col_map):
    """Process Kepler dataset"""
    # Select columns
    selected_cols = [v for v in col_map.values() if v in df.columns]
    df_clean = df[selected_cols].copy()
    
    # Rename to standard names
    rename_map = {v: k for k, v in col_map.items() if v in df.columns}
    df_clean = df_clean.rename(columns=rename_map)
    
    # Binary classification
    df_clean['is_exoplanet'] = (df_clean['disposition'] == 'CONFIRMED').astype(int)
    
    # Remove missing values
    df_clean = df_clean.dropna()
    
    return df_clean


def process_k2(df, col_map):
    """Process K2 dataset"""
    # Select available columns
    selected_cols = [v for v in col_map.values() if v in df.columns]
    df_clean = df[selected_cols].copy()
    
    # Rename
    rename_map = {v: k for k, v in col_map.items() if v in df.columns}
    df_clean = df_clean.rename(columns=rename_map)
    
    # Binary classification (confirmed planets)
    df_clean['is_exoplanet'] = 1  # K2 mostly has confirmed planets
    
    # Remove missing
    df_clean = df_clean.dropna()
    
    return df_clean


def process_tess(df, col_map):
    """Process TESS dataset"""
    # Select columns
    selected_cols = [v for v in col_map.values() if v in df.columns]
    df_clean = df[selected_cols].copy()
    
    # Rename
    rename_map = {v: k for k, v in col_map.items() if v in df.columns}
    df_clean = df_clean.rename(columns=rename_map)
    
    # Binary classification
    if 'disposition' in df_clean.columns:
        df_clean['is_exoplanet'] = df_clean['disposition'].str.contains('PC|CP', case=False, na=False).astype(int)
    
    # Remove missing
    df_clean = df_clean.dropna()
    
    return df_clean


def create_advanced_features(df):
    """
    Create advanced features based on NASA research papers
    Feature engineering can improve accuracy by 10-15%
    """
    print("\n🔬 Creating advanced features...")
    
    # Physics-based features
    df['transit_depth_ratio'] = df['depth'] / df['prad']
    df['stellar_density'] = 10**df['slogg'] / df['srad']**2
    df['planet_density'] = df['prad']**3 / df['period']**2
    df['irradiation_ratio'] = df['insol'] / df['teq']
    df['semi_major_axis'] = (df['period'] * df['srad'])**(1/3)
    
    # Statistical features
    df['temp_ratio'] = df['teq'] / df['steff']
    df['radius_ratio'] = df['prad'] / df['srad']
    df['log_period'] = np.log10(df['period'])
    df['log_insol'] = np.log10(df['insol'] + 1)
    
    print(f"✅ Created {9} advanced features")
    
    return df


def main():
    """Main multi-dataset pipeline"""
    print("\n" + "🚀"*30)
    print(" "*8 + "EXOHUNT MULTI-DATASET PIPELINE")
    print("🚀"*30 + "\n")
    
    # Download all datasets
    kepler_df = download_dataset(KEPLER_URL, "Kepler")
    k2_df = download_dataset(K2_URL, "K2")
    tess_df = download_dataset(TESS_URL, "TESS")
    
    # Unify datasets
    unified_df = unify_datasets(kepler_df, k2_df, tess_df)
    
    if unified_df.empty:
        print("❌ No data to process")
        return
    
    # Create advanced features
    unified_df = create_advanced_features(unified_df)
    
    # Remove outliers (IQR method)
    print("\n🔬 Removing outliers...")
    feature_cols = [c for c in unified_df.columns if c not in ['is_exoplanet', 'source', 'disposition']]
    
    for col in feature_cols:
        Q1 = unified_df[col].quantile(0.01)
        Q3 = unified_df[col].quantile(0.99)
        IQR = Q3 - Q1
        lower = Q1 - 1.5 * IQR
        upper = Q3 + 1.5 * IQR
        
        before = len(unified_df)
        unified_df = unified_df[(unified_df[col] >= lower) & (unified_df[col] <= upper)]
        removed = before - len(unified_df)
        if removed > 0:
            print(f"   {col}: removed {removed} outliers")
    
    # Save unified dataset
    output_path = Path('data/processed/unified_exoplanets.csv')
    output_path.parent.mkdir(parents=True, exist_ok=True)
    unified_df.to_csv(output_path, index=False)
    
    print(f"\n✅ Final unified dataset: {len(unified_df)} samples")
    print(f"   - Exoplanets: {unified_df['is_exoplanet'].sum()}")
    print(f"   - Non-Exoplanets: {len(unified_df) - unified_df['is_exoplanet'].sum()}")
    print(f"💾 Saved to: {output_path}")
    
    print("\n" + "✅"*30)
    print(" "*5 + "MULTI-DATASET PIPELINE COMPLETE!")
    print("✅"*30)


if __name__ == "__main__":
    import numpy as np
    main()