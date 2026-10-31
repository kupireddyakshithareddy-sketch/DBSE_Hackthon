from fastapi import FastAPI
app = FastAPI(title="Vehicle Maintenance Prediction API")

@app.get("/")
def home():
    return {"message": "Vehicle maintenance prediction API starter is ready"}
