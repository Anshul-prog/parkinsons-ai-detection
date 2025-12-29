import streamlit as st
import joblib
import pandas as pd

# Load trained model
model = joblib.load("model/parkinson_model.pkl")

st.set_page_config(page_title="Parkinson's Disease Detection", layout="centered")

st.title("🧠 Parkinson's Disease Detection System")
st.write("Enter the patient's clinical measurements below:")

# Create input fields
inputs = []

for feature in model.feature_names_in_:
    value = st.number_input(f"{feature}", format="%.5f")
    inputs.append(value)

# Predict button
if st.button("Predict"):
    prediction = model.predict([inputs])[0]
    probability = model.predict_proba([inputs])[0][1]

    if prediction == 1:
        st.error(f"⚠ Parkinson’s Detected (Confidence: {probability*100:.2f}%)")
    else:
        st.success(f"✅ No Parkinson’s Detected (Confidence: {(1-probability)*100:.2f}%)")
