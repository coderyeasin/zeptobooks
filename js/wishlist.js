const wishlistData = document.getElementById('wishlist');
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

function getGenres(book) {
    const genres = new Set();
    const checkForGenres = (list) => {
        list.forEach(item => {
            if (item.includes('Fiction')) genres.add('Fiction');
            if (item.includes('Horror')) genres.add('Horror');
            if (item.includes('Fantasy')) genres.add('Fantasy');
            if (item.includes('Mystery')) genres.add('Mystery');
            if (item.includes('Romance')) genres.add('Romance');
            if (item.includes('Science fiction')) genres.add('Science Fiction');
        });
    };

    checkForGenres(book.subjects || []);
    checkForGenres(book.bookshelves || []);
    return Array.from(genres);
}

// Display wishlist books
function displayWishlist() {
    wishlistData.innerHTML = '';
    if (wishlist.length === 0) {
        wishlistData.innerHTML = '<p>Your wishlist is empty.</p>';
        return;
    }

    wishlist.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.className = 'book-card';
        bookDiv.innerHTML = `
            <div class="bookCover"> 
                <img src="${book.formats['image/jpeg'] || ''}" alt="${book.title || 'Book Cover'}">
                <div class="book-content">
                    <h3>${book.title.length > 70 ? book.title.slice(0, 70) + '...' : book.title || 'Untitled'}</h3>
                    <p class="author">by ${book.authors.length > 0 ? book.authors[0].name : 'Unknown Author'}</p>
                    <p>Genre: ${getGenres(book).join(', ') || 'No Genres Available'}</p>
                    <p>ID: ${book.id}</p>
                </div>
                <div class="book-btn">
                    <button class="details" onclick="goToBookPage(${book.id})">View Details</button>
                    <button class="wishlist" onclick="toggleWishlist(${book.id})">
                        <span class="heart-icon">${wishlist.some(item => item.id === book.id) ? '❤️' : '🤍'}</span>
                    </button>
                </div>
            </div>
        `;
        wishlistData.appendChild(bookDiv);
    });
}

// Go to book detail page
function goToBookPage(bookId) {
    localStorage.setItem('currentBook', JSON.stringify(wishlist.find(b => b.id === bookId)));
    window.location.href = '../files/details.html'; // Navigate to the book detail page
}

// Call the display function
displayWishlist();