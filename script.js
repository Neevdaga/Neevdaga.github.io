// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========== DARK MODE TOGGLE ==========
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
    if (themeToggle) themeToggle.textContent = '☀️';
}

// Toggle theme
if (themeToggle) {
    themeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
        
        // Update button icon
        if (body.classList.contains('dark-mode')) {
            themeToggle.textContent = '☀️';
            localStorage.setItem('theme', 'dark');
        } else {
            themeToggle.textContent = '🌙';
            localStorage.setItem('theme', 'light');
        }
    });
}

// ========== RESET STATISTICS ==========
const resetStatsBtn = document.getElementById('reset-stats');
if (resetStatsBtn) {
    resetStatsBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to reset all statistics? This cannot be undone.')) {
            localStorage.setItem('blackjack_wins', '0');
            localStorage.setItem('blackjack_losses', '0');
            localStorage.setItem('blackjack_ties', '0');
            
            // Update display
            document.getElementById('wins-count').textContent = '0';
            document.getElementById('losses-count').textContent = '0';
            document.getElementById('ties-count').textContent = '0';
            document.getElementById('win-rate').textContent = '0%';
            
            // Show confirmation
            const originalText = resetStatsBtn.textContent;
            resetStatsBtn.textContent = 'Reset!';
            resetStatsBtn.style.backgroundColor = '#4caf50';
            
            setTimeout(() => {
                resetStatsBtn.textContent = originalText;
                resetStatsBtn.style.backgroundColor = '';
            }, 2000);
        }
    });
}

// Contact form submission handler
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // Display success message
        const responseDiv = document.getElementById('form-response');
        responseDiv.innerHTML = `
            <div style="background-color: #d4edda; color: #006400; padding: 1.5rem; border-radius: 8px; border: 3px solid #006400;">
                <strong>Thank you, ${name}!</strong><br>
                Your message has been received. We'll get back to you at ${email} soon!
            </div>
        `;
        
        // Clear form
        contactForm.reset();
        
        // Scroll to response
        responseDiv.scrollIntoView({ behavior: 'smooth' });
        
        // In a real application, you would send this data to a server
        console.log('Form submitted:', { name, email, subject, message });
    });
}

// Add active class to current navigation item
const currentLocation = window.location.pathname;
const navLinks = document.querySelectorAll('.nav-menu a');

navLinks.forEach(link => {
    if (link.getAttribute('href') === currentLocation.split('/').pop() || 
        (currentLocation.endsWith('/') && link.getAttribute('href') === 'index.html')) {
        link.classList.add('active');
    }
});

// Animate feature cards on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '0';
            entry.target.style.transform = 'translateY(20px)';
            entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, 100);
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all feature cards
const featureCards = document.querySelectorAll('.feature-card');
featureCards.forEach(card => {
    observer.observe(card);
});

// Form validation feedback
const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
formInputs.forEach(input => {
    input.addEventListener('blur', function() {
        if (this.validity.valid) {
            this.style.borderColor = '#006400';
        } else {
            this.style.borderColor = '#8b0000';
        }
    });
    
    input.addEventListener('focus', function() {
        this.style.borderColor = '#0051a5';
    });
});

// Keyboard accessibility enhancement
document.addEventListener('keydown', function(e) {
    // Press 'H' to go home
    if (e.key === 'h' && !e.ctrlKey && !e.metaKey && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        window.location.href = 'index.html';
    }
    
    // Press 'G' to go to game
    if (e.key === 'g' && !e.ctrlKey && !e.metaKey && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        window.location.href = 'game.html';
    }
});

// Add loading animation to CTA buttons
const ctaButtons = document.querySelectorAll('.cta-button, .secondary-button');
ctaButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        if (!this.href || this.href === '#') {
            return;
        }
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });
});

// Display current year in footer
const footerYears = document.querySelectorAll('.footer p');
footerYears.forEach(p => {
    if (p.textContent.includes('2024')) {
        const currentYear = new Date().getFullYear();
        p.textContent = p.textContent.replace('2024', currentYear);
    }
});

// Console Easter egg
console.log('%c♠♥♦♣ Welcome to Blackjack! ♣♦♥♠', 'font-size: 20px; color: #0051a5; font-weight: bold;');
console.log('%cPress H to go Home, G to play the Game', 'font-size: 14px; color: #666;');

// Performance monitoring
window.addEventListener('load', function() {
    const loadTime = performance.now();
    console.log(`Page loaded in ${Math.round(loadTime)}ms`);
});
