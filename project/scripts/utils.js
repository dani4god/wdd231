// Fetch books from JSON file with error handling
export async function fetchBooks() {
    try {
        const response = await fetch('data/books.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.books;
    } catch (error) {
        console.error('Error fetching books:', error);
        throw error;
    }
}

// Create book card HTML using template literals
export function createBookCard(book) {
    return `
        <div class="book-card" data-id="${book.id}" tabindex="0" role="button" aria-label="View details for ${book.title}">
            <img src="${book.cover}" alt="Cover of ${book.title}" loading="lazy" width="250" height="300">
            <h3>${book.title}</h3>
            <p class="book-info"><strong>Author:</strong> ${book.author}</p>
            <p class="book-info"><strong>Year:</strong> ${book.year}</p>
            <p class="book-info book-rating"><strong>Rating:</strong> ${'⭐'.repeat(Math.floor(book.rating))} ${book.rating}</p>
            <span class="book-genre">${book.genre}</span>
        </div>
    `;
}

// Display books in a container using array methods
export function displayBooks(books, container) {
    if (!container) return;
    
    if (books.length === 0) {
        container.innerHTML = '<p class="no-results">No books found matching your criteria.</p>';
        return;
    }
    
    // Use map to create HTML for each book
    const booksHTML = books.map(book => createBookCard(book)).join('');
    container.innerHTML = booksHTML;
    
    // Add click event listeners to all book cards
    const bookCards = container.querySelectorAll('.book-card');
    bookCards.forEach(card => {
        card.addEventListener('click', () => {
            const bookId = parseInt(card.dataset.id);
            const book = books.find(b => b.id === bookId);
            if (book) {
                showBookDetails(book);
            }
        });
        
        // Keyboard accessibility
        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const bookId = parseInt(card.dataset.id);
                const book = books.find(b => b.id === bookId);
                if (book) {
                    showBookDetails(book);
                }
            }
        });
    });
}

// Show book details in modal
export function showBookDetails(book) {
    const modal = document.getElementById('bookModal');
    const bookDetails = document.getElementById('bookDetails');
    
    if (!modal || !bookDetails) return;
    
    // Create detailed book information using template literals
    bookDetails.innerHTML = `
        <img src="${book.cover}" alt="Cover of ${book.title}" class="book-modal-image" loading="lazy">
        <h2>${book.title}</h2>
        <p><strong>Author:</strong> ${book.author}</p>
        <p><strong>Genre:</strong> ${book.genre}</p>
        <p><strong>Year Published:</strong> ${book.year}</p>
        <p><strong>Pages:</strong> ${book.pages}</p>
        <p><strong>ISBN:</strong> ${book.isbn}</p>
        <p><strong>Rating:</strong> ${'⭐'.repeat(Math.floor(book.rating))} ${book.rating}/5</p>
        <p><strong>Description:</strong> ${book.description}</p>
        <p><strong>Status:</strong> <span style="color: ${book.available ? 'green' : 'red'}">
            ${book.available ? 'Available' : 'Checked Out'}
        </span></p>
        ${book.available ? '<button class="cta-button" onclick="alert(\'Book borrowed successfully!\')">Borrow Book</button>' : ''}
    `;
    
    // Open modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.onclick = () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    };
    
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    };
}

// Filter books by genre
export function filterByGenre(books, genre) {
    if (genre === 'all') return books;
    return books.filter(book => book.genre === genre);
}

// Filter books by year
export function filterByYear(books, year) {
    if (year === 'all') return books;
    if (year === 'older') {
        return books.filter(book => book.year <= 2020);
    }
    return books.filter(book => book.year === parseInt(year));
}

// Search books by title or author
export function searchBooks(books, query) {
    if (!query) return books;
    const lowerQuery = query.toLowerCase();
    return books.filter(book => 
        book.title.toLowerCase().includes(lowerQuery) || 
        book.author.toLowerCase().includes(lowerQuery)
    );
}
