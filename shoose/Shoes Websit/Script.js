
// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navUl = document.querySelector('section nav ul');
    
    // Create mobile menu button if it doesn't exist
    if (!menuToggle) {
        const button = document.createElement('button');
        button.className = 'menu-toggle';
        button.innerHTML = '<i class="fa-solid fa-bars"></i>';
        document.querySelector('section nav').insertBefore(button, document.querySelector('section nav .icons'));
        
        button.addEventListener('click', function() {
            navUl.classList.toggle('active');
            const icon = this.querySelector('i');
            if (navUl.classList.contains('active')) {
                icon.className = 'fa-solid fa-times';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });
    }
    
    
    const text = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has 
been the industry's standard dummy text ever since the 1500s, when an unknown printer took 
a galley of type and scrambled it to make a type specimen book. It has survived not only 
five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.`;

    let index = 0;
    const speed = 20; // السرعة بالملي ثانية بين كل حرف
    const target = document.getElementById("typewriter");

    function typeWriter() {
        if (index < text.length) {
            target.innerHTML += text.charAt(index);
            index++;
            setTimeout(typeWriter, speed);
        }
    }

    window.onload = typeWriter; // يبدأ التأثير عند تحميل الصفحة
    // Smooth Scrolling for Navigation Links
    const navLinks = document.querySelectorAll('section nav ul li a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                if (navUl.classList.contains('active')) {
                    navUl.classList.remove('active');
                    const menuBtn = document.querySelector('.menu-toggle i');
                    if (menuBtn) menuBtn.className = 'fa-solid fa-bars';
                }
            }
        });
    });
    
    // Active Navigation Highlight
    function updateActiveNav() {
        const sections = document.querySelectorAll('section, .products, .about, .review, .services');
        const navLinks = document.querySelectorAll('section nav ul li a');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.pageYOffset >= sectionTop && window.pageYOffset <= sectionTop + sectionHeight) {
                current = section.getAttribute('id') || 'Home';
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    
    // Shopping Cart Functionality
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    function updateCartCount() {
        const cartIcon = document.querySelector('.fa-cart-shopping');
        if (cartIcon && cart.length > 0) {
            if (!cartIcon.nextElementSibling || !cartIcon.nextElementSibling.classList.contains('cart-count')) {
                const badge = document.createElement('span');
                badge.className = 'cart-count';
                badge.style.cssText = `
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background: #c72092;
                    color: white;
                    border-radius: 50%;
                    width: 18px;
                    height: 18px;
                    font-size: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                `;
                cartIcon.parentElement.style.position = 'relative';
                cartIcon.parentElement.appendChild(badge);
            }
            cartIcon.nextElementSibling.textContent = cart.length;
        }
    }
    
    function updateWishlistCount() {
        const heartIcon = document.querySelector('.icons .fa-heart');
        if (heartIcon && wishlist.length > 0) {
            if (!heartIcon.nextElementSibling || !heartIcon.nextElementSibling.classList.contains('wishlist-count')) {
                const badge = document.createElement('span');
                badge.className = 'wishlist-count';
                badge.style.cssText = `
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background: #ff4757;
                    color: white;
                    border-radius: 50%;
                    width: 18px;
                    height: 18px;
                    font-size: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                `;
                heartIcon.parentElement.style.position = 'relative';
                heartIcon.parentElement.appendChild(badge);
            }
            heartIcon.nextElementSibling.textContent = wishlist.length;
        }
    }
    
    // Add to Cart functionality
    const addToCartBtns = document.querySelectorAll('.btn');
    addToCartBtns.forEach((btn, index) => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const card = this.closest('.card');
            const productName = card.querySelector('h2').textContent;
            const productPrice = card.querySelector('h3').textContent;
            const productImage = card.querySelector('img').src;
            
            const product = {
                id: index,
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            };
            
            const existingProduct = cart.find(item => item.id === index);
            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                cart.push(product);
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            
            // Show notification
            showNotification('Product added to cart!', 'success');
        });
    });
    
    // Wishlist functionality
    const heartButtons = document.querySelectorAll('.small_card .fa-heart');
    heartButtons.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            const card = this.closest('.card');
            const productName = card.querySelector('h2').textContent;
            const productPrice = card.querySelector('h3').textContent;
            const productImage = card.querySelector('img').src;
            
            const product = {
                id: index,
                name: productName,
                price: productPrice,
                image: productImage
            };
            
            const existingIndex = wishlist.findIndex(item => item.id === index);
            if (existingIndex > -1) {
                wishlist.splice(existingIndex, 1);
                this.style.color = '';
                showNotification('Removed from wishlist!', 'info');
            } else {
                wishlist.push(product);
                this.style.color = '#ff4757';
                showNotification('Added to wishlist!', 'success');
            }
            
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            updateWishlistCount();
        });
    });
    
    // Notification system
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#3498db'};
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 1000;
            transform: translateX(300px);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(300px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Product Image Gallery (About section)
    function functio(small) {
        const full = document.getElementById("imagebox");
        if (full) {
            full.src = small.src;
            full.style.transform = 'scale(0.8)';
            setTimeout(() => {
                full.style.transform = 'scale(1)';
            }, 200);
        }
    }
    
    // Make function global
    window.functio = functio;
    
    // Search functionality
    const searchInput = document.querySelector('.search_bar input');
    const searchButton = document.querySelector('.search_bar button');
    
    if (searchButton) {
        searchButton.addEventListener('click', function(e) {
            e.preventDefault();
            if (searchInput && searchInput.value.trim()) {
                showNotification('Search functionality coming soon!', 'info');
            }
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.value.trim()) {
                showNotification('Search functionality coming soon!', 'info');
            }
        });
    }
    
    // Login Form Animation
    const loginForm = document.querySelector('.login_form form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = this.querySelector('input[name="user"]').value;
            const password = this.querySelector('input[name="password"]').value;
            
            if (!username || !password) {
                showNotification('Please fill in all fields!', 'error');
                return;
            }
            
            // Simulate login
            showNotification('Login successful! Welcome back!', 'success');
            
            // Reset form
            this.reset();
        });
    }
    
    // Scroll to Top Button
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(to right, #c72092, #6c14d0);
        color: white;
        border: none;
        cursor: pointer;
        font-size: 18px;
        z-index: 1000;
        opacity: 0;
        transform: scale(0);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(scrollTopBtn);
    
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Show/Hide scroll to top button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.style.opacity = '1';
            scrollTopBtn.style.transform = 'scale(1)';
        } else {
            scrollTopBtn.style.opacity = '0';
            scrollTopBtn.style.transform = 'scale(0)';
        }
    });
    
    // Parallax Effect for Hero Section
    const heroSection = document.querySelector('section');
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroSection.style.transform = `translateY(${rate}px)`;
        });
    }
    
    // Counter Animation for Statistics (if needed)
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            element.textContent = Math.floor(start);
            
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            }
        }, 16);
    }
    
    // Intersection Observer for Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe product cards for animation
    const productCards = document.querySelectorAll('.products .card');
    productCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
    
    // Newsletter Subscription
    const newsletterForm = document.querySelector('.search_bar');
    if (newsletterForm) {
        const emailInput = newsletterForm.querySelector('input');
        const subscribeBtn = newsletterForm.querySelector('button');
        
        subscribeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const email = emailInput.value.trim();
            
            if (!email) {
                showNotification('Please enter your email!', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email!', 'error');
                return;
            }
            
            showNotification('Successfully subscribed to newsletter!', 'success');
            emailInput.value = '';
        });
    }
    
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    // Product Filter (if needed)
    function filterProducts(category) {
        const products = document.querySelectorAll('.products .card');
        products.forEach(product => {
            if (category === 'all' || product.dataset.category === category) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    }
    
    // Star Rating Interactive
    const starRatings = document.querySelectorAll('.products_star');
    starRatings.forEach(rating => {
        const stars = rating.querySelectorAll('i');
        stars.forEach((star, index) => {
            star.addEventListener('click', function() {
                // Update visual rating
                stars.forEach((s, i) => {
                    if (i <= index) {
                        s.className = 'fa-solid fa-star';
                    } else {
                        s.className = 'fa-regular fa-star';
                    }
                });
                showNotification(`Rated ${index + 1} stars!`, 'success');
            });
        });
    });
    
    // Initialize counts
    updateCartCount();
    updateWishlistCount();
    
    // Loading Animation
    function hideLoader() {
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }
    }
    
    // Hide loader when page is ready
    window.addEventListener('load', hideLoader);
    
    console.log('Nike Website Interactive JavaScript Loaded Successfully!');
});

// Additional CSS for interactive elements
const additionalCSS = `
<style>
.nav-link.active {
    color: #c72092 !important;
    font-weight: bold;
}

.notification {
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    font-weight: 500;
}

.scroll-top-btn:hover {
    transform: scale(1.1) !important;
}

.card:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 25px rgba(108, 20, 208, 0.3);
}

.products_star i:hover {
    transform: scale(1.2);
    color: #ffd700 !important;
}

@media (max-width: 768px) {
    .notification {
        right: 10px;
        left: 10px;
        transform: translateY(-100px);
    }
    
    .notification.show {
        transform: translateY(0);
    }
}

.menu-toggle {
    display: none;
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #c72092;
}

@media (max-width: 768px) {
    .menu-toggle {
        display: block;
    }
    
    section nav ul {
        display: none;
        width: 100%;
        flex-direction: column;
        background: white;
        position: absolute;
        top: 100%;
        left: 0;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        z-index: 1000;
    }
    
    section nav ul.active {
        display: flex !important;
    }
}

.loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: white;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}
</style>
`;

// Inject additional CSS
document.head.insertAdjacentHTML('beforeend', additionalCSS);


