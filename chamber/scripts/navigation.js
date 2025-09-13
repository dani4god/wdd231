// Navigation functionality for Chamber of Commerce site
document.addEventListener('DOMContentLoaded', function() {
    
    // DOM Elements
    const hamburger = document.getElementById('hamburger');
    const navigation = document.getElementById('navigation');
    const body = document.body;
    
    // State variables
    let isMenuOpen = false;
    
    // Toggle mobile menu
    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        
        // Update hamburger appearance
        if (hamburger) {
            hamburger.classList.toggle('active', isMenuOpen);
            hamburger.setAttribute('aria-expanded', isMenuOpen.toString());
        }
        
        // Update navigation visibility
        if (navigation) {
            navigation.classList.toggle('open', isMenuOpen);
        }
        
        // Prevent body scrolling when menu is open on mobile
        if (window.innerWidth < 768) {
            if (isMenuOpen) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        }
        
        console.log('Menu toggled:', isMenuOpen); // Debug log
    }
    
    // Close mobile menu
    function closeMenu() {
        if (isMenuOpen) {
            isMenuOpen = false;
            
            if (hamburger) {
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
            
            if (navigation) {
                navigation.classList.remove('open');
            }
            
            body.style.overflow = '';
            console.log('Menu closed'); // Debug log
        }
    }
    
    // Event Listeners
    
    // Hamburger button click
    if (hamburger) {
        console.log('Hamburger button found'); // Debug log
        
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Hamburger clicked'); // Debug log
            toggleMenu();
        });
        
        // Keyboard support for hamburger button
        hamburger.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                toggleMenu();
            }
        });
        
        // Set initial aria attributes
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-controls', 'navigation');
    } else {
        console.log('Hamburger button not found!'); // Debug log
    }
    
    // Navigation link clicks - close menu on mobile
    if (navigation) {
        const navLinks = navigation.querySelectorAll('a');
        console.log('Found', navLinks.length, 'navigation links'); // Debug log
        
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 768) {
                    closeMenu();
                }
            });
        });
    } else {
        console.log('Navigation element not found!'); // Debug log
    }
    
    // Close menu when clicking outside on mobile
    document.addEventListener('click', function(event) {
        if (isMenuOpen && navigation && hamburger && window.innerWidth < 768) {
            const isClickInsideNav = navigation.contains(event.target);
            const isClickOnHamburger = hamburger.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnHamburger) {
                closeMenu();
            }
        }
    });
    
    // Handle escape key to close menu
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && isMenuOpen) {
            closeMenu();
        }
    });
    
    // Handle window resize - close mobile menu if screen becomes large
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // Close mobile menu if window is resized to desktop size
            if (window.innerWidth >= 768 && isMenuOpen) {
                closeMenu();
            }
        }, 150);
    });
    
    // Set active navigation link based on current page
    function setActiveNavLink() {
        if (!navigation) return;
        
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = navigation.querySelectorAll('a');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href) {
                const linkPage = href.split('/').pop();
                if (linkPage === currentPage || 
                    (currentPage === '' && linkPage === 'index.html') ||
                    (currentPage === 'directory.html' && linkPage === 'directory.html')) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            }
        });
    }
    
    // Initialize navigation
    function initNavigation() {
        setActiveNavLink();
        closeMenu(); // Ensure menu starts closed
        console.log('Navigation initialized'); // Debug log
    }
    
    // Start navigation functionality
    initNavigation();
    
    // Public methods for external use
    window.ChamberNavigation = {
        closeMenu: closeMenu,
        toggleMenu: toggleMenu,
        isMenuOpen: () => isMenuOpen
    };
});
