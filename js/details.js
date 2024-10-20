const bookDetail = document.getElementById('bookDetail');
const currentBook = JSON.parse(localStorage.getItem('currentBook'));

if (currentBook) {
    bookDetail.style.lineHeight = '2rem'
    bookDetail.innerHTML = `
        <div>
            <h1>${currentBook.title}</h1>
            <img src="${currentBook.formats['image/jpeg']}" alt="${currentBook.title}" />
            <p><strong>ID:</strong>  ${currentBook.id}</p>
            <p><strong>Download:</strong> ${currentBook.download_count}</p>
            <p><strong>Copyright:</strong> ${currentBook.copyright}</p>
            <p><strong>Languages:</strong> ${currentBook.languages.length > 0 ? currentBook.languages.includes('en') ? 'English' : currentBook.languages : 'Unknown'}</p>
            <p><strong>Author:</strong> ${currentBook.authors.length > 0 ? currentBook.authors[0].name : 'Unknown Author'}</p>
            <p><strong>Genre: </strong>${currentBook.subjects.join(', ')}</p>
            <p>${currentBook.bookshelves.join(', ')}</p>
        </div>
    `;
} else {
    bookDetail.innerHTML = '<p>No book selected.</p>';
}