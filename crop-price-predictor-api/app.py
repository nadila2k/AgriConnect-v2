from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load model artifacts
art = joblib.load("models/price_model.joblib")
model = art['model']
feature_cols = art['feature_cols']
product_list = art['product_categories']
target_cols = art['target_cols']
history_df = art['history']

# Same function from training
def create_features(df):
    df = df.copy()
    df['date'] = pd.to_datetime(df['date'], errors='coerce')
    df = df.sort_values('date')
    df['year'] = df['date'].dt.year
    df['month'] = df['date'].dt.month
    df['day'] = df['date'].dt.day
    df['weekday'] = df['date'].dt.weekday
    df['product_cat'] = df['productname'].astype('category').cat.codes
    out = []
    for crop, g in df.groupby('productname'):
        g = g.sort_values('date')
        for lag in [1, 2, 3, 6, 12]:
            g[f'farmprice_lag_{lag}'] = g['farmprice'].shift(lag)
        for window in [3, 6, 12]:
            g[f'farmprice_roll_mean_{window}'] = g['farmprice'].rolling(window).mean()
        out.append(g)
    df = pd.concat(out).sort_values(['productname', 'date']).reset_index(drop=True)
    df = df.fillna(method='ffill').fillna(method='bfill')
    df = df.fillna(df.median(numeric_only=True))
    return df

def make_features(productname, date_str):
    df = history_df[history_df['productname'] == productname].copy()
    df['date'] = pd.to_datetime(df['date'])
    future_row = pd.DataFrame({
        'productname': [productname],
        'date': [pd.to_datetime(date_str)],
        'farmprice': [None],
        'retailpricepettah': [None],
        'retailpricedambulla': [None],
        'averagespread': [None]
    })
    df = pd.concat([df, future_row], ignore_index=True)
    df = create_features(df)
    return df[df['date'] == pd.to_datetime(date_str)][feature_cols]

@app.route('/predict', methods=['POST'])
def predict():
    body = request.json
    product = body.get('product')
    date = body.get('date')
    if not product or not date:
        return jsonify({'error': 'product and date are required'}), 400
    if product not in product_list:
        return jsonify({'error': f'Product {product} not found'}), 400

    X = make_features(product, date)
    preds = model.predict(X)
    res = {col: float(preds[0, i]) for i, col in enumerate(target_cols)}
    return jsonify({'product': product, 'date': date, 'predictions': res})

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5003)
