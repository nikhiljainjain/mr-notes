let express = require('express');
let router = express.Router();
let { COOKIES_AGE, BTN_CTRL, ERROR_MSG } = require('../config');
let User = require('../model/users');
let bcrypt = require('bcryptjs');
let uuidv4 = require('uuid/v4');

//home page
router.get('/', function(req, res, next) {
	res.render('index', BTN_CTRL);
});

//login & signup page
router.get('/login-signup', (req, res, next)=>{
	if (req.query.q){
		res.render('login-signup', { msg: req.query.q});
	}else
		res.render('login-signup', { msg: null });
});

//user login
router.post('/login', (req, res, next)=>{
	ERROR_MSG = "Invalid credentials";
	
	let { email, password } = req.body;
	
	email = (email.trim()).toLowerCase();
	let cookie = uuidv4();
	
	User.findOneAndUpdate({ email }, { $set: { cookie }}, "password", (err, user)=>{
		if (err) console.error.bind('Database Error', err);
		if (user){
			//checking password
			let passwordMatch = bcrypt.compareSync(password, user.password);
			if (passwordMatch){
				
				res.setHeader('Set-Cookie', cookie.serialize('token', String(cookie), {
					maxAge: COOKIES_AGE,
					path: '/'
				}));
				res.status(302).redirect('/dashboard');
			}else
				res.status(302).redirect(`/login-signup?query=${ERROR_MSG}`);
		}else{
			res.status(302).redirect(`/login-signup?query=${ERROR_MSG}`);
		}
	});
});

//user registration
router.post('/signup', (req, res, next)=>{
	ERROR_MSG = "Password and Confirm password not matched";
	
	let { fname, lname, email, password, cpassword } = req.body;
	if (password === cpassword){
		let user = {
			name: ((fname + lname).toUpperCase()),
			email: ((email.trim()).toLowerCase()),
			password,
			cookie: null
		};	
		
		user.password = bcrypt.hashSync(password);
		
		user.cookie = uuidv4();
		
		res.setHeader('Set-Cookie', cookie.serialize('token', String(user.cookie), {
			maxAge: COOKIES_AGE,
			path: '/'
		}));
		
		User.create(user, (err)=>{
			if (err) console.error.bind('Database error', err);
			res.status(302).redirect('/dashboard');
		});
	}else
		res.status(302).redirect(`/login-signup?query=${ERROR_MSG}`);
});

//forget password
router.get('/forget', (req, res, next)=>{
	res.send("<h1>Available Soon</h1>");
});

//dashboard
router.get('/dashboard', (req, res, next)=>{
	res.send('<h1>Available soon</h1>');
});

module.exports = router;