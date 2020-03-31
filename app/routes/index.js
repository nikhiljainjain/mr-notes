//installed packages
let express = require('express');
let router = express.Router();
let bcrypt = require('bcryptjs');
let shortid = require('shortid');

//self-made
let { COOKIES_AGE, ERROR_MSG, validRes } = require('../config');
let User = require('../model/users');
let { userValid } = require('../function');

//home page
router.get('/', (req, res, next)=>{
	res.render('index');
});

//login & signup page
router.get('/login-signup', (req, res, next)=>{
    //data for toard
    let data = { 
        msg: null,
        icon: "cancel",
        color: "red"
    };

	if (req.cookies.token){
		User.findOne({ cookie: req.cookies.token }, "name", (err, data)=>{
			if (err) console.error.bind("Database error", err);
			if (data){
				req.session.regenerate((err)=>{
					if (err) console.error.bind("Session error", err);
					res.status(302).redirect("/users");
				});
			}else
				res.render('login-signup', data);
		});
	}else {

		data.msg = ((data.msg === "Invalid credentials") || (data.msg === "Password and Confirm password not matched") || ( data.msg === "Logout Successfully")) ? data.msg: null;

		if (data.msg === "Logout Successfully"){
			data.msg = req.query.q;
			data.icon = "check_circle";
			data.color = "green";
		}
		req.query.q = null;
		res.render('login-signup', data);
	}
});

//user login
router.post('/login', (req, res, next)=>{
	ERROR_MSG = 'Invalid credentials';
	
	let { email, password } = req.body;
	
	email = (email.trim()).toLowerCase();
	let cookie = shortid.generate();
	
	User.findOneAndUpdate({ email }, { $set: { cookie }}, (err, user)=>{
		if (err) console.error.bind('Database Error', err);
		if (user){
			//checking password
			let passwordMatch = bcrypt.compareSync(password, user.password);
			if (passwordMatch){
				req.session.regenerate((err)=>{
					if (err) console.error.bind("Session error", err);
					res.cookie('token', cookie, { maxAge: COOKIES_AGE, path: '/' }).status(302).redirect('/users');
				});
			}else
				res.status(302).redirect(`/login-signup?q=${ERROR_MSG}`);
		}else
			res.status(302).redirect(`/login-signup?q=${ERROR_MSG}`);
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
			//to do -> error handling for error code 11000
			req.session.regenerate((err)=>{
				if (err) console.error.bind("Session error", err);
				res.cookie('token', user.cookie, { maxAge: COOKIES_AGE, path: '/' }).status(302).redirect('/users');
			});
		});
	}else
		res.status(302).redirect(`/login-signup?q=${ERROR_MSG}`);
});

//forget password
router.get('/forget-password', (req, res, next)=>{
	//need to implement
	res.render("forget-password");
});

//email verification page
router.get('/email/verification/:verifyCode', (req, res, next)=>{
	let data = { 
		msg: "Invalid URL",
		icon: "cancel",
		color: "red"
	};
	User.findOne({ verificationCode: req.params.verifyCode }, "email password", (err, data)=>{
		if (err) console.error.bind("DB error", err);
		if (data)
			data.msg = null;
		res.render('email-verify', data);
	});
});

//email verification 
router.post('/email/verification/:verifyCode', (req, res, next)=>{
	res.json(validRes);
});

//logout user
router.get('/logout', (req, res, next)=>{
	User.findOneAndUpdate({ cookie: req.cookies.token }, { $set: { cookie: null }}, (err, data)=>{
		if (err) console.error.bind("Database error", err);
		//console.log(data, req.cookies);
		req.session.regenerate((err)=>{
			if (err) console.error.bind("Session error", err);
			if (data)
				res.cookie('token', '', { maxAge: 0 }).status(302).redirect('/login-signup?q=Logout Successfully');
			else	
				res.status(302).redirect('/login-signup');
		});
	});
});

module.exports = router;