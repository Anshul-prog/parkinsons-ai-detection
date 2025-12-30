from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)



model = joblib.load("model/parkinson_model.pkl")

class PatientData(BaseModel):
    features: list

@app.post("/predict")
async def predict(data: PatientData):
    features = np.array(data.features).reshape(1, -1)
    prediction = model.predict(features)[0]
    confidence = float(max(model.predict_proba(features)[0]))
    return {"prediction": int(prediction), "confidence": confidence}