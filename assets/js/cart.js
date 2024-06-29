class ShoppingCart {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.cartItemsElement = document.getElementById('cart-items');
        this.cartTotalElement = document.getElementById('cart-total');
        this.checkoutButton = document.getElementById('checkout-btn');
        this.cartIconElement = document.querySelector('.cart-icon');
        this.updateCartDisplay();
    }

    addItem(id, name, price, image) {
        const existingItem = this.cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({ id, name, price: parseFloat(price), image, quantity: 1 });
        }
        this.saveCart();
        this.updateCartDisplay();
        
        alert(`${name} has been added to your cart!`);
    }

    removeItem(id) {
        this.cart = this.cart.filter(item => item.id !== id);
        this.saveCart();
        this.updateCartDisplay();
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    updateCartDisplay() {
        if (this.cartItemsElement) {
            this.cartItemsElement.innerHTML = '';
            let total = 0;

            this.cart.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item';
                itemElement.innerHTML = `
                  <img src="${item.image || 'placeholder.jpg'}" alt="${item.name || 'Unknown Item'}" class="cart-item-image">
                  <div class="cart-item-details">
                    <h3>${item.name || 'Unknown Item'}</h3>
                    <p>${(item.price || 0).toFixed(2)} x ${item.quantity || 0}</p>
                    <button class="remove-item" data-id="${item.id || ''}">Remove</button>
                  </div>
                `;
                this.cartItemsElement.appendChild(itemElement);
                total += (item.price || 0) * (item.quantity || 0);
              });

            if (this.cartTotalElement) {
                this.cartTotalElement.textContent = `Total: ₹${total.toFixed(2)}`;
            }
        }

        if (this.cartIconElement) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            this.cartIconElement.textContent = totalItems;
        }
    }

    addToCart(item) {
        if (item && item.name && item.price && item.quantity) {
          this.cart.push(item);
        } else {
          console.error('Invalid item:', item);
        }
      }

      loadCart() {
        const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        this.cart = savedCart.filter(item => item && item.name && item.price && item.quantity);
      }
    setupEventListeners() {
        if (this.cartItemsElement) {
            this.cartItemsElement.addEventListener('click', (e) => {
                if (e.target.classList.contains('remove-item')) {
                    const id = e.target.dataset.id;
                    this.removeItem(id);
                }
            });
        }

        if (this.checkoutButton) {
            this.checkoutButton.addEventListener('click', () => {
                alert('Thank you for your order!');
                sessionStorage.setItem('cartData', JSON.stringify(this.cart));
                this.cart = [];
                this.saveCart();
                this.updateCartDisplay();
                window.location.href = 'checkout.html';
            });
        }

        const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.removeEventListener('click', this.handleAddToCart);
    });
    // Add new event listeners
    addToCartButtons.forEach(button => {
        button.addEventListener('click', this.handleAddToCart.bind(this));
    });
}

// Separate method to handle "Add to Cart" clicks
handleAddToCart(e) {
    const { id, name, price, image } = e.target.dataset;
    this.addItem(id, name, price, image);
}
    }


document.addEventListener('DOMContentLoaded', () => {
    const shoppingCart = new ShoppingCart();
    shoppingCart.setupEventListeners();
});