// DOM Elements
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('nav');
const planButtons = document.querySelectorAll('.plan-button');
const membershipPlanSelect = document.getElementById('membershipPlan');
const membershipForm = document.getElementById('membershipForm');

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

// Plan button clicks - scroll to form and select plan
planButtons.forEach(button => {
    button.addEventListener('click', () => {
        const planName = button.dataset.plan;
        if (membershipPlanSelect) {
            membershipPlanSelect.value = planName;
            
            // Smooth scroll to form
            const form = document.getElementById('membershipForm');
            form.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Highlight the form briefly
            form.style.transition = 'background-color 0.3s';
            form.style.backgroundColor = '#fff3f3';
            setTimeout(() => {
                form.style.backgroundColor = '';
            }, 1000);
        }
    });
});

// Form validation and submission
membershipForm?.addEventListener('submit', (e) => {
    // Check if at least one genre is selected
    const genreCheckboxes = document.querySelectorAll('input[name="genres"]:checked');
    if (genreCheckboxes.length === 0) {
        e.preventDefault();
        alert('Please select at least one preferred genre.');
        return;
    }
    
    // Store form data in localStorage before submission
    const formData = new FormData(membershipForm);
    const membershipData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        membershipPlan: formData.get('membershipPlan'),
        genres: Array.from(genreCheckboxes).map(cb => cb.value),
        comments: formData.get('comments'),
        newsletter: formData.get('newsletter') === 'yes',
        registrationDate: new Date().toISOString()
    };
    
    localStorage.setItem('membershipData', JSON.stringify(membershipData));
});

// Phone number formatting
const phoneInput = document.getElementById('phone');
phoneInput?.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 6) {
        value = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6, 10)}`;
    } else if (value.length >= 3) {
        value = `${value.slice(0, 3)}-${value.slice(3)}`;
    }
    e.target.value = value;
});

// Load saved membership preferences if returning user
function loadSavedData() {
    try {
        const savedData = localStorage.getItem('membershipData');
        if (savedData) {
            const data = JSON.parse(savedData);
            // Optionally pre-fill some fields for returning users
            console.log('Returning user detected:', data.email);
        }
    } catch (error) {
        console.error('Error loading saved data:', error);
    }
}

loadSavedData();
