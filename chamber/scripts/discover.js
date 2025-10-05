// Discover page functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // DOM Elements
    const attractionsGrid = document.getElementById('attractions-grid');
    const visitorMessage = document.getElementById('visitor-message');
    
    // LocalStorage key
    const LAST_VISIT_KEY = 'chamberLastVisit';
    
    // Fetch attractions data
    async function fetchAttractions() {
        try {
            const response = await fetch('data/attractions.json');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            displayAttractions(data.attractions);
            
        } catch (error) {
            console.error('Error fetching attractions:', error);
            showAttractionsError();
        }
    }
    
    // Display attractions
    function displayAttractions(attractions) {
        if (!attractionsGrid) return;
        
        if (attractions.length === 0) {
            attractionsGrid.innerHTML = `
                <div class="error">
                    <h3>No attractions found</h3>
                    <p>Check back later for exciting places to discover!</p>
                </div>
            `;
            return;
        }
        
        const attractionsHTML = attractions.map(attraction => createAttractionCard(attraction)).join('');
        attractionsGrid.innerHTML = attractionsHTML;
        
        // Add lazy loading for images
        addLazyLoading();
    }
    
    // Create attraction card HTML
    function createAttractionCard(attraction) {
        return `
            <div class="attraction-card">
                <h2>${attraction.name}</h2>
                <figure>
                    <img data-src="${attraction.image}" 
                         alt="${attraction.name}" 
                         width="300" 
                         height="200"
                         loading="lazy"
                         class="lazy-image">
                    <figcaption>${attraction.category}</figcaption>
                </figure>
                <address>${attraction.address}</address>
                <p>${attraction.description}</p>
                <button onclick="alert('More information coming soon for ${attraction.name}!')">Learn More</button>
            </div>
        `;
    }
    
    // Lazy loading for images
    function addLazyLoading() {
        const images = document.querySelectorAll('.lazy-image');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy-image');
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // Show error message for attractions
    function showAttractionsError() {
        if (attractionsGrid) {
            attractionsGrid.innerHTML = `
                <div class="error">
                    <h3>Unable to load attractions</h3>
                    <p>Please try again later or contact us for information about local attractions.</p>
                </div>
            `;
        }
    }
    
    // Calculate days between visits
    function calculateDaysBetween(date1, date2) {
        const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
        const diffDays = Math.round(Math.abs((date1 - date2) / oneDay));
        return diffDays;
    }
    
    // Display visitor message based on last visit
    function displayVisitorMessage() {
        if (!visitorMessage) return;
        
        const now = Date.now();
        const lastVisit = localStorage.getItem(LAST_VISIT_KEY);
        
        let message = '';
        
        if (!lastVisit) {
            // First visit
            message = "Welcome! Let us know if you have any questions.";
        } else {
            const lastVisitTime = parseInt(lastVisit);
            const daysSinceLastVisit = calculateDaysBetween(now, lastVisitTime);
            
            if (daysSinceLastVisit < 1) {
                // Less than a day
                message = "Back so soon! Awesome!";
            } else if (daysSinceLastVisit === 1) {
                // Exactly 1 day
                message = "You last visited 1 day ago.";
            } else {
                // More than 1 day
                message = `You last visited ${daysSinceLastVisit} days ago.`;
            }
        }
        
        // Display the message
        visitorMessage.innerHTML = `<p>${message}</p>`;
        
        // Store current visit time
        localStorage.setItem(LAST_VISIT_KEY, now.toString());
        
        console.log('Visitor tracking:', {
            lastVisit: lastVisit ? new Date(parseInt(lastVisit)).toLocaleString() : 'First visit',
            currentVisit: new Date(now).toLocaleString(),
            message: message
        });
    }
    
    // Initialize page
    function initPage() {
        console.log('Discover page initialized');
        displayVisitorMessage();
        fetchAttractions();
    }
    
    // Start the page
    initPage();
});
