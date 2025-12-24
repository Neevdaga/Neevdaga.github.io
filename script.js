// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeResetButton();
    initializeFormHandling();
    initializeAnimations();
    updateHubStats();
});

// ========== UPDATE HUB STATISTICS ==========
function updateHubStats() {
    // Only run on hub page
    if (!document.getElementById('total-wins')) return;

    // Collect stats from all games
    const blackjackWins = parseInt(localStorage.getItem('blackjack_wins')) || 0;
    const blackjackLosses = parseInt(localStorage.getItem('blackjack_losses')) || 0;
    const blackjackTies = parseInt(localStorage.getItem('blackjack_ties')) || 0;
    const blackjackPlays = blackjackWins + blackjackLosses + blackjackTies;

    const slotsWins = parseInt(localStorage.getItem('slots_wins')) || 0;
    const slotsPlays = parseInt(localStorage.getItem('slots_plays')) || 0;

    const diceWins = parseInt(localStorage.getItem('dice_wins')) || 0;
    const diceLosses = parseInt(localStorage.getItem('dice_losses')) || 0;
    const dicePlays = parseInt(localStorage.getItem('dice_plays')) || 0;

    const higherWins = parseInt(localStorage.getItem('higher_wins')) || 0;
    const higherPlays = parseInt(localStorage.getItem('higher_plays')) || 0;

    const memoryWins = parseInt(localStorage.getItem('memory_wins')) || 0;
    const memoryPlays = parseInt(localStorage.getItem('memory_plays')) || 0;

    // Calculate totals
    const totalWins = blackjackWins + slotsWins + diceWins + higherWins + memoryWins;
    const totalGames = blackjackPlays + slotsPlays + dicePlays + higherPlays + memoryPlays;
    const totalLosses = blackjackLosses + diceLosses + (slotsPlays - slotsWins) + (higherPlays - higherWins);

    // Update hub display
    document.getElementById('total-wins').textContent = totalWins;
    document.getElementById('total-games').textContent = totalGames;

    const winRate = totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0;
    document.getElementById('overall-winrate').textContent = winRate + '%';

    // Find favorite game
    const gamePlays = {
        'Blackjack': blackjackPlays,
        'Slots': slotsPlays,
        'Dice': dicePlays,
        'Higher/Lower': higherPlays,
        'Memory': memoryPlays
    };
    
    let favoriteGame = '-';
    let maxPlays = 0;
    for (const [game, plays] of Object.entries(gamePlays)) {
        if (plays > maxPlays) {
            maxPlays = plays;
            favoriteGame = game;
        }
    }
    document.getElementById('favorite-game').textContent = favoriteGame;

    // Update individual game stats
    if (document.getElementById('blackjack-wins')) {
        document.getElementById('blackjack-wins').textContent = blackjackWins;
        document.getElementById('blackjack-plays').textContent = blackjackPlays;
        document.getElementById('slots-wins').textContent = slotsWins;
        document.getElementById('slots-plays').textContent = slotsPlays;
        document.getElementById('dice-wins').textContent = diceWins;
        document.getElementById('dice-plays').textContent = dicePlays;
        document.getElementById('higher-wins').textContent = higherWins;
        document.getElementById('higher-plays').textContent = higherPlays;
        document.getElementById('memory-wins').textContent = memoryWins;
        document.getElementById('memory-plays').textContent = memoryPlays;
    }

    // Update streak info
    const currentStreak = parseInt(localStorage.getItem('current_streak')) || 0;
    const bestStreak = parseInt(localStorage.getItem('best_streak')) || 0;

    if (document.getElementById('current-streak')) {
        document.getElementById('current-streak').textContent = currentStreak + ' wins';
    }
    if (document.getElementById('best-streak')) {
        document.getElementById('best-streak').textContent = bestStreak + ' wins';
    }

    // Most played
    if (document.getElementById('most-played-game')) {
        document.getElementById('most-played-game').textContent = 
            maxPlays > 0 ? `${favoriteGame} (${maxPlays} games)` : 'Play a game to start!';
    }

    // Reset all stats button
    const resetAllBtn = document.getElementById('reset-all-stats');
    if (resetAllBtn) {
        resetAllBtn.addEventListener('click', function() {
            if (confirm('⚠️ Reset ALL game statistics?\n\nThis will erase stats for:\n• Blackjack\n• Slots\n• Dice\n• Higher or Lower\n• Memory Match\n\nThis cannot be undone!')) {
                // Clear all stats
                const keys = Object.keys(localStorage);
                keys.forEach(key => {
                    if (key.includes('_wins') || key.includes('_losses') || 
                        key.includes('_plays') || key.includes('_ties') ||
                        key.includes('streak') || key.includes('credits') ||
                        key.includes('best_')) {
                        localStorage.removeItem(key);
                    }
                });
                
                // Reset credits
                localStorage.setItem('slots_credits', '1000');
                
                // Refresh display
                updateHubStats();
                
                // Visual feedback
                resetAllBtn.textContent = '✓ All Reset!';
                resetAllBtn.style.backgroundColor = '#00ff88';
                resetAllBtn.style.color = '#000';
                
                setTimeout(() => {
                    resetAllBtn.textContent = 'Reset All Stats';
                    resetAllBtn.style.backgroundColor = '';
                    resetAllBtn.style.color = '';
                }, 2000);
            }
        });
    }
}

// ========== DARK MODE TOGGLE ==========
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    // Check for saved theme preference or default to dark mode
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    if (currentTheme === 'light') {
        document.body.classList.add('light-mode');
        themeToggle.textContent = '🌙';
    } else {
        document.body.classList.remove('light-mode');
        themeToggle.textContent = '☀️';
    }

    // Toggle theme on click
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('light-mode');
        
        // Update button icon and save preference
        if (document.body.classList.contains('light-mode')) {
            themeToggle.textContent = '🌙';
            localStorage.setItem('theme', 'light');
            console.log('Switched to light mode');
        } else {
            themeToggle.textContent = '☀️';
            localStorage.setItem('theme', 'dark');
            console.log('Switched to dark mode');
        }
    });
}

// ========== RESET STATISTICS BUTTON ==========
function initializeResetButton() {
    const resetStatsBtn = document.getElementById('reset-stats');
    if (!resetStatsBtn) return;

    resetStatsBtn.addEventListener('click', function() {
        const confirmed = confirm('🎲 Are you sure you want to reset all statistics?\n\nThis will erase:\n• All wins\n• All losses\n• All ties\n• Your win rate\n\nThis action cannot be undone!');
        
        if (confirmed) {
            // Reset all stats in localStorage
            localStorage.setItem('blackjack_wins', '0');
            localStorage.setItem('blackjack_losses', '0');
            localStorage.setItem('blackjack_ties', '0');
            
            // Update display immediately
            const winsCount = document.getElementById('wins-count');
            const lossesCount = document.getElementById('losses-count');
            const tiesCount = document.getElementById('ties-count');
            const winRate = document.getElementById('win-rate');
            
            if (winsCount) winsCount.textContent = '0';
            if (lossesCount) lossesCount.textContent = '0';
            if (tiesCount) tiesCount.textContent = '0';
            if (winRate) winRate.textContent = '0%';
            
            // Visual feedback
            resetStatsBtn.textContent = '✓ Reset!';
            resetStatsBtn.style.backgroundColor = '#00ff88';
            resetStatsBtn.style.color = '#000';
            
            setTimeout(() => {
                resetStatsBtn.textContent = 'Reset Stats';
                resetStatsBtn.style.backgroundColor = '';
                resetStatsBtn.style.color = '';
            }, 2000);
            
            console.log('Statistics reset successfully');
        }
    });
}

// ========== CONTACT FORM HANDLING ==========
function initializeFormHandling() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // Display success message
        const responseDiv = document.getElementById('form-response');
        if (responseDiv) {
            responseDiv.innerHTML = `
                <div style="background: linear-gradient(135deg, rgba(0, 255, 136, 0.2), rgba(0, 230, 122, 0.2)); 
                            color: #00ff88; 
                            padding: 2rem; 
                            border-radius: 16px; 
                            border: 3px solid #00ff88;
                            font-weight: 700;
                            font-size: 1.1rem;">
                    ✓ Thank you, ${name}!<br>
                    Your message has been received. We'll get back to you at ${email} soon!
                </div>
            `;
            
            // Clear form
            contactForm.reset();
            
            // Scroll to response
            responseDiv.scrollIntoView({ behavior: 'smooth' });
        }
        
        console.log('Form submitted:', { name, email, subject, message });
    });

    // Add real-time validation feedback
    const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.validity.valid) {
                this.style.borderColor = '#00ff88';
            } else if (this.value) {
                this.style.borderColor = '#ff4757';
            }
        });
        
        input.addEventListener('focus', function() {
            this.style.borderColor = '#ffd700';
        });
    });
}

// ========== ANIMATIONS ==========
function initializeAnimations() {
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

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
                entry.target.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        observer.observe(card);
    });

    // Observe score items
    const scoreItems = document.querySelectorAll('.score-item');
    scoreItems.forEach(item => {
        observer.observe(item);
    });
}

// ========== ACTIVE NAVIGATION ==========
const currentLocation = window.location.pathname;
const navLinks = document.querySelectorAll('.nav-menu a');

navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentLocation.split('/').pop() || 
        (currentLocation.endsWith('/') && href === 'index.html')) {
        link.classList.add('active');
    }
});

// ========== BUTTON EFFECTS ==========
const ctaButtons = document.querySelectorAll('.cta-button, .secondary-button, .game-button');
ctaButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        // Ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            animation: ripple 0.6s ease-out;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation
if (!document.getElementById('ripple-animation')) {
    const style = document.createElement('style');
    style.id = 'ripple-animation';
    style.textContent = `
        @keyframes ripple {
            from {
                transform: scale(0);
                opacity: 1;
            }
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// ========== KEYBOARD SHORTCUTS ==========
document.addEventListener('keydown', function(e) {
    // Don't trigger if user is typing in an input
    if (document.activeElement.tagName === 'INPUT' || 
        document.activeElement.tagName === 'TEXTAREA') {
        return;
    }
    
    // Press 'H' to go home
    if (e.key === 'h' || e.key === 'H') {
        window.location.href = 'index.html';
    }
    
    // Press 'G' to go to game
    if (e.key === 'g' || e.key === 'G') {
        window.location.href = 'game.html';
    }
    
    // Press 'T' to toggle theme
    if (e.key === 't' || e.key === 'T') {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) themeToggle.click();
    }
});

// ========== FOOTER YEAR ==========
const footerYears = document.querySelectorAll('.footer p');
footerYears.forEach(p => {
    if (p.textContent.includes('2024')) {
        const currentYear = new Date().getFullYear();
        p.textContent = p.textContent.replace('2024', currentYear);
    }
});

// ========== CONSOLE WELCOME MESSAGE ==========
console.log('%c♠♥♦♣ BLACKJACK ♣♦♥♠', 
    'font-size: 24px; font-weight: bold; color: #ffd700; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);');
console.log('%cKeyboard Shortcuts:', 
    'font-size: 14px; color: #4da6ff; font-weight: bold;');
console.log('%c• Press H → Home', 'color: #b8c5d6;');
console.log('%c• Press G → Play Game', 'color: #b8c5d6;');
console.log('%c• Press T → Toggle Theme', 'color: #b8c5d6;');

// ========== PERFORMANCE MONITORING ==========
window.addEventListener('load', function() {
    const loadTime = performance.now();
    console.log(`%c⚡ Page loaded in ${Math.round(loadTime)}ms`, 
        'color: #00ff88; font-weight: bold;');
});
