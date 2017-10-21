var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var User = require('../models/user.model');
var config = require('../../config/main');

//========================================
// Get Profile
//========================================

module.exports.getProfile = function(req,res,next){
	User.findOne({ email: req.user.email }, function(err, user){
		if (err) { 
			return res.status(500).send(err);
		}
		if (!user) { 
			return res.status(404).send({ error: "User not found." });; 
		}
		res.status(200).json(user);
	})
}