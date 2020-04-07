//installed packages
let express = require('express');
let router = express.Router();
let bcrypt = require('bcryptjs');
let shortid = require('shortid');

//self-made
let { COOKIES_AGE, ERROR_MSG, validRes, ejsData } = require('../config');
let User = require('../database/model/users');
let { bodyDataValidCred, bodyDataValidJSON, checkURLDetailsPage, checkURLDetailsJSON } = require('../function');

//home page
router.get('/', (req, res)=>{
	console.log(req.statusCode)
	res.render('index');
});

//login & signup page
router.get('/login-signup', (req, res)=>{
	if (req.cookies.token != null && req.cookies.token != ''){
		User.findOne({ cookie: req.cookies.token }, "name", (err, userData)=>{
			if (err) console.error.bind("Database error", err);
			if (userData){
				req.session.regenerate((err)=>{
					if (err) console.error.bind("Session error", err);
					res.status(302).redirect("/users");
				});
			}else
				res.render('login-signup', ejsData);
		});
	}else {
        ejsData.msg = req.query.q;

		//ejsData.msg = ((ejsData.msg === "Invalid credentials") || (ejsData.msg === "Password and Confirm password not matched")) ? ejsData.msg: null;

		res.render('login-signup', ejsData);
	}
});

//user login
router.post('/login', bodyDataValidCred, (req, res)=>{
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
router.post('/signup', bodyDataValidCred, (req, res)=>{
	ERROR_MSG = "Password and Confirm Password are not same";
	
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

//forget password page
router.get('/forget-password', (req, res)=>{
	//need to implement
	res.render("forget-password", ejsData);
});

router.post('/forget-password', bodyDataValidJSON, (req, res)=>{
	//prcoess forget password
	/*
	find the email in the database
	generate new verification link & save to db
	send email to the user with link
	*/
	res.json(validRes);
});

router.get('/forget-password/code/:verificationCode', (req, res)=>{
	res.render('new-password', ejsData);
});

router.post('/forget-password/code/:verificationCode', bodyDataValidJSON, (req, res)=>{
	res.json(validRes);
});

//email verification page
router.get('/email/verification/:verifyCode', (req, res)=>{
	User.findOne({ verificationCode: req.params.verifyCode }, "email password", (err, data)=>{
		if (err) console.error.bind("DB error", err);
		ejsData.msg = (data) ? null: "Invalid URL";
		res.render('email-verify', ejsData);
	});
});

//email verification 
router.post('/email/verification/:verifyCode', bodyDataValidCred, (req, res)=>{
	res.json(validRes);
});

//logout user
router.get('/logout', (req, res)=>{
    if (req.cookies.token != null && req.cookies.token != ""){
        User.findOneAndUpdate({ cookie: req.cookies.token }, { $set: { cookie: null }}, (err, data)=>{
            if (err) console.error.bind("Database error", err);
            //console.log(data, req.cookies);
            req.session.regenerate((err)=>{
                if (err) console.error.bind("Session error", err);
                if (data){
                    ejsData.msg = "Logout Successfully";
                    ejsData.icon = "check_circle";
                    ejsData.color = "green";
                }
                res.cookie('token', '', { maxAge: 0 }).render('login-signup', ejsData);
            });
        });
    }else{
        res.render('login-signup', ejsData);
    }
});

module.exports = router;