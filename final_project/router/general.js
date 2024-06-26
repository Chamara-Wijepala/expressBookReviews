const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

public_users.post('/register', (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) {
		return res
			.status(400)
			.json({ message: 'Username and Password are both required' });
	}

	if (!isValid(username)) {
		return res.status(409).json({ message: 'Username already exists' });
	}

	users.push({ username, password });

	return res
		.status(200)
		.json({ message: `User ${username} successfully registered` });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
	const getAllBooks = new Promise((resolve, reject) => {
		resolve(books);
		reject('An error occurred');
	});

	getAllBooks
		.then((result) => res.status(200).json(result))
		.catch((err) => console.error(err));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
	const { isbn } = req.params;

	const getBookDetails = new Promise((resolve, reject) => {
		resolve(books[isbn]);
		reject('An error occurred');
	});

	getBookDetails
		.then((result) => res.status(200).json(result))
		.catch((err) => console.error(err));
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
	const { author } = req.params;

	const getBookByAuthor = new Promise((resolve, reject) => {
		for (const [key, value] of Object.entries(books)) {
			if (value.author === author) {
				resolve(value);
			}
		}

		reject('An error occurred');
	});

	getBookByAuthor
		.then((result) => res.status(200).json(result))
		.catch((err) => console.error(err));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
	const { title } = req.params;

	const getBookByTitle = new Promise((resolve, reject) => {
		for (const [key, value] of Object.entries(books)) {
			if (value.title === title) {
				resolve(value);
			}
		}

		reject('An error occurred');
	});

	getBookByTitle
		.then((result) => res.status(200).json(result))
		.catch((err) => console.error(err));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
	const { isbn } = req.params;
	const foundBook = books[isbn];

	return res.status(200).json(foundBook.reviews);
});

module.exports.general = public_users;
