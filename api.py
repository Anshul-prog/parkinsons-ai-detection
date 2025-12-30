from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)
@app.options("/{rest_of_path:path}")
async def preflight_handler(rest_of_path: str):
    return {}



model = joblib.load("model/parkinson_model.pkl")

class PatientData(BaseModel):
    features: list

@app.post("/predict")
def predict(data: PatientData):
    arr = np.array(data.features).reshape(1, -1)
    prediction = int(model.predict(arr)[0])
    probability = float(model.predict_proba(arr)[0][1])
    return {"prediction": prediction, "confidence": probability}
