// test_all.js - Complete test suite for all tasks
const axios = require('axios');

const BASE_URL = 'http://localhost:5000';
let authToken = '';

// Helper function to delay execution
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Test Task 1: Get all books
async function testGetAllBooks() {
  console.log('\n=== Task 1: Get All Books ===');
  try {
    const response = await axios.get(`${BASE_URL}/books`);
    console.log('✓ Success:', response.data);
    return true;
  } catch (error) {
    console.error('✗ Error:', error.message);
    return false;
  }
}

// Test Task 2: Get book by ISBN
async function testGetBookByISBN() {
  console.log('\n=== Task 2: Get Book by ISBN ===');
  try {
    const response = await axios.get(`${BASE_URL}/books/isbn/ISBN001`);
    console.log('✓ Success:', response.data);
    return true;
  } catch (error) {
    console.error('✗ Error:', error.message);
    return false;
  }
}

// Test Task 3: Get books by Author
async function testGetBooksByAuthor() {
  console.log('\n=== Task 3: Get Books by Author ===');
  try {
    const response = await axios.get(`${BASE_URL}/books/author/George Orwell`);
    console.log('✓ Success:', response.data);
    return true;
  } catch (error) {
    console.error('✗ Error:', error.message);
    return false;
  }
}

// Test Task 4: Get books by Title
async function testGetBooksByTitle() {
  console.log('\n=== Task 4: Get Books by Title ===');
  try {
    const response = await axios.get(`${BASE_URL}/books/title/1984`);
    console.log('✓ Success:', response.data);
    return true;
  } catch (error) {
    console.error('✗ Error:', error.message);
    return false;
  }
}

// Test Task 5: Get book reviews
async function testGetBookReviews() {
  console.log('\n=== Task 5: Get Book Reviews ===');
  try {
    const response = await axios.get(`${BASE_URL}/books/review/ISBN001`);
    console.log('✓ Success:', response.data);
    return true;
  } catch (error) {
    console.error('✗ Error:', error.message);
    return false;
  }
}

// Test Task 6: Register new user
async function testRegisterUser() {
  console.log('\n=== Task 6: Register New User ===');
  try {
    const response = await axios.post(`${BASE_URL}/register`, {
      username: 'testuser',
      password: 'testpass123'
    });
    console.log('✓ Success:', response.data);
    return true;
  } catch (error) {
    if (error.response && error.response.status === 409) {
      console.log('✓ User already exists (expected on subsequent runs)');
      return true;
    }
    console.error('✗ Error:', error.message);
    return false;
  }
}

// Test Task 7: Login user
async function testLoginUser() {
  console.log('\n=== Task 7: Login User ===');
  try {
    const response = await axios.post(`${BASE_URL}/login`, {
      username: 'testuser',
      password: 'testpass123'
    });
    authToken = response.data.token;
    console.log('✓ Success:', response.data);
    console.log('✓ Auth token received and saved');
    return true;
  } catch (error) {
    console.error('✗ Error:', error.message);
    return false;
  }
}

// Test Task 8: Add/Modify book review
async function testAddReview() {
  console.log('\n=== Task 8: Add/Modify Book Review ===');
  try {
    const response = await axios.put(
      `${BASE_URL}/books/review/ISBN001`,
      {
        review: 'An absolute masterpiece! A must-read classic.'
      },
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    console.log('✓ Success:', response.data);
    return true;
  } catch (error) {
    console.error('✗ Error:', error.response?.data || error.message);
    return false;
  }
}

// Test Task 9: Delete book review
async function testDeleteReview() {
  console.log('\n=== Task 9: Delete Book Review ===');
  try {
    const response = await axios.delete(
      `${BASE_URL}/books/review/ISBN001`,
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    console.log('✓ Success:', response.data);
    return true;
  } catch (error) {
    console.error('✗ Error:', error.response?.data || error.message);
    return false;
  }
}

// Test Task 10: Get all books using callback
function testGetAllBooksCallback() {
  return new Promise((resolve) => {
    console.log('\n=== Task 10: Get All Books (Callback) ===');
    
    const callback = (error, data) => {
      if (error) {
        console.error('✗ Error:', error.message);
        resolve(false);
      } else {
        console.log('✓ Success: Received', data.books.length, 'books');
        resolve(true);
      }
    };

    axios.get(`${BASE_URL}/books`)
      .then(response => callback(null, response.data))
      .catch(error => callback(error, null));
  });
}

// Test Task 11: Search by ISBN using Promises
function testSearchByISBNPromise() {
  console.log('\n=== Task 11: Search by ISBN (Promise) ===');
  
  return new Promise((resolve, reject) => {
    axios.get(`${BASE_URL}/books/isbn/ISBN002`)
      .then(response => {
        console.log('✓ Success:', response.data);
        resolve(true);
      })
      .catch(error => {
        console.error('✗ Error:', error.message);
        resolve(false);
      });
  });
}

// Test Task 12: Search by Author using async/await
async function testSearchByAuthorAsync() {
  console.log('\n=== Task 12: Search by Author (Async/Await) ===');
  try {
    const response = await axios.get(`${BASE_URL}/books/author/Harper Lee`);
    console.log('✓ Success:', response.data);
    return true;
  } catch (error) {
    console.error('✗ Error:', error.message);
    return false;
  }
}

// Test Task 13: Search by Title using async/await
async function testSearchByTitleAsync() {
  console.log('\n=== Task 13: Search by Title (Async/Await) ===');
  try {
    const response = await axios.get(`${BASE_URL}/books/title/Pride`);
    console.log('✓ Success:', response.data);
    return true;
  } catch (error) {
    console.error('✗ Error:', error.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   Book Review API - Complete Test Suite   ║');
  console.log('╚════════════════════════════════════════════╝');
  console.log('\nMake sure the server is running on http://localhost:5000\n');

  const results = [];

  // Public endpoint tests (Tasks 1-5)
  results.push(await testGetAllBooks());
  await delay(200);
  
  results.push(await testGetBookByISBN());
  await delay(200);
  
  results.push(await testGetBooksByAuthor());
  await delay(200);
  
  results.push(await testGetBooksByTitle());
  await delay(200);
  
  results.push(await testGetBookReviews());
  await delay(200);

  // User registration and authentication (Tasks 6-7)
  results.push(await testRegisterUser());
  await delay(200);
  
  results.push(await testLoginUser());
  await delay(200);

  // Protected endpoint tests (Tasks 8-9)
  if (authToken) {
    results.push(await testAddReview());
    await delay(200);
    
    results.push(await testDeleteReview());
    await delay(200);
  }

  // Node.js client tests (Tasks 10-13)
  results.push(await testGetAllBooksCallback());
  await delay(200);
  
  results.push(await testSearchByISBNPromise());
  await delay(200);
  
  results.push(await testSearchByAuthorAsync());
  await delay(200);
  
  results.push(await testSearchByTitleAsync());

  // Summary
  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║              Test Summary                  ║');
  console.log('╚════════════════════════════════════════════╝');
  const passed = results.filter(r => r).length;
  const total = results.length;
  console.log(`\nTests Passed: ${passed}/${total}`);
  
  if (passed === total) {
    console.log('✓ All tests passed! 🎉');
  } else {
    console.log(`✗ ${total - passed} test(s) failed`);
  }
}

// Run tests
runAllTests().catch(console.error);