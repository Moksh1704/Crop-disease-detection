document.addEventListener('DOMContentLoaded', function() {
    // Example cart data (replace with actual data from local storage or backend)
    const cart = [
        {
            name: 'Wheat',
            price: 20,
            quantity: 2,
            imageUrl: 'path-to-wheat-image.jpg'
        },
        {
            name: 'Rice',
            price: 15,
            quantity: 1,
            imageUrl: 'path-to-rice-image.jpg'
        }
        // Add more cart items as needed
    ];

    const cartItems = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');

    let totalPrice = 0;

    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';

        itemDiv.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p><strong>Price:</strong> $${item.price}</p>
                <p><strong>Quantity:</strong> <input type="number" value="${item.quantity}" class="quantity-input" data-price="${item.price}">
                </p>
                <p><strong>Subtotal:</strong> $<span class="item-subtotal">${(item.price * item.quantity).toFixed(2)}</span></p>
            </div>
        `;

        cartItems.appendChild(itemDiv);

        totalPrice += item.price * item.quantity;
    });

    totalPriceElement.textContent = totalPrice.toFixed(2);

    // Update total price and subtotals when quantity changes
    cartItems.addEventListener('input', function(event) {
        if (event.target.classList.contains('quantity-input')) {
            const quantity = parseInt(event.target.value, 10);
            const price = parseFloat(event.target.getAttribute('data-price'));
            const subtotal = (price * quantity).toFixed(2);

            event.target.closest('.cart-item').querySelector('.item-subtotal').textContent = subtotal;

            // Recalculate total price
            totalPrice = Array.from(document.querySelectorAll('.item-subtotal'))
                .reduce((sum, subtotal) => sum + parseFloat(subtotal.textContent), 0);

            totalPriceElement.textContent = totalPrice.toFixed(2);
        }
    });

    // Handle checkout button click
    document.getElementById('checkout-button').addEventListener('click', function() {
        alert('Proceeding to checkout.');
        // Add functionality to handle checkout process
    });
});
