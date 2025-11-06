// client.js - Node.js Client using Axios with Async/Await and Promises
const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

// Task 10: Get all books - Using async callback function
function getAllBooks(callback) {
  axios.get(`${BASE_URL}/books`)
    .then(response => {
      callback(null, response.data);
    })
    .catch(error => {
      callback(error, null);
    });
}

// Task 11: Search by ISBN - Using Promises
function searchByISBN(isbn) {
  return new Promise((resolve, reject) => {
    axios.get(`${BASE_URL}/books/isbn/${isbn}`)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
}

// Task 12: Search by Author - Using Async/Await
async function searchByAuthor(author) {
  try {
    const response = await axios.get(`${BASE_URL}/books/author/${author}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Task 13: Search by Title - Using Async/Await
async function searchByTitle(title) {
  try {
    const response = await axios.get(`${BASE_URL}/books/title/${title}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Demo/Test functions
async function runTests() {
  console.log('=== Book Review API Client Tests ===\n');

  // Test Task 10: Get all books using callback
  console.log('Task 10: Getting all books (using callback)...');
  getAllBooks((error, data) => {
    if (error) {
      console.error('Error:', error.message);
    } else {
      console.log('All Books:', JSON.stringify(data, null, 2));
    }
  });

  // Wait a bit for callback to complete
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Test Task 11: Search by ISBN using Promises
  console.log('\nTask 11: Searching by ISBN (using Promises)...');
  searchByISBN('ISBN001')
    .then(data => {
      console.log('Book found:', JSON.stringify(data, null, 2));
    })
    .catch(error => {
      console.error('Error:', error.message);
    });

  await new Promise(resolve => setTimeout(resolve, 1000));

  // Test Task 12: Search by Author using async/await
  console.log('\nTask 12: Searching by Author (using async/await)...');
  try {
    const authorBooks = await searchByAuthor('George Orwell');
    console.log('Books by author:', JSON.stringify(authorBooks, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }

  // Test Task 13: Search by Title using async/await
  console.log('\nTask 13: Searching by Title (using async/await)...');
  try {
    const titleBooks = await searchByTitle('1984');
    console.log('Books by title:', JSON.stringify(titleBooks, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Export functions for use in other modules
module.exports = {
  getAllBooks,
  searchByISBN,
  searchByAuthor,
  searchByTitle
};

// Run tests if this file is executed directly
if (require.main === module) {
  console.log('Make sure the server is running on http://localhost:5000\n');
  runTests();
}