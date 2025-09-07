// Navigation functionality for responsive menu
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navigation = document.getElementById('navigation');
    
    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        // Toggle hamburger animation
        hamburger.classList.toggle('active');
        
        // Toggle navigation menu
        navigation.classList.toggle('open');
        
        // Update aria attributes for accessibility
        const isOpen = navigation.classList.contains('open');
        hamburger.setAttribute('aria-expanded', isOpen);
        
        // Prevent scrolling when menu is open on mobile
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Close menu when clicking navigation links
    const navLinks = navigation.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navigation.classList.remove('open');
            document.body.style.overflow = '';
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });
    
    // Close menu when clicking outside on mobile
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navigation.contains(event.target);
        const isClickOnHamburger = hamburger.contains(event.target);
        
        if (!isClickInsideNav && !isClickOnHamburger && navigation.classList.contains('open')) {
            hamburger.classList.remove('active');
            navigation.classList.remove('open');
            document.body.style.overflow = '';
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        // Close mobile menu if window is resized to desktop size
        if (window.innerWidth >= 768) {
            hamburger.classList.remove('active');
            navigation.classList.remove('open');
            document.body.style.overflow = '';
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Set initial aria attributes
    hamburger.setAttribute('aria-expanded', 'false');
});
