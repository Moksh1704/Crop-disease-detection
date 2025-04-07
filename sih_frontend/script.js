
        const fileInput = document.getElementById('imageInput');
        const previewImage = document.getElementById('previewImage');
        const iconText = document.getElementById('iconText');
        const fileUploadLabel = document.getElementById('fileUploadLabel');

        fileInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImage.src = e.target.result; // Set the image source to the uploaded file
                    previewImage.style.display = 'block'; // Show the image
                    iconText.style.display = 'none'; // Hide the text and icon
                };
                reader.readAsDataURL(file); // Read the file as a data URL
            }
        });

        document.getElementById('uploadForm').addEventListener('submit', async (event) => {
            event.preventDefault();
            
            const file = fileInput.files[0];

            if (!file) {
                alert('Please select an image.');
                return;
            }

            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetch('http://localhost:8000/predict', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                console.log(result)

                if (response.ok) {
                    document.getElementById('result').innerText = `Prediction: ${result.disease}`;
                } else {
                    document.getElementById('result').innerText = `Error: ${result.detail}`;
                }
            } catch (error) {
                console.error('Error:', error);
                document.getElementById('result').innerText = 'An error occurred.';
            }
        });
    