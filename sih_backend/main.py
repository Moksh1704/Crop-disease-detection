from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from ml_prediction import MLPrediction, ResNet9

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ml_prediction = MLPrediction()


@app.get("/")
def root():
    return {"msg": "hello world"}


@app.post("/upload-image/")
def upload_image(file: UploadFile):
    # Read the image
    contents = file.file
    res = ml_prediction.final_prediction(contents)
    print(res)
    return res


# def find_matching_info(disease_prediction):
#     # Search for the matching disease in the dataset based on prediction
#     disease_info = df[df['Common name'].str.contains(disease_prediction, case=False, na=False)]

#     if not disease_info.empty:
#         # Retrieve all the fields from the matching row
#         info = {
#             "plant_or_crop_host": disease_info.iloc[0]['Plant or crop host'],
#             "common_name": disease_info.iloc[0]['Common name'],
#             "scientific_name": disease_info.iloc[0]['Scientific name'],
#             "type": disease_info.iloc[0]['Type'],
#             "symptoms": disease_info.iloc[0]['Symptoms'],
#             "conditions_favoring_disease": disease_info.iloc[0]['Conditions Favoring Disease'],
#             "prevention_and_management": disease_info.iloc[0]['Prevention and management']
#         }
#     else:
#         # In case no match is found, return a default response
#         info = {
#             "plant_or_crop_host": "Unknown",
#             "common_name": disease_prediction,
#             "scientific_name": "Not available",
#             "type": "Unknown",
#             "symptoms": "Not available",
#             "conditions_favoring_disease": "Not available",
#             "prevention_and_management": "Not available"
#         }

#     return info

if __name__ == "__main__":
    uvicorn.run(app, port=8000)
