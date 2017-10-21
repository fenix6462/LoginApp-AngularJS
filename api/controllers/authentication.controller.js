var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var User = require('../models/user.model');
var config = require('../../config/main');

var passportService = require('../../config/passport');
var passport = require('passport');

/*=====================================
=            Require login            =
=====================================*/

module.exports.requireAuth = passport.authenticate('jwt', { session: false });

/*=============================
=            Login            =
=============================*/

module.exports.login = function(req,res,next){
	var email = req.body.email;
	var password = req.body.password;

	// Return error if no email provided
	if (!email) {
		return res.status(422).send({ error: 'You must enter an email address.'});
	}

	// Return error if no password provided
	if (!password) {
		return res.status(422).send({ error: 'You must enter a password.' });
	}

	User.findOne({ email }, (err, user) => {
		if (err) { 
			return res.status(500).send(err);
		}
		if (!user) { 
			return res.status(404).send({ error: "User not found." });; 
		}

		user.comparePassword(password, (err, isMatch) => {
			if (err) { 
				return res.status(500).send(err);
			}

			if (!isMatch) {
				return res.status(401).send({ error: 'Incorrect password.' });
			}

			var newUser = {
				email: user.email,
				password: user.password,
				profile: { firstName: user.profile.firstName, lastName: user.profile.lastName }
			}

			var userInfo = setUserInfo(newUser);

			res.status(200).json({
				token: 'JWT ' + generateToken(userInfo),
				user: userInfo
			})
		});
	});
}

/*================================
=            Register            =
================================*/

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

/*======================================
=            Generate token            =
======================================*/

function generateToken(user){
	return jwt.sign(user, config.secret,{
		expiresIn: 10080
	})
}

/*=================================
=            User Info            =
=================================*/

function setUserInfo(request){
	return {
		_id: request._id,
		firstName: request.profile.firstName,
		lastName: request.profile.lastName,
		email: request.email,
		role: request.role,
	}
}