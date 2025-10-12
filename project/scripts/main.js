// Import utilities
import { fetchBooks, displayBooks } from './utils.js';

// DOM Elements
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('nav');
const newsletterBtn = document.getElementById('newsletterBtn');
const newsletterModal = document.getElementById('newsletterModal');
const modalClose = document.querySelector('.modal-close');
const newsletterForm = document.getElementById('newsletterForm');

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

// Modal Functions
function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Newsletter Modal Events
newsletterBtn?.addEventListener('click', () => {
    openModal(newsletterModal);
});

modalClose?.addEventListener('click', () => {
    closeModal(newsletterModal);
});

newsletterModal?.addEventListener('click', (e) => {
    if (e.target === newsletterModal) {
        closeModal(newsletterModal);
    }
});

// Newsletter Form Submission
newsletterForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('modalEmail').value;
    
    // Store in localStorage
    const subscribers = JSON.parse(localStorage.getItem('subscribers') || '[]');
    subscribers.push({ email, date: new Date().toISOString() });
    localStorage.setItem('subscribers', JSON.stringify(subscribers));
    
    alert('Thank you for subscribing!');
    closeModal(newsletterModal);
    newsletterForm.reset();
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) {
            closeModal(activeModal);
        }
    }
});

// Load Books for Home Page
async function loadHomePageBooks() {
    try {
        const books = await fetchBooks();
        
        // Display featured books (first 6)
        const featuredContainer = document.getElementById('featuredContainer');
        if (featuredContainer) {
            const featuredBooks = books.slice(0, 6);
            displayBooks(featuredBooks, featuredContainer);
        }
        
        // Display new arrivals (books from 2020 onwards)
        const newArrivalsContainer = document.getElementById('newArrivalsContainer');
        if (newArrivalsContainer) {
            const newArrivals = books
                .filter(book => book.year >= 2020)
                .slice(0, 6);
            displayBooks(newArrivals, newArrivalsContainer);
        }
    } catch (error) {
        console.error('Error loading books:', error);
    }
}

// Initialize home page
if (document.getElementById('featuredContainer')) {
    loadHomePageBooks();
}

// Track page views in localStorage
const pageViews = JSON.parse(localStorage.getItem('pageViews') || '{}');
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
pageViews[currentPage] = (pageViews[currentPage] || 0) + 1;
localStorage.setItem('pageViews', JSON.stringify(pageViews));
