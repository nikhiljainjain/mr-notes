//installed packages
let express = require('express');
let router = express.Router();
let bcrypt = require('bcryptjs');
let shortid = require('shortid');

//self-made
let { COOKIES_AGE, BTN_CTRL, ERROR_MSG } = require('../config');
let User = require('../model/users');

//home page
router.get('/', function(req, res, next) {
	res.render('index');
});

//login & signup page
router.get('/login-signup', (req, res, next)=>{
	res.render('login-signup', { msg: ((req.query.q) ? req.query.q : null)});
});

//user login
router.post('/login', (req, res, next)=>{
	ERROR_MSG = "Invalid credentials";
	
	let { email, password } = req.body;
	
	email = (email.trim()).toLowerCase();
	let cookie = shortid.generate();
	
	User.findOneAndUpdate({ email }, { $set: { cookie }}, (err, user)=>{
		if (err) console.error.bind('Database Error', err);
		if (user){
			//checking password
			let passwordMatch = bcrypt.compareSync(password, user.password);
			if (passwordMatch){
				res.cookie('token', cookie, { maxAge: COOKIES_AGE }).status(302).redirect('/users');
			}else
				res.status(302).redirect(`/login-signup?q=${ERROR_MSG}`);
		}else{
			res.status(302).redirect(`/login-signup?q=${ERROR_MSG}`);
		}
	});
});

//user registration
router.post('/signup', (req, res, next)=>{
	ERROR_MSG = "Password and Confirm password not matched";
	
	let { fname, lname, email, password, cpassword } = req.body;
	if (password === cpassword){
		let user = {
			name: ((fname +" "+ lname).toUpperCase()),
			email: ((email.trim()).toLowerCase()),
			password,
			cookie: null
		};	
		
		user.password = bcrypt.hashSync(password);
		
		user.cookie = shortid.generate();
		
		User.create(user, (err)=>{
			if (err) console.error.bind('Database error', err);
			res.cookie('token', user.cookie, { maxAge: COOKIES_AGE, path: '/' }).status(302).redirect('/users');
		});
	}else
		res.status(302).redirect(`/login-signup?q=${ERROR_MSG}`);
});

//forget password
router.get('/forget', (req, res, next)=>{
	res.send("<h1>Available Soon</h1>");
});

//logout user
router.get('/logout', (req, res, next)=>{
	//remove from db
	res.clearCookie('token').status(302).redirect('/');
});

module.exports = router;