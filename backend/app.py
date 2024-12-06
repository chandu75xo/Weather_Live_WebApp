from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.svm import SVR
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.preprocessing import StandardScaler

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

# Load dataset
data = pd.read_csv('data/weather_data2.csv')

# Prepare the feature columns and target variable
X = data[['MaxT', 'MinT', 'RH1', 'RH2', 'Wind']]
y = data['MaxT']  # Target is Maximum Temperature

# Train-Test Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Initialize and scale data
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train models with scaled data
linear_model = LinearRegression()
linear_model.fit(X_train_scaled, y_train)

tree_model = DecisionTreeRegressor(random_state=42)
tree_model.fit(X_train_scaled, y_train)

forest_model = RandomForestRegressor(random_state=42, n_estimators=100)
forest_model.fit(X_train_scaled, y_train)

svr_model = SVR(kernel='rbf')
svr_model.fit(X_train_scaled, y_train)

# Define models dictionary
models = {
    "Linear Regression": linear_model,
    "Decision Tree": tree_model,
    "Random Forest": forest_model,
    "Support Vector Regressor": svr_model
}

# Calculate Mean Squared Error and R² scores for all models
model_errors = {
    name: mean_squared_error(y_test, model.predict(X_test_scaled))
    for name, model in models.items()
}

model_accuracies = {
    name: r2_score(y_test, model.predict(X_test_scaled)) * 100  # Convert R² to percentage
    for name, model in models.items()
}

# Select the best model based on the lowest MSE
best_model_name = min(model_errors, key=model_errors.get)
best_model = models[best_model_name]

print(f"Best Model: {best_model_name} with MSE: {model_errors[best_model_name]}")

# Define prediction endpoint
@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        # Parse incoming JSON request
        data = request.json
        if 'features' not in data:
            return jsonify({"error": "Missing 'features' in request"}), 400
        
        features = data['features']
        if len(features) != 5:
            return jsonify({"error": f"Expected 5 features, got {len(features)}"}), 400

        # Convert features to DataFrame with column names
        feature_df = pd.DataFrame([features], columns=['MaxT', 'MinT', 'RH1', 'RH2', 'Wind'])
        
        # Scale the input features using the same scaler used for training
        feature_df_scaled = scaler.transform(feature_df)

        # Predict using the best model
        prediction = best_model.predict(feature_df_scaled)
        
        # Prepare predictions from all models
        predictions = {model_name: model.predict(feature_df_scaled)[0]
                       for model_name, model in models.items()}

        return jsonify({
            "temperature": prediction[0],
            "model_used": best_model_name,
            "model_accuracies": model_accuracies,
            "model_errors": model_errors,
            "predictions_from_all_models": predictions
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
