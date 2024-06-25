const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
	if (users.length === 0) return true;

	const status = users.some((user) => user.username === username);

	// Since the some method returns true if it passes the test,
	// its return value is negated here.
	return !status;
};

const authenticatedUser = (username, password) => {
	const filteredUsers = users.filter((user) => {
		return user.username === username && user.password === password;
	});

	if (filteredUsers.length > 0) {
		return true;
	} else {
		return false;
	}
};

//only registered users can login
regd_users.post('/login', (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) {
		return res
			.status(404)
			.json({ message: 'Username and Password are both required' });
	}

	if (!authenticatedUser(username, password)) {
		return res
			.status(208)
			.json({ message: 'Invalid Login. Check username and password' });
	}

	const accessToken = jwt.sign(
		{
			data: password,
		},
		'access',
		{ expiresIn: 60 * 60 }
	);

	req.session.authorization = {
		accessToken,
		username,
	};

	return res.status(200).send('User successfully logged in');
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
	const { isbn } = req.params;
	const { username } = req.session.authorization;
	const userReview = req.body.review;

	books[isbn].reviews[username] = userReview;

	return res.status(200).json({
		message: `The review for the book with ISBN ${isbn} has been added/updated`,
	});
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
	const { isbn } = req.params;
	const { username } = req.session.authorization;

	delete books[isbn].reviews[username];

	return res.status(200).json({
		message: `The review for the book with ISBN ${isbn} has been deleted`,
	});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
