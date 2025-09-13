// Footer functionality for Chamber of Commerce site
document.addEventListener('DOMContentLoaded', function() {
    
    // Set current year in footer
    function setCurrentYear() {
        const currentYearElement = document.getElementById('currentyear');
        if (currentYearElement) {
            const currentYear = new Date().getFullYear();
            currentYearElement.textContent = currentYear;
        }
    }
    
    // Set last modified date
    function setLastModified() {
        const lastModifiedElement = document.getElementById('lastModified');
        if (lastModifiedElement) {
            const lastModified = document.lastModified;
            
            // Format the date more nicely
            const modifiedDate = new Date(lastModified);
            const options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            
            const formattedDate = modifiedDate.toLocaleDateString('en-US', options);
            lastModifiedElement.textContent = `Last modified: ${formattedDate}`;
        }
    }
    
    // Add smooth scrolling for back-to-top functionality
    function addBackToTop() {
        // Create back to top button if it doesn't exist
        let backToTopBtn = document.getElementById('back-to-top');
        
        if (!backToTopBtn) {
            backToTopBtn = document.createElement('button');
            backToTopBtn.id = 'back-to-top';
            backToTopBtn.innerHTML = '↑';
            backToTopBtn.setAttribute('aria-label', 'Back to top');
            backToTopBtn.className = 'back-to-top-btn';
            document.body.appendChild(backToTopBtn);
            
            // Add CSS for the button
            const style = document.createElement('style');
            style.textContent = `
                .back-to-top-btn {
                    position: fixed;
                    bottom: 2rem;
                    right: 2rem;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background: var(--secondary-color, #3b82f6);
                    color: white;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    z-index: 1000;
                }
                
                .back-to-top-btn.visible {
                    opacity: 1;
                    visibility: visible;
                }
                
                .back-to-top-btn:hover {
                    background: var(--primary-color, #1e3a8a);
                    transform: translateY(-2px);
                }
                
                .back-to-top-btn:focus {
                    outline: 2px solid var(--accent-color, #f59e0b);
                    outline-offset: 2px;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Show/hide button based on scroll position
        function toggleBackToTop() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
        
        // Smooth scroll to top
        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
        
        // Event listeners
        window.addEventListener('scroll', toggleBackToTop);
        backToTopBtn.addEventListener('click', scrollToTop);
        
        // Keyboard support
        backToTopBtn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                scrollToTop();
            }
        });
        
        // Initial check
        toggleBackToTop();
    }
    
    // Add contact information interactivity
    function enhanceContactInfo() {
        // Make phone numbers clickable
        const phoneElements = document.querySelectorAll('footer p');
        phoneElements.forEach(element => {
            const text = element.textContent;
            const phoneMatch = text.match(/📞\s*(\([0-9]{3}\)\s*[0-9]{3}-[0-9]{4})/);
            
            if (phoneMatch) {
                const phoneNumber = phoneMatch[1].replace(/[^\d]/g, '');
                element.innerHTML = text.replace(phoneMatch[1], 
                    `<a href="tel:+1${phoneNumber}" style="color: #d1d5db; text-decoration: none;">${phoneMatch[1]}</a>`
                );
            }
        });
        
        // Make email addresses clickable
        const emailElements = document.querySelectorAll('footer p');
        emailElements.forEach(element => {
            const text = element.textContent;
            const emailMatch = text.match(/✉️\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
            
            if (emailMatch) {
                element.innerHTML = text.replace(emailMatch[1],
                    `<a href="mailto:${emailMatch[1]}" style="color: #d1d5db; text-decoration: none;">${emailMatch[1]}</a>`
                );
            }
        });
    }
    
    // Add social media link enhancements
    function enhanceSocialLinks() {
        const socialLinks = document.querySelectorAll('.social-links a');
        
        socialLinks.forEach(link => {
            // Add loading state for external links
            link.addEventListener('click', function() {
                const originalContent = this.innerHTML;
                this.innerHTML = '<div style="width: 20px; height: 20px; border: 2px solid currentColor; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>';
                
                // Reset after a delay (in case the page doesn't navigate)
                setTimeout(() => {
                    this.innerHTML = originalContent;
                }, 3000);
            });
            
            // Add CSS for loading animation
            if (!document.getElementById('social-loading-styles')) {
                const style = document.createElement('style');
                style.id = 'social-loading-styles';
                style.textContent = `
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `;
                document.head.appendChild(style);
            }
        });
    }
    
    // Add footer link enhancements
    function enhanceFooterLinks() {
        const footerLinks = document.querySelectorAll('footer a:not(.social-links a)');
        
        footerLinks.forEach(link => {
            // Add hover effects
            link.addEventListener('mouseenter', function() {
                this.style.transition = 'color 0.3s ease';
                this.style.color = 'white';
            });
            
            link.addEventListener('mouseleave', function() {
                this.style.color = '#d1d5db';
            });
        });
    }
    
    // Initialize footer functionality
    function initFooter() {
        setCurrentYear();
        setLastModified();
        addBackToTop();
        enhanceContactInfo();
        enhanceSocialLinks();
        enhanceFooterLinks();
    }
    
    // Start footer functionality
    initFooter();
    
    // Update year if page stays open past midnight on New Year's Eve
    const now = new Date();
    const newYear = new Date(now.getFullYear() + 1, 0, 1);
    const timeUntilNewYear = newYear.getTime() - now.getTime();
    
    if (timeUntilNewYear < 24 * 60 * 60 * 1000) { // Within 24 hours of new year
        setTimeout(() => {
            setCurrentYear();
        }, timeUntilNewYear);
    }
    
    // Public methods for external use
    window.ChamberFooter = {
        updateYear: setCurrentYear,
        updateLastModified: setLastModified
    };
});
