const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');
const uploadedImageContainer = document.querySelector('.uploaded-image');
const uploadSection = document.getElementById('upload-section');
const resultSection = document.getElementById('result-section');

// Function to handle image processing
function processImage(file) {
    document.getElementById('processing-message').style.display = 'block';

    // Simulate processing time
    setTimeout(function () {
        document.getElementById('processing-message').style.display = 'none';

        const isIdentified = Math.random() > 0.5;

        if (isIdentified) {
            displayDiagnosis("Leaf Spot", "Avoid excess watering", "NPK Fertilizers");
        } else {
            displayError();
        }

        // Change layout after image upload
        adjustLayout();
    }, 2000);
}

// Function to display the diagnosis
function displayDiagnosis(disease, prevention, fertilizers) {
    document.getElementById('diagnosis-result').style.display = 'block';
    document.getElementById('disease-name').textContent = disease;
    document.getElementById('prevention').textContent = prevention;
    document.getElementById('fertilizers').textContent = fertilizers;
    document.getElementById('error-message').style.display = 'none';
}

// Function to display an error if identification fails
function displayError() {
    document.getElementById('diagnosis-result').style.display = 'none';
    document.getElementById('error-message').style.display = 'block';
}

// Function to shift the layout
function adjustLayout() {
    uploadSection.classList.remove('upload-center');
    uploadSection.classList.add('upload-left');
    resultSection.style.display = 'block';
}

// Handle file input selection
fileInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        displayUploadedImage(file);
        processImage(file);
    }
});

// Handle drag-and-drop functionality
dropZone.addEventListener('dragover', function (e) {
    e.preventDefault();
    dropZone.style.backgroundColor = '#e0f2e0';
});

dropZone.addEventListener('dragleave', function () {
    dropZone.style.backgroundColor = '#f0f7f0';
});

dropZone.addEventListener('drop', function (e) {
    e.preventDefault();
    dropZone.style.backgroundColor = '#f0f7f0';
    const file = e.dataTransfer.files[0];
    if (file) {
        displayUploadedImage(file);
        processImage(file);
    }
});

// Function to display uploaded image
function displayUploadedImage(file) {
    const reader = new FileReader();
    reader.onload = function (event) {
        const img = document.createElement('img');
        img.src = event.target.result;
        img.style.maxWidth = '100%';
        uploadedImageContainer.innerHTML = '';
        uploadedImageContainer.appendChild(img);
    };
    reader.readAsDataURL(file);
}
