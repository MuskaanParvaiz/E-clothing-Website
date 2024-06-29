// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('nav-links-show');
    });
  }
});

// Back to Top Button
const backToTopBtn = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 100) {
    backToTopBtn.style.display = 'block';
  } else {
    backToTopBtn.style.display = 'none';
  }
});

// Add to Cart Functionality
function initializeCart() {
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
      const item = button.closest('.shop-item') || button.closest('.top-item');
      const id = item.dataset.id;
      const name = item.querySelector('h3').textContent;
      const price = parseFloat(item.querySelector('.price').textContent.replace('$', ''));
      
      const cartItem = {
        id: id,
        name: name,
        price: price,
        quantity: 1
      };

      const existingItemIndex = cart.findIndex(item => item.id === id);

      if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += 1;
      } else {
        cart.push(cartItem);
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      alert(`${name} has been added to your cart!`);
    });
  });
}

// Display Cart Items
function displayCart() {
  const cartItemsContainer = document.querySelector('.cart-items');
  const cartTotal = document.getElementById('cart-total');
  
  if (cartItemsContainer && cartTotal) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let total = 0;

    cartItemsContainer.innerHTML = '';

    cart.forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.classList.add('cart-item');
      cartItem.innerHTML = `
        <h3>${item.name}</h3>
        <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
        <button class="remove-from-cart" data-id="${item.id}">Remove</button>
      `;
      cartItemsContainer.appendChild(cartItem);
      total += item.price * item.quantity;
    });

    cartTotal.textContent = total.toFixed(2);

    // Remove from Cart
    const removeFromCartButtons = document.querySelectorAll('.remove-from-cart');
    removeFromCartButtons.forEach(button => {
      button.addEventListener('click', () => {
        const id = button.dataset.id;
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const updatedCart = cart.filter(item => item.id !== id);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        displayCart();
      });
    });
  }
}

// Initialize cart functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeCart();
  displayCart();
});
//
document.addEventListener('DOMContentLoaded', function() {
  // Smooth scroll function
  function smoothScroll(target, duration) {
    var targetElement = document.querySelector(target);
    var targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
    var startPosition = window.pageYOffset;
    var distance = targetPosition - startPosition;
    var startTime = null;

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      var timeElapsed = currentTime - startTime;
      var run = ease(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
  }

  // Add click event listeners to Blog and Contact links
  var blogLink = document.querySelector('a[href="index.html#blog"]');
  var contactLink = document.querySelector('a[href="index.html#contact"]');

  if (blogLink) {
    blogLink.addEventListener('click', function(e) {
      if (window.location.pathname.includes('index.html')) {
        e.preventDefault();
        smoothScroll('#blog', 1000);
      }
    });
  }

  if (contactLink) {
    contactLink.addEventListener('click', function(e) {
      if (window.location.pathname.includes('index.html')) {
        e.preventDefault();
        smoothScroll('#contact', 1000);
      }
    });
  }
});

// Shopping cart array to store items
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to add item to cart
function addToCart(id, name, price) {
    let item = cart.find(item => item.id === id);
    if (item) {
        item.quantity++;
    } else {
        cart.push({id, name, price, quantity: 1});
    }
    updateCart();
}

// Function to update cart
function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartIcon();
}

// Function to update cart icon
function updateCartIcon() {
    let cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        let totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartIcon.textContent = totalItems;
    }
}

    updateCartIcon();

// Function to calculate total
function calculateTotal(cart) {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

// Function to apply discount
function applyDiscount(total) {
  const isFirstOrder = localStorage.getItem('firstOrder') !== 'false';
  if (isFirstOrder) {
      return total * 0.8; // 20% discount
  }
  return total;
}

// Function to update cart display
function updateCartDisplay() {
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const discountMessage = document.getElementById('discount-message');
  
  if (cartItems && cartTotal && discountMessage) {
      cartItems.innerHTML = '';
      let total = calculateTotal(cart);
      
      cart.forEach(item => {
          const itemElement = document.createElement('div');
          itemElement.innerHTML = `
              <p>${item.name} - $${item.price} x ${item.quantity}</p>
              <button class="remove-item" data-id="${item.id}">Remove</button>
          `;
          cartItems.appendChild(itemElement);
      });

      const discountedTotal = applyDiscount(total);
      cartTotal.textContent = `Total: $${discountedTotal.toFixed(2)}`;
      
      if (discountedTotal < total) {
          discountMessage.textContent = '20% discount applied for your first order!';
      } else {
          discountMessage.textContent = '';
      }
  }
}

// Event listener for checkout page
document.addEventListener('DOMContentLoaded', function() {
  const orderSummary = document.getElementById('order-summary');
  const checkoutForm = document.getElementById('checkout-form');

  if (orderSummary) {
      let total = calculateTotal(cart);
      let discountedTotal = applyDiscount(total);
      
      orderSummary.innerHTML = `
          <h2>Order Summary</h2>
          ${cart.map(item => `<p>${item.name} - $${item.price} x ${item.quantity}</p>`).join('')}
          <p>Subtotal: $${total.toFixed(2)}</p>
          <p>Discount: $${(total - discountedTotal).toFixed(2)}</p>
          <p><strong>Total: $${discountedTotal.toFixed(2)}</strong></p>
      `;
  }

  if (checkoutForm) {
      checkoutForm.addEventListener('submit', function(e) {
          e.preventDefault();
          alert('Thank you for your order!');
          localStorage.setItem('firstOrder', 'false');
          cart = [];
          localStorage.setItem('cart', JSON.stringify(cart));
          window.location.href = 'index.html';
      });
  }

  updateCartDisplay();
});


// Function to generate order summary HTML
function generateOrderSummaryHTML(cart) {
  let subtotal = calculateTotal(cart);
  let discount = subtotal * 0.2; // 20% discount
  let total = applyDiscount(subtotal);

  return `
      <h2>Order Summary</h2>
      ${cart.map(item => `<p>${item.name} - $${item.price.toFixed(2)} x ${item.quantity}</p>`).join('')}
      <p>Subtotal: $${subtotal.toFixed(2)}</p>
      <p>Discount (20%): -$${discount.toFixed(2)}</p>
      <p><strong>Total after discount: $${total.toFixed(2)}</strong></p>
  `;
}

// Event listener for checkout page
document.addEventListener('DOMContentLoaded', function() {
  const orderSummary = document.getElementById('order-summary');
  const checkoutForm = document.getElementById('checkout-form');

  if (orderSummary) {
      orderSummary.innerHTML = generateOrderSummaryHTML(cart);
  }
});

// Make sure this event listener is present
document.addEventListener('DOMContentLoaded', function() {
  let addToCartButtons = document.querySelectorAll('.add-to-cart');
  addToCartButtons.forEach(button => {
      button.addEventListener('click', function() {
          let id = this.dataset.id;
          let name = this.dataset.name;
          let price = parseFloat(this.dataset.price);
          let image = this.dataset.image;
          addToCart(id, name, price, image);
      });
  });

  updateCartIcon();
});

// Add this function to update the cart icon
function updateCartIcon() {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let cartIcon = document.querySelector('.cart-icon');
  if (cartIcon) {
      let totalItems = cart.reduce((total, item) => total + item.quantity, 0);
      cartIcon.textContent = totalItems;
  }
}
