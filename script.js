let myLibrary = [];

// variables for capturing the buttons
const newBookButton = document.querySelectorAll('[data-modal-target]');
const closeModalButtons = document.querySelectorAll('[data-close-button]');
const addBookModalBtn = document.querySelector('#add-book-btn')
const overlay = document.getElementById('overlay');
const removeBookFromDisplay = document.querySelectorAll('.remove-btn');

class Book {
  constructor(title, author, pages, language, genre, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.language = language;
    this.genre = genre;
    this.read = read;
  }
}

Book.prototype.info = function () {
  return `${this.title} by ${this.author}, ${this.pages} pages, ${this.read}`;
}

const theHobbit = new Book("The Hobbit", "J.R.R. Tolkien", "295", "English", 
"High Fantasy", false);
const harryPotter = new Book("Harry Potter and the Philosopher's Stone", 
"J. K. Rowling", "223", "English", "Fantasy", true);
 

function addBookToLibrary(book) {
  myLibrary.push(book);
}

addBookToLibrary(theHobbit);
addBookToLibrary(harryPotter);

function displayBooks() {
  let myBooks = document.querySelectorAll('#my-books')[0];
  
  if (storedInput) {
    myLibrary = storedInput;    
  }

  for (let i = 0; i < myLibrary.length; i++) {
    let cardDiv = document.createElement('div');
    cardDiv.classList.add('card');
    let cardDivContent;
   

    if (myLibrary[i].read == true) {
      cardDivContent = `
      <div id="title-card">
        <div>
          <h4>${myLibrary[i].title}</h4>
        </div>
        <button class="remove-btn">&times;</button>
      </div>
      <p>Author: ${myLibrary[i].author}</p>
      <p>Number of pages: ${myLibrary[i].pages}</p>
      <p>Language: English</p>
      <p>Genre: Fantasy</p>
      <div class="mark-read">
        <label for="checkbox">Have you read this book?</label>
        <input type="checkbox" name="checkbox" id="checkbox" checked>
      </div>
      <div class="interaction-symbols">
        <a href="#"><img src="./assets/star-plus-outline.png" alt="add to favorite icon"></a> 
        <a href="#"><img src="./assets/eye-plus-outline.png" alt="watch later icon"></a>
        <a href="#"><img src="./assets/share-variant-outline.png" alt="share icon"></a>
      </div>`

    } else if (myLibrary[i].read == false) {
      cardDivContent = `
        <div id="title-card">
          <div>
            <h4>${myLibrary[i].title}</h4>
          </div>
          <button class="remove-btn">&times;</button>
        </div>
        <p>Author: ${myLibrary[i].author}</p>
        <p>Number of pages: ${myLibrary[i].pages}</p>
        <p>Language: English</p>
        <p>Genre: Fantasy</p>
        <div class="mark-read">
          <label for="checkbox">Have you read this book?</label>
          <input type="checkbox" name="checkbox" id="checkbox">
        </div>
        <div class="interaction-symbols">
          <a href="#"><img src="./assets/star-plus-outline.png" alt="add to favorite icon"></a> 
          <a href="#"><img src="./assets/eye-plus-outline.png" alt="watch later icon"></a>
          <a href="#"><img src="./assets/share-variant-outline.png" alt="share icon"></a>
        </div>`
    }
  
    cardDiv.innerHTML = cardDivContent;
    myBooks.append(cardDiv);

    const removeBookFromDisplay = document.querySelectorAll('.remove-btn');
    removeBookFromDisplay.forEach(button => button.addEventListener('click', removeBooks));
    updateLocalStorage();
  }
}


// buttons being used with their respective events

newBookButton.forEach(button => {
  button.addEventListener('click', () => {
    const modal = document.querySelector(button.dataset.modalTarget)
    openModal(modal)
  })
});

closeModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = button.closest('.modal');
    closeModal(modal)
  })
});

overlay.addEventListener('click', () => {
  const modals = document.querySelectorAll('.modal.active')
  modals.forEach(modal => {
    closeModal(modal)
  })
});

function openModal(modal) {
  if (modal == null) return
  modal.classList.add('active')
  overlay.classList.add('active')
}

function closeModal(modal) {
  if (modal == null) return
  modal.classList.remove('active')
  overlay.classList.remove('active')
}

removeBookFromDisplay.forEach(button => button.addEventListener('click', removeBooks));

function removeBooks(event) {
  let removeBook = event.target;
  updateMyLibrary(event);
  removeBook.parentElement.parentElement.remove();
  updateLocalStorage();  
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
};


const addNewBook = (e) => {
  e.preventDefault();

  let myBooks = document.querySelectorAll('#my-books')[0];

  let title = document.getElementById('title').value;
  let author = document.getElementById('author').value;
  let nrOfPages = document.getElementById('pages').value;
  let language = document.getElementById('language').value;
  let genre = document.getElementById('genre').value;
  let readBook = document.getElementById('checkbox').checked;
  let bookAdded = new Book(title, author, nrOfPages, language, genre, readBook);

  addBookToLibrary(bookAdded);
  storedInput = myLibrary
  document.forms[0].reset();
  closeModal(modal);
  removeAllChildNodes(myBooks);
  displayBooks();

  saveToLocalStorage();

}

let storedInput = JSON.parse(localStorage.getItem('myBookList'));

function saveToLocalStorage() {
  return localStorage.setItem('myBookList', JSON.stringify(myLibrary));
}

function updateLocalStorage() {
  saveToLocalStorage();
  return storedInput = JSON.parse(localStorage.getItem('myBookList'));
}

addBookModalBtn.addEventListener('click', addNewBook)

function updateMyLibrary(event) {  
  let bookSelected = event.path[1].children[0];
  let bookShelf = event.path[3].children;

  for (let i = 0; i < bookShelf.length; i++) {
    if (myLibrary[i].title == bookSelected.innerText) {
      let value = bookSelected.innerText;
      myLibrary = myLibrary.filter(item => item.title !== value);
      return myLibrary;
    }
  } 
}

displayBooks();
