// DOM Elements
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('nav');
const registrationDetails = document.getElementById('registrationDetails');

// Hamburger Menu Toggle
hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    nav.classList.toggle('active');
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isExpanded);
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (nav?.classList.contains('active') && 
        !nav.contains(e.target) && 
        !hamburger.contains(e.target)) {
        nav.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    }
});

// Get URL parameters
function getURLParameters() {
    const params = new URLSearchParams(window.location.search);
    return {
        firstName: params.get('firstName'),
        lastName: params.get('lastName'),
        email: params.get('email'),
        phone: params.get('phone'),
        membershipPlan: params.get('membershipPlan'),
        genres: params.getAll('genres'),
        comments: params.get('comments'),
        newsletter: params.get('newsletter')
    };
}

// Display registration details
function displayRegistrationDetails() {
    const data = getURLParameters();
    
    if (!data.firstName || !data.email) {
        registrationDetails.innerHTML = '<p>No registration data found.</p>';
        return;
    }
    
    // Create details HTML using template literals
    const detailsHTML = `
        <div class="detail-item">
            <span class="detail-label">Name:</span>
            <span class="detail-value">${data.firstName} ${data.lastName}</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Email:</span>
            <span class="detail-value">${data.email}</span>
        </div>
        ${data.phone ? `
        <div class="detail-item">
            <span class="detail-label">Phone:</span>
            <span class="detail-value">${data.phone}</span>
        </div>
        ` : ''}
        <div class="detail-item">
            <span class="detail-label">Membership Plan:</span>
            <span class="detail-value">${data.membershipPlan}</span>
        </div>
        ${data.genres.length > 0 ? `
        <div class="detail-item">
            <span class="detail-label">Preferred Genres:</span>
            <span class="detail-value">${data.genres.join(', ')}</span>
        </div>
        ` : ''}
        ${data.comments ? `
        <div class="detail-item">
            <span class="detail-label">Comments:</span>
            <span class="detail-value">${data.comments}</span>
        </div>
        ` : ''}
        <div class="detail-item">
            <span class="detail-label">Newsletter:</span>
            <span class="detail-value">${data.newsletter === 'yes' ? 'Subscribed' : 'Not subscribed'}</span>
        </div>
    `;
    
    registrationDetails.innerHTML = `<h2>Registration Summary</h2>${detailsHTML}`;
    
    // Store in localStorage for record keeping
    const registrationRecord = {
        ...data,
        timestamp: new Date().toISOString(),
        confirmationNumber: `DH${Date.now().toString().slice(-8)}`
    };
    
    // Get existing registrations or create new array
    const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
    registrations.push(registrationRecord);
    localStorage.setItem('registrations', JSON.stringify(registrations));
    
    // Display confirmation number
    const confirmationHTML = `
        <div class="detail-item" style="background-color: #BC002D; color: white; padding: 1rem; border-radius: 5px; margin-top: 1rem;">
            <span class="detail-label" style="color: white;">Confirmation Number:</span>
            <span class="detail-value" style="color: white; font-weight: bold;">${registrationRecord.confirmationNumber}</span>
        </div>
    `;
    registrationDetails.innerHTML += confirmationHTML;
}

// Initialize the page
displayRegistrationDetails();
