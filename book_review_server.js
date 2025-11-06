// server.js - Express.js Book Review API Server
const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'your_secret_key_here';

// Middleware
app.use(express.json());
app.use(session({
  secret: 'session_secret',
  resave: false,
  saveUninitialized: true
}));

// In-memory data storage
let books = {
  "ISBN001": {
    isbn: "ISBN001",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    reviews: {}
  },
  "ISBN002": {
    isbn: "ISBN002",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    reviews: {}
  },
  "ISBN003": {
    isbn: "ISBN003",
    title: "1984",
    author: "George Orwell",
    reviews: {}
  },
  "ISBN004": {
    isbn: "ISBN004",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    reviews: {}
  },
  "ISBN005": {
    isbn: "ISBN005",
    title: "Animal Farm",
    author: "George Orwell",
    reviews: {}
  }
};

let users = {};

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// Task 1: Get the book list available in the shop
app.get('/books', (req, res) => {
  res.json({ books: Object.values(books) });
});

// Task 2: Get books based on ISBN
app.get('/books/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  
  if (book) {
    res.json({ book });
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Task 3: Get all books by Author
app.get('/books/author/:author', (req, res) => {
  const author = req.params.author;
  const booksByAuthor = Object.values(books).filter(
    book => book.author.toLowerCase() === author.toLowerCase()
  );
  
  if (booksByAuthor.length > 0) {
    res.json({ books: booksByAuthor });
  } else {
    res.status(404).json({ message: "No books found by this author" });
  }
});

// Task 4: Get all books based on Title
app.get('/books/title/:title', (req, res) => {
  const title = req.params.title;
  const booksByTitle = Object.values(books).filter(
    book => book.title.toLowerCase().includes(title.toLowerCase())
  );
  
  if (booksByTitle.length > 0) {
    res.json({ books: booksByTitle });
  } else {
    res.status(404).json({ message: "No books found with this title" });
  }
});

// Task 5: Get book review
app.get('/books/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  
  if (book) {
    res.json({ reviews: book.reviews });
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Task 6: Register new user
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }
  
  if (users[username]) {
    return res.status(409).json({ message: "User already exists" });
  }
  
  users[username] = { username, password };
  res.status(201).json({ message: "User registered successfully" });
});

// Task 7: Login as registered user
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }
  
  const user = users[username];
  
  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
  req.session.user = username;
  
  res.json({ 
    message: "Login successful",
    token,
    username 
  });
});

// Task 8: Add/Modify a book review (Authenticated users only)
app.put('/books/review/:isbn', authenticateToken, (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.body;
  const username = req.user.username;
  
  if (!review) {
    return res.status(400).json({ message: "Review text required" });
  }
  
  const book = books[isbn];
  
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  
  book.reviews[username] = review;
  
  res.json({ 
    message: "Review added/updated successfully",
    review: { username, review }
  });
});

// Task 9: Delete book review (Authenticated users only)
app.delete('/books/review/:isbn', authenticateToken, (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;
  
  const book = books[isbn];
  
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  
  if (!book.reviews[username]) {
    return res.status(404).json({ message: "No review found for this user" });
  }
  
  delete book.reviews[username];
  
  res.json({ message: "Review deleted successfully" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Book Review API server running on http://localhost:${PORT}`);
});

module.exports = app;