
document.getElementById('listing-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get form data
    const productName = document.getElementById('product-name').value;
    const productPrice = document.getElementById('product-price').value;
    const productQuantity = document.getElementById('product-quantity').value;
    const productDescription = document.getElementById('product-description').value;
    const productImage = document.getElementById('product-image').files[0];

    // Example market trend data (replace with actual data from your backend or API)
    const marketTrends = {
        'Wheat': 'Stable demand with a steady price increase over the past year.',
        'Rice': 'High demand in local markets, price fluctuation based on seasonal factors.',
        'Corn': 'Growing demand with increasing competition from international markets.'
    };

    // Get the market trend for the entered product name
    const marketTrend = marketTrends[productName] || 'Market trend information not available for this product.';

    // Create a new product item
    const productDiv = document.createElement('div');
    productDiv.className = 'product-item';

    // Create a file reader to display the image
    const fileReader = new FileReader();
    fileReader.onload = function(e) {
        const imageUrl = e.target.result;

        productDiv.innerHTML = `
            <h3>${productName}</h3>
            <p><strong>Price:</strong> $${productPrice}</p>
            <p><strong>Quantity:</strong> ${productQuantity}</p>
            <p><strong>Description:</strong> ${productDescription}</p>
            <img src="${imageUrl}" alt="${productName}" class="product-image">
            <p><strong>Market Trend:</strong> ${marketTrend}</p>
        `;

        // Add the new product to the product results container
        document.getElementById('product-results').appendChild(productDiv);

        // Clear the form
        document.getElementById('listing-form').reset();
    };

    if (productImage) {
        fileReader.readAsDataURL(productImage);
    } else {
        // If no image is selected, just add the product without an image
        productDiv.innerHTML = `
            <h3>${productName}</h3>
            <p><strong>Price:</strong> $${productPrice}</p>
            <p><strong>Quantity:</strong> ${productQuantity}</p>
            <p><strong>Description:</strong> ${productDescription}</p>
            <p><strong>Market Trend:</strong> ${marketTrend}</p>
        `;

        // Add the new product to the product results container
        document.getElementById('product-results').appendChild(productDiv);

        // Clear the form
        document.getElementById('listing-form').reset();
    }
});
