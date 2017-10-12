var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var User = require('../models/user');
var config = require('../config/main');

function generateToken(user){
	return jwt.sign(user, config.secret,{
		expiresIn: 10080
	})
}

function setUserInfo(request){
	return {
		_id: request._id,
		firstName: request.profile.firstName,
		lastName: request.profile.lastName,
		email: request.email,
		role: request.role,
	}
}

//========================================
// Login Route
//========================================

module.exports.login = function(req,res,next){
	var userInfo = setUserInfo(req.user);

	res.status(200).json({
		token: 'JWT ' + generateToken(userInfo),
		user: userInfo
	})
}

//========================================
// Registration Route
//========================================

module.exports.register = function(req,res,next){
	var email = req.body.email;
	var firstName = req.body.firstName;
	var lastName = req.body.lastName;
	var password = req.body.password;

	// Return error if no email provided
	if (!email) {
		return res.status(422).send({ error: 'You must enter an email address.'});
	}

	// Return error if full name not provided
	if (!firstName || !lastName) {
		return res.status(422).send({ error: 'You must enter your full name.'});
	}

	// Return error if no password provided
	if (!password) {
		return res.status(422).send({ error: 'You must enter a password.' });
	}

	User.findOne({email: email}, function(err, user){
		if(err){
			return next(err);
		}
		// If user is not unique, return error
		if (user) {
			return res.status(422).send({ error: 'That email address is already in use.' });
		}

		// If email is unique and password was provided, create account
		var newUser = new User({
			email: email,
			password: password,
			profile: { firstName: firstName, lastName: lastName }
		});

		newUser.save(function(err, newUser){
			if(err){
				return next(err);
			}

			var userInfo = setUserInfo(newUser);

			res.status(201).json({
				token: 'JWT ' + generateToken(userInfo),
				user: userInfo
			})
		})
	})
}