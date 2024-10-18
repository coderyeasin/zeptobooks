const loadingSpinner = document.getElementById('loading');
const displayData = document.getElementById('displayData');
const searchBox = document.getElementById('searchId');
const filterByGenre = document.getElementById('genreFilter');

// Fetch data and display loading
const displayDataOnWeb = async () => {
    try {
        loadingSpinner.style.display = 'block';
        const res = await fetch('https://gutendex.com/books');
        const data = await res.json();
        createBookCard(data.results);
        console.log('data', data.results);
        loadingSpinner.style.display = 'none';
    } catch (error) {
        console.error('Error fetching data:', error);
        loadingSpinner.innerHTML = 'Error loading data.';
    }
};

// Create book card
function createBookCard(books) { 
    displayData.innerHTML = '';

    for (const book of books) {
        const bookDiv = document.createElement('div');
        bookDiv.className = 'book-card';
        bookDiv.innerHTML = `
            <div class="bookCover" onclick="goToBookPage(${book.id})"> 
                <img class="" src="${book.formats['image/jpeg'] || ''}" alt="${book.title || 'Book Cover'}">
                <div class="book-content">
                    <h3>${book.title.slice(0, 70) || 'Untitled'}</h3>
                    <p class="author">by ${book.authors.length > 0 ? book.authors[0].name : 'Unknown Author'}</p>
                    <p>Genre:${book.subjects ? book.subjects.join(', ').slice(0, 40) : 'No Genres Available'}</p>
                    <p>ID: ${book.id}</p>
                </div>
                <div class="book-btn">
                    <button class="details" onclick="goToBookPage(${book.id})"> View Details</button>
                    <button class="wishlist" onclick="toggleWishlist(${book.id})"> Add to Wishlist </button>
                </div>
            </div>
        `;
        displayData.appendChild(bookDiv);  
    }
}

// Call the function to display data on web
displayDataOnWeb();