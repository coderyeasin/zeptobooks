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
        searchBook(data.results);
        createGenresOptions(data.results);
        console.log('data', data);
        loadingSpinner.style.display = 'none';
    } catch (error) {
        console.error('Error fetching data:', error);
        loadingSpinner.innerHTML = 'Error loading data.';
    }
};

// Function genres
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

    checkForGenres(book.subjects);
    checkForGenres(book.bookshelves);
  
    return genres ? Array.from(genres) : 'No Genres Available';
  }
  

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
                    <h3>${book.title.length > 70 ? book.title.slice(0, 70) + '...' : book.title || 'Untitled'}</h3>
                    <p class="author">by ${book.authors.length > 0 ? book.authors[0].name : 'Unknown Author'}</p>
                    <p>Genre:${getGenres(book)}</p>
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

// Search Book by title
const searchBook = (data) => {
    searchBox.addEventListener('input', (e) => {
      const searchTxt = e.target.value.toLowerCase();
      const searchBooks = data.filter((book) => 
        book.title.toLowerCase().includes(searchTxt)
      );
      createBookCard(searchBooks);
    });
  };


// Create Options and genre filter
function createGenresOptions (data) {
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
    
    // genre filter
    filterByGenre.addEventListener('change', async (e) => {
        const selectedGenre = e.target.value;
        const filteredBooks = data.filter(book => {
            const genres = getGenres(book);
            return selectedGenre === '' || genres.includes(selectedGenre);
        });
        createBookCard(filteredBooks);
    });

}


// Call the function to display data on web
displayDataOnWeb();