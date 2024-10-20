const loadingSpinner = document.getElementById('loading');
const displayData = document.getElementById('displayData');
const searchBox = document.getElementById('searchId');
const filterByGenre = document.getElementById('genreFilter');
const paginationBox = document.getElementById('pagination');

let currentPage = 1;
let totalPages = 0;
let allBooks = [];
let filteredBooks = [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

// Fetch data
const fetchData = async (page) => {
    try {
        loadingSpinner.style.display = 'block';
        const res = await fetch(`https://gutendex.com/books?page=${page}`);
        const data = await res.json();
        allBooks = data.results;
        totalPages = Math.ceil(data.count / 32);
        createGenresOptions(allBooks); 
        applyFilters(); 
        loadingSpinner.style.display = 'none';
    } catch (error) {
        console.error('Error fetching data:', error);
        loadingSpinner.innerHTML = 'Error loading data.';
    }
};

// Apply filters 
const applyFilters = () => {
    const startIndex = (currentPage - 1) * 32;
    const endIndex = startIndex + 32;

    // Filter books by on search and genre
    filteredBooks = allBooks.filter(book => {
        const matchesSearch = searchBox.value === '' || book.title.toLowerCase().includes(searchBox.value.toLowerCase());
        const matchesGenre = filterByGenre.value === '' || getGenres(book).includes(filterByGenre.value);
        return matchesSearch && matchesGenre;
    });

    // Update display with the current filtered books
    const booksToDisplay = filteredBooks.slice(startIndex, endIndex);
    updateDisplay(booksToDisplay);
    updatePagination(); // Update pagination
};

// Update display of books
const updateDisplay = (booksToDisplay) => {
    displayData.innerHTML = '';
    booksToDisplay.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.className = 'book-card';
        bookDiv.innerHTML = `
            <div class="bookCover" onclick="goToBookPage(${book.id})"> 
                <img src="${book.formats['image/jpeg'] || ''}" alt="${book.title || 'Book Cover'}">
                <div class="book-content">
                    <h3>${book.title.length > 70 ? book.title.slice(0, 70) + '...' : book.title || 'Untitled'}</h3>
                    <p class="author">by ${book.authors.length > 0 ? book.authors[0].name : 'Unknown Author'}</p>
                    <p>Genre: ${getGenres(book).join(', ') || 'No Genres Available'}</p>
                </div>
                <div class="book-btn">
                    <button class="details" onclick="goToBookPage(${book.id})">View Details</button>
                    <button class="wishlist" onclick="toggleWishlist(${book.id})">
                        <span class="heart-icon">${wishlist.some(item => item.id === book.id) ? '❤️' : '🤍'}</span>
                    </button>
                </div>
            </div>
        `;
        displayData.appendChild(bookDiv);
    });
};

// Function to get genres
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

// Update pagination
function updatePagination() {
    paginationBox.innerHTML = '';

    const pageNumbers = [];
    if (currentPage > 1) {
        pageNumbers.push('Previous');
    }

    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);
    if (endPage - startPage < 2) {
        if (startPage === 1) {
            endPage = Math.min(totalPages, startPage + 2);
        } else {
            startPage = Math.max(1, endPage - 2);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    if (currentPage < totalPages) {
        pageNumbers.push('Next');
    }

    // Display page numbers
    pageNumbers.forEach(num => {
        const pageSpan = document.createElement('span');
        pageSpan.className = 'page-number';

        if (num === 'Previous' || num === 'Next') {
            pageSpan.textContent = num;
            pageSpan.onclick = async () => {
                currentPage = num === 'Previous' ? currentPage - 1 : currentPage + 1;
                await fetchData(currentPage); 
                updateDisplay(filteredBooks); 
                updatePagination(); 
            };
            pageSpan.style.cursor = 'pointer'; 
        } else {
            pageSpan.textContent = num;
            pageSpan.onclick = async () => {
                currentPage = num;
                await fetchData(currentPage); 
                updateDisplay(filteredBooks); 
                updatePagination(); 
            };
            if (num === currentPage) {
                pageSpan.classList.add('active'); 
            }
        }

        paginationBox.appendChild(pageSpan); 
    });
}
// create pagination buttons
const createPaginationButton = (text, page) => {
    const pageSpan = document.createElement('span');
    pageSpan.className = 'page-number';
    pageSpan.textContent = text;
    pageSpan.style.cursor = 'pointer';
    pageSpan.onclick = () => {
        currentPage = page;
        fetchData(currentPage); 
    };
    if (page === currentPage) {
        pageSpan.classList.add('active'); 
    }
    paginationBox.appendChild(pageSpan);
};

// Search book by title
searchBox.addEventListener('input', (e) => {
    currentPage = 1; 
    applyFilters();
});

// Create genre options
function createGenresOptions(data) {
    filterByGenre.innerHTML = '<option value="">All Genres</option>';
    const uniqueGenres = new Set();

    data.forEach(book => {
        getGenres(book).forEach(genre => uniqueGenres.add(genre));
    });

    uniqueGenres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        filterByGenre.appendChild(option);
    });

    // Genre filter logic
    filterByGenre.addEventListener('change', (e) => {
        currentPage = 1; 
        applyFilters();
    });
}

// Book details page
function goToBookPage(bookId) {
    localStorage.setItem('currentBook', JSON.stringify(allBooks.find(b => b.id === bookId)));
    window.location.href = '../files/details.html';
}

// Wishlist 
function toggleWishlist(bookId) {
    const book = allBooks.find(b => b.id === bookId);
    if (wishlist.some(item => item.id === bookId)) {
        wishlist = wishlist.filter(item => item.id !== bookId);
    } else {
        wishlist.push(book);
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateDisplay(filteredBooks.slice((currentPage - 1) * 32, currentPage * 32)); // Refresh display
}

// Initial data
fetchData(currentPage);