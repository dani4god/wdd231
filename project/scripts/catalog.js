// Import utilities
import { fetchBooks, displayBooks, filterByGenre, filterByYear, searchBooks } from './utils.js';

// DOM Elements
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('nav');
const catalogContainer = document.getElementById('catalogContainer');
const resultsCount = document.getElementById('resultsCount');
const genreFilter = document.getElementById('genreFilter');
const yearFilter = document.getElementById('yearFilter');
const searchInput = document.getElementById('searchInput');

// Store all books globally
let allBooks = [];
let filteredBooks = [];

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

// Load all books
async function loadCatalog() {
    try {
        catalogContainer.innerHTML = '<p class="loading">Loading books...</p>';
        allBooks = await fetchBooks();
        filteredBooks = allBooks;
        displayFilteredBooks();
    } catch (error) {
        catalogContainer.innerHTML = '<p class="error">Error loading books. Please try again later.</p>';
        console.error('Error loading catalog:', error);
    }
}

// Display filtered books and update count
function displayFilteredBooks() {
    displayBooks(filteredBooks, catalogContainer);
    
    // Update results count
    const count = filteredBooks.length;
    resultsCount.textContent = `Showing ${count} ${count === 1 ? 'book' : 'books'}`;
}

// Apply all filters
function applyFilters() {
    let result = allBooks;
    
    // Apply genre filter
    const selectedGenre = genreFilter.value;
    result = filterByGenre(result, selectedGenre);
    
    // Apply year filter
    const selectedYear = yearFilter.value;
    result = filterByYear(result, selectedYear);
    
    // Apply search filter
    const searchQuery = searchInput.value.trim();
    result = searchBooks(result, searchQuery);
    
    // Store search preferences in localStorage
    const searchPreferences = {
        genre: selectedGenre,
        year: selectedYear,
        lastSearch: searchQuery,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('searchPreferences', JSON.stringify(searchPreferences));
    
    filteredBooks = result;
    displayFilteredBooks();
}

// Event listeners for filters
genreFilter?.addEventListener('change', applyFilters);
yearFilter?.addEventListener('change', applyFilters);

// Search with debounce to improve performance
let searchTimeout;
searchInput?.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(applyFilters, 300);
});

// Load saved preferences from localStorage
function loadSavedPreferences() {
    try {
        const savedPrefs = localStorage.getItem('searchPreferences');
        if (savedPrefs) {
            const prefs = JSON.parse(savedPrefs);
            if (genreFilter) genreFilter.value = prefs.genre || 'all';
            if (yearFilter) yearFilter.value = prefs.year || 'all';
        }
    } catch (error) {
        console.error('Error loading preferences:', error);
    }
}

// Initialize catalog page
loadSavedPreferences();
loadCatalog();
