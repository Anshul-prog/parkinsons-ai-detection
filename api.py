from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow from anywhere
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


model = joblib.load("model/parkinson_model.pkl")

class PatientData(BaseModel):
    features: list

@app.post("/predict")
def predict(data: PatientData):
    arr = np.array(data.features).reshape(1, -1)
    prediction = int(model.predict(arr)[0])
    probability = float(model.predict_proba(arr)[0][1])
    return {"prediction": prediction, "confidence": probability}
