python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt


2. Train model (creates `models/price_model.joblib` and artifacts):

```bash
python train_model.py --data data/sri_lanka_crop_prices.csv --out models/price_model.joblib
```

3. Run Flask API:

```bash
python app.py
```