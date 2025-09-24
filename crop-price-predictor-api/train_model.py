import argparse
import joblib
import pandas as pd
import optuna
from sklearn.model_selection import TimeSeriesSplit
from sklearn.metrics import mean_absolute_error
from xgboost import XGBRegressor
from sklearn.multioutput import MultiOutputRegressor

# ---------------------------
# Feature Engineering
# ---------------------------
def create_features(df):
    df = df.copy()
    df['date'] = pd.to_datetime(df['date'], errors='coerce')
    df = df.sort_values('date')

    # Calendar features
    df['year'] = df['date'].dt.year
    df['month'] = df['date'].dt.month
    df['day'] = df['date'].dt.day
    df['weekday'] = df['date'].dt.weekday

    # Encode product
    df['product_cat'] = df['productname'].astype('category').cat.codes

    # Lag + rolling
    out = []
    for crop, g in df.groupby('productname'):
        g = g.sort_values('date')
        for lag in [1, 2, 3, 6, 12]:
            g[f'farmprice_lag_{lag}'] = g['farmprice'].shift(lag)
        for window in [3, 6, 12]:
            g[f'farmprice_roll_mean_{window}'] = g['farmprice'].rolling(window).mean()
        out.append(g)
    df = pd.concat(out).sort_values(['productname', 'date']).reset_index(drop=True)

    # Fill missing
    df = df.fillna(method='ffill').fillna(method='bfill')
    df = df.fillna(df.median(numeric_only=True))
    return df

# ---------------------------
# Training with Optuna
# ---------------------------
def train(args):
    df = pd.read_csv(args.data)
    df = create_features(df)

    target_cols = ['farmprice', 'retailpricepettah', 'retailpricedambulla', 'averagespread']
    feature_cols = [c for c in df.columns if c not in ['productname', 'date'] + target_cols]

    X = df[feature_cols]
    y = df[target_cols]

    tscv = TimeSeriesSplit(n_splits=5)

    def objective(trial):
        params = {
            'n_estimators': trial.suggest_int('n_estimators', 300, 2000),
            'max_depth': trial.suggest_int('max_depth', 3, 12),
            'learning_rate': trial.suggest_float('learning_rate', 0.01, 0.3),
            'subsample': trial.suggest_float('subsample', 0.5, 1.0),
            'colsample_bytree': trial.suggest_float('colsample_bytree', 0.5, 1.0),
            'random_state': 42,
            'n_jobs': 4,
            'objective': 'reg:squarederror'
        }
        model = MultiOutputRegressor(XGBRegressor(**params))

        scores = []
        for train_idx, val_idx in tscv.split(X):
            model.fit(X.iloc[train_idx], y.iloc[train_idx])
            preds = model.predict(X.iloc[val_idx])
            scores.append(mean_absolute_error(y.iloc[val_idx], preds))
        return sum(scores) / len(scores)

    print("Tuning hyperparameters with Optuna...")
    study = optuna.create_study(direction="minimize")
    study.optimize(objective, n_trials=50)  # Increase trials for better results
    print("Best params:", study.best_params)

    # Train final model
    best_params = study.best_params
    final_model = MultiOutputRegressor(XGBRegressor(**best_params))
    final_model.fit(X, y)

    # Save model + metadata
    joblib.dump({
        'model': final_model,
        'feature_cols': feature_cols,
        'target_cols': target_cols,
        'product_categories': list(df['productname'].astype('category').cat.categories),
        'history': df[['productname', 'date'] + target_cols]  # Keep original prices for lag calc
    }, args.out)
    print("Model saved to", args.out)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", required=True)
    parser.add_argument("--out", required=True)
    args = parser.parse_args()
    train(args)
