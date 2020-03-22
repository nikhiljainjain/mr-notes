//installed packages
let express = require('express');
let router = express.Router();
let bcrypt = require('bcryptjs');
let shortid = require('shortid');

//self-made 
let { COOKIES_AGE, ERROR_MSG } = require('../config');
let { userValid } = require('../function');
let User = require('../model/users');
let Notes = require('../model/notes');
let List = require('../model/list');
let Card = require('../model/card');

//cookies validation
router.use(userValid);

//user home
router.get('/', (req, res, next)=>{
	res.render('home');
});

//creating new board
router.post('/new/board', (req, res, next)=>{
	console.log(req.body);
	let { name, desc } = req.body;
	Notes.create({ name, desc, creater: req.data._id }, (err)=>{
		if (err) console.error.bind("Database error", err);
	});
	res.send("let's do it");
});

//dashboard
router.get('/dashboard', (req, res, next)=>{
	res.send('<h1>Available soon</h1>');
});

module.exports = router;