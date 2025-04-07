
document.addEventListener('DOMContentLoaded', function() {
    // Handle image upload or drag-and-drop
    document.getElementById('fileInput').addEventListener('change', handleImageUpload);
    document.getElementById('drag-and-drop').addEventListener('drop', handleImageDrop);
    document.getElementById('drag-and-drop').addEventListener('dragover', function (e) {
        e.preventDefault();
    });

    function handleImageUpload(event) {
        var file = event.target.files[0];
        processImage(file);
    }

    function handleImageDrop(event) {
        event.preventDefault();
        var file = event.dataTransfer.files[0];
        processImage(file);
    }

    function processImage(file) {
        // Simulate processing
        document.getElementById('processing-message').style.display = 'block';
        
        const formData = new FormData();
        formData.append("file", file);

        setTimeout(async function () {
            document.getElementById('processing-message').style.display = 'none';
            try {
                const response = await fetch("http://localhost:8000/upload-image/", {
                    method: "POST",
                    body: formData,
                    
                });
                console.log(response)
                if (response.ok) {
                    const result = await response.json();
                    displayDiagnosis(result);
                } else {
                    alert("Error: " + response.statusText);
                }
            } catch (error) {
                console.error("Error uploading the file:", error);
                // alert("There was an error uploading the image.");
                displayError()
            }

            // // Simulate identification success
            // var isIdentified = Math.random() > 0.5;

            // if (isIdentified) {
            //     displayDiagnosis("Leaf Spot", "Avoid excess watering", "NPK Fertilizers");
            // } else {
            //     displayError();
            // }
        }, 2000);
    }

    function displayDiagnosis(result) {
        document.getElementById('diagnosis-result').style.display = 'block';
        document.getElementById('plant_or_crop_host').textContent = result.plant_or_crop_host;
        document.getElementById('common_name').textContent = result.common_name;
        document.getElementById('scientific_name').textContent = result.scientific_name;
        document.getElementById('type').textContent = result.type;
        document.getElementById('symptoms').textContent = result.symptoms;
        document.getElementById('conditions_favoring_disease').textContent = result.conditions_favoring_disease;
        document.getElementById('prevention_and_management').textContent = result.prevention_and_management;
        document.getElementById('error-message').style.display = 'none';
    }

    function displayError() {
        document.getElementById('diagnosis-result').style.display = 'none';
        document.getElementById('error-message').style.display = 'block';
        document.getElementById('plant-selection').style.display = 'block';
    }

    function retryUpload() {
        document.getElementById('error-message').style.display = 'none';
        document.getElementById('diagnosis-result').style.display = 'none';
        document.getElementById('plant-selection').style.display = 'none';
    }

    // Form handling for plant selection
    document.getElementById('plant-form').addEventListener('submit', function (event) {
        event.preventDefault();
        alert("Form submitted. We will process your data.");
    });

    // Alternative form if user cannot upload an image
    document.getElementById('alternative-form').addEventListener('submit', function (event) {
        event.preventDefault();
        alert("Alternative details submitted. We will process your data.");
    });
});
