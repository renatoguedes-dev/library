let myLibrary = [];

// variables for capturing the buttons
const myBooks = document.querySelector("#my-books");
const newBookButton = document.querySelector(".new-book-btn");
const closeModalButton = document.querySelector(".close-btn");
const addBookModalBtn = document.querySelector("#add-book-btn");
const removeBookFromDisplay = document.querySelectorAll(".remove-btn");
const checkBoxButton = document.querySelectorAll("#checkbox");
const overlay = document.getElementById("overlay");
const modal = document.querySelector("#modal");

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
};

const theHobbit = new Book(
  "The Hobbit",
  "J.R.R. Tolkien",
  "295",
  "English",
  "High Fantasy",
  false
);
const harryPotter = new Book(
  "Harry Potter and the Philosopher's Stone",
  "J. K. Rowling",
  "223",
  "English",
  "Fantasy",
  true
);

function addBookToLibrary(book) {
  myLibrary.push(book);
}

addBookToLibrary(theHobbit);
addBookToLibrary(harryPotter);

function displayBooks() {

  if (storedInput) {
    myLibrary = storedInput;
  }

  for (let i = 0; i < myLibrary.length; i++) {
    let cardDiv = document.createElement("div");
    cardDiv.classList.add("card");
    let cardDivContent;

    if (myLibrary[i].read == true) {
      cardDivContent = `
      <div id="title-card${[i]}" class="title-card">
        <div>
          <h4>${myLibrary[i].title}</h4>
        </div>
        <button class="remove-btn">&times;</button>
      </div>
      <p>Author: ${myLibrary[i].author}</p>
      <p>Number of pages: ${myLibrary[i].pages}</p>
      <p>Language: ${myLibrary[i].language}</p>
      <p>Genre: ${myLibrary[i].genre}</p>
      <div class="mark-read">
        <label for="checkbox">Have you read this book?</label>
        <input type="checkbox" name="checkbox" id="checkbox" checked>
      </div>
      <div class="interaction-symbols">
        <a href="#"><img src="./assets/star-plus-outline.png" alt="add to favorite icon"></a> 
        <a href="#"><img src="./assets/eye-plus-outline.png" alt="watch later icon"></a>
        <a href="#"><img src="./assets/share-variant-outline.png" alt="share icon"></a>
      </div>`;
    
    } else if (myLibrary[i].read == false) {
      cardDivContent = `
        <div id="title-card${[i]}" class="title-card">
          <div>
            <h4>${myLibrary[i].title}</h4>
          </div>
          <button class="remove-btn">&times;</button>
        </div>
        <p>Author: ${myLibrary[i].author}</p>
        <p>Number of pages: ${myLibrary[i].pages}</p>
        <p>Language: ${myLibrary[i].language}</p>
        <p>Genre: ${myLibrary[i].genre}</p>
        <div class="mark-read">
          <label for="checkbox">Have you read this book?</label>
          <input type="checkbox" name="checkbox" id="checkbox">
        </div>
        <div class="interaction-symbols">
          <a href="#"><img src="./assets/star-plus-outline.png" alt="add to favorite icon"></a> 
          <a href="#"><img src="./assets/eye-plus-outline.png" alt="watch later icon"></a>
          <a href="#"><img src="./assets/share-variant-outline.png" alt="share icon"></a>
        </div>`;
    }

    cardDiv.innerHTML = cardDivContent;
    myBooks.append(cardDiv)

    // add event listeners to the remove buttons when a card is created
    const removeBookFromDisplay = document.querySelectorAll(".remove-btn");
    
    removeBookFromDisplay.forEach((button) => {
      button.addEventListener("click", removeBooks)
    });

    // add event listeners to the checkbox when a card is created
    const checkBoxButton = document.querySelectorAll("#checkbox");
    
    checkBoxButton.forEach(button => {
      button.addEventListener("click", updateCheckBox);
      
    })

    updateLocalStorage();
  }

  // this div is just to keep the cards aligned when there is an odd number of cards
  let emptyDiv = document.createElement("div");
  emptyDiv.classList.add("empty-card");
  myBooks.append(emptyDiv)
}


function addNewBook(event) {
  
  event.preventDefault();

  let title = document.getElementById("title").value;
  let author = document.getElementById("author").value;
  let nrOfPages = document.getElementById("pages").value;
  let language = document.getElementById("language").value;
  let genre = document.getElementById("genre").value;
  let readBook = document.getElementById("checkbox").checked;
  
  // Check if any required field is empty
  if (!title || !author || !nrOfPages || !language || !genre) {
    alert("Please fill in all required fields.");
    return;
  }
  
  // Create new Book object and add it to the library
  let bookAdded = new Book(title, author, nrOfPages, language, genre, readBook);
  addBookToLibrary(bookAdded);
  storedInput = myLibrary;

  // Reset form and close modal
  document.forms[0].reset();
  closeModal();
  removeAllChildNodes(myBooks);
  displayBooks();

  saveToLocalStorage();
}


function removeBooks(event) {
  let bookToRemove = event;
  updateMyLibrary(bookToRemove);
  removeAllChildNodes(myBooks);
  updateLocalStorage();
  displayBooks();
}

function updateMyLibrary(event) {
  let bookSelected = event.target.parentElement.children[0].innerText;
  myLibrary = myLibrary.filter((book) => book.title !== bookSelected);
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function updateCheckBox(event) {
  let bookSelected = event.target.parentElement.parentElement.children[0].children[0].innerText;
  let checked = event.target.checked;

  myLibrary.forEach((book) => {
    if (book.title === bookSelected) {
      book.read = checked;
    }
  })
  updateLocalStorage();
}

checkBoxButton.forEach(button => {
  button.addEventListener("click", updateCheckBox)
})

addBookModalBtn.addEventListener("click", addNewBook);

newBookButton.addEventListener("click", openModal);

closeModalButton.addEventListener("click", closeModal);

overlay.addEventListener("click", closeModal);

function openModal() {
  modal.classList.add("active");
  overlay.classList.add("active");
}

function closeModal() {
  modal.classList.remove("active");
  overlay.classList.remove("active");
}

let storedInput = JSON.parse(localStorage.getItem("myBookList"));

function saveToLocalStorage() {
  return localStorage.setItem("myBookList", JSON.stringify(myLibrary));
}

function updateLocalStorage() {
  saveToLocalStorage();
  return (storedInput = JSON.parse(localStorage.getItem("myBookList")));
}

displayBooks();
