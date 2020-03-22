//installed packages
let express = require('express');
let router = express.Router();
let bcrypt = require('bcryptjs');
let shortid = require('shortid');

//self-made 
let { COOKIES_AGE, ERROR_MSG } = require('../config');
let User = require('../model/users');
let Notes = require('../model/notes');

//user home
router.get('/', (req, res, next)=>{
	res.render('home');
});

//
router.get('/new-board', (req, res, next)=>{
	res.send("let's do it");
});

//dashboard
router.get('/dashboard', (req, res, next)=>{
	res.send('<h1>Available soon</h1>');
});

module.exports = router;