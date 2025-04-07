document.addEventListener('DOMContentLoaded', function() {
    // Example product data (replace with actual data from your backend or API)
    const products = [
        {
            name: 'Wheat',
            price: 20,
            quantity: 50,
            description: 'High-quality wheat with excellent yield.',
            imageUrl: 'path-to-wheat-image.jpg'
        },
        {
            name: 'Rice',
            price: 15,
            quantity: 30,
            description: 'Premium rice, suitable for all dishes.',
            imageUrl: 'path-to-rice-image.jpg'
        }
        // Add more products as needed
    ];

    const productListings = document.getElementById('product-listings');

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product-item';
        
        productDiv.innerHTML = `
            <h3>${product.name}</h3>
            <img src="${product.imageUrl}" alt="${product.name}" class="product-image">
            <p><strong>Price:</strong> $${product.price}</p>
            <p><strong>Quantity Available:</strong> ${product.quantity}</p>
            <p><strong>Description:</strong> ${product.description}</p>
            <button class="add-button" data-product-name="${product.name}">Add To Cart</button>
        `;

        productListings.appendChild(productDiv);
    });

    // Handle purchase button click
    productListings.addEventListener('click', function(event) {
        if (event.target && event.target.classList.contains('add-button')) {
            const productName = event.target.getAttribute('data-product-name');
            alert(`You have selected to add ${productName}. Item added to cart.`);
            // Add further functionality to handle purchasing and payment
        }
    });
});
