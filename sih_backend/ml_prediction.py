import numpy as np
import torch  
from PIL import Image  
import torch.nn.functional as F  
import torchvision.transforms as transforms  
import torch
from PIL import Image
import torchvision.transforms as transforms
import pandas as pd
import torch.nn as nn  
import torch  
import torch.nn.functional as F  
import os

# Base class for the model
class ImageClassificationBase(nn.Module):

    def accuracy(outputs, labels):
        _, preds = torch.max(outputs, dim=1)
        return torch.tensor(torch.sum(preds == labels).item() / len(preds))

    def training_step(self, batch):
        images, labels = batch
        out = self(images)  # Generate predictions
        loss = F.cross_entropy(out, labels)  # Calculate loss
        return loss

    def validation_step(self, batch):
        images, labels = batch
        out = self(images)  # Generate prediction
        loss = F.cross_entropy(out, labels)  # Calculate loss
        acc = self.accuracy(out, labels)  # Calculate accuracy
        return {"val_loss": loss.detach(), "val_accuracy": acc}

    def validation_epoch_end(self, outputs):
        batch_losses = [x["val_loss"] for x in outputs]
        batch_accuracy = [x["val_accuracy"] for x in outputs]
        epoch_loss = torch.stack(batch_losses).mean()  # Combine loss
        epoch_accuracy = torch.stack(batch_accuracy).mean()
        return {
            "val_loss": epoch_loss,
            "val_accuracy": epoch_accuracy,
        }  # Combine accuracies

    def epoch_end(self, epoch, result):
        print(
            "Epoch [{}], last_lr: {:.5f}, train_loss: {:.4f}, val_loss: {:.4f}, val_acc: {:.4f}".format(
                epoch,
                result["lrs"][-1],
                result["train_loss"],
                result["val_loss"],
                result["val_accuracy"],
            )
        )


# Architecture for training
# convolution block with BatchNormalization
def ConvBlock(in_channels, out_channels, pool=False):
    layers = [
        nn.Conv2d(in_channels, out_channels, kernel_size=3, padding=1),
        nn.BatchNorm2d(out_channels),
        nn.ReLU(inplace=True),
    ]
    if pool:
        layers.append(nn.MaxPool2d(4))
    return nn.Sequential(*layers)


# resnet architecture
class ResNet9(ImageClassificationBase):
    def __init__(self, in_channels, num_diseases):
        super().__init__()

        self.conv1 = ConvBlock(in_channels, 64)
        self.conv2 = ConvBlock(64, 128, pool=True)  # out_dim : 128 x 64 x 64
        self.res1 = nn.Sequential(ConvBlock(128, 128), ConvBlock(128, 128))

        self.conv3 = ConvBlock(128, 256, pool=True)  # out_dim : 256 x 16 x 16
        self.conv4 = ConvBlock(256, 512, pool=True)  # out_dim : 512 x 4 x 44
        self.res2 = nn.Sequential(ConvBlock(512, 512), ConvBlock(512, 512))

        self.classifier = nn.Sequential(
            nn.MaxPool2d(4), nn.Flatten(), nn.Linear(512, num_diseases)
        )

    def forward(self, xb):  # xb is the loaded batch
        out = self.conv1(xb)
        out = self.conv2(out)
        out = self.res1(out) + out
        out = self.conv3(out)
        out = self.conv4(out)
        out = self.res2(out) + out
        out = self.classifier(out)
        return out


class MLPrediction:
    def __init__(self) -> None:
        self.disease_list = "./trained_diseases.csv"
        self.model_path = "./plant-disease-model-complete.pth"
        self.test_dir = "./final_test_plant_images/"
        self.load_defaults()

    def predict_image(self, img, model):
        """Converts image to array and return the predicted class
        with highest probability"""
        transform = transforms.ToTensor()
        image = Image.open(img)
        tensor = transform(image)
        # Convert to a batch of 1
        xb = self.to_device(tensor.unsqueeze(0))
        # Get predictions from model
        yb = model(xb)
        # Pick index with highest probability
        _, preds = torch.max(yb, dim=1)
        # Retrieve the class label
        return preds[0].item()

    def get_default_device(self):
        if torch.cuda.is_available:
            return torch.device("cuda")
        else:
            return torch.device("cpu")

    def to_device(self, data):
        device = self.get_default_device()
        if isinstance(data, (list, tuple)):
            return [self.to_device(x, device) for x in data]
        return data.to(device, non_blocking=True)

    def load_defaults(self):
        self.disease_df = pd.read_csv(self.disease_list)
        print("Total Diseases trained are " + str(self.disease_df.shape[0]))

        temp = ResNet9
        self.model = torch.load(self.model_path, weights_only=False) # ,map_location=torch.device('cpu')
        self.model.eval()

        # Enable this only for testing
        # test_images = sorted(
        #     [os.path.join(self.test_dir, i) for i in os.listdir(self.test_dir)]
        # )
        # for inp in test_images:
        #     given_input = inp.split("/")[-1]
        #     prediction = self.predict_image(inp, self.model)
        #     predicted_output = self.disease_df.iloc[prediction].to_list()
        #     return_dict = {"Input File": given_input, "Plant Name": predicted_output[0], "Disease Name": predicted_output[1]}
        #     print(return_dict)

    def final_prediction(self, inp):
        prediction = self.predict_image(img=inp, model=self.model)
        predicted_output = self.disease_df.iloc[prediction].to_list()

        return_dict = {
            "plant_or_crop_host": predicted_output[0],
            "common_name": predicted_output[1],
            "scientific_name": "Not available",
            "type": "Plant",
            "symptoms": "Not available",
            "conditions_favoring_disease": "Not available",
            "prevention_and_management": "Not available",
        }
        return return_dict


if __name__ == "__main__":
    ml_prediction = MLPrediction()
    ml_prediction.load_defaults()
