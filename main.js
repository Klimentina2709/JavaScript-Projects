const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const categoryInput = document.getElementById("category");
const addButton = document.querySelector("button:first-of-type");
const searchInput = document.getElementById("filterCategory");
const filterBtn = document.querySelector(".btn-info");
const bookList = document.getElementById("bookList");

class Book {
  constructor(title, author, category) {
    this.title = title;
    this.author = author;
    this.category = category;
  }
}

class Library {
  constructor(books, bookList) {
    this.books = books;
    this.bookList = bookList;
    this.displayBooks(this.books);
  }

  addBook(book) {
    this.books.push(book);
    localStorage.setItem("books", JSON.stringify(this.books));

    this.displayBooks(this.books);

    searchInput.value = "";
  }

  displayBooks(array) {
    this.bookList.innerHTML = "";

    const ul = document.createElement("ul");
    ul.classList.add("list-group");

    array.forEach((book) => {
      const bookItem = document.createElement("li");
      bookItem.classList.add("list-group-item", "bg-secondary", "text-white");
      bookItem.innerHTML = `<b>Title:</b> ${book.title}, <b>Author:</b> ${book.author}, <b>Category:</b> ${book.category}`;
      ul.appendChild(bookItem);
      this.bookList.appendChild(ul);
    });
  }

  filterLibrary(filterQuery) {
    const filteredItems = this.books.filter(
      (book) =>
        book.title.toLowerCase().includes(filterQuery) ||
        book.author.toLowerCase().includes(filterQuery) ||
        book.category.toLowerCase().includes(filterQuery)
    );

    this.displayBooks(filteredItems);
  }
}

let library = new Library(
  JSON.parse(localStorage.getItem("books")) || [],
  bookList
);

addButton.addEventListener("click", () => {
  let titleValue = titleInput.value;
  let authorValue = authorInput.value;
  let categoryValue = categoryInput.value;

  if (!titleValue || !authorValue || !categoryValue) {
    alert("Please enter all book details");
    return;
  }

  const newBook = new Book(titleValue, authorValue, categoryValue);

  library.addBook(newBook);

  titleInput.value = "";
  authorInput.value = "";
  categoryInput.value = "";
});

filterBtn.addEventListener("click", () => {
  const filterQuery = searchInput.value.toLowerCase();

  library.filterLibrary(filterQuery);
});
