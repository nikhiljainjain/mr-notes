//installed packages
let express = require('express');
let router = express.Router();
let bcrypt = require('bcryptjs');

//self-made
let User = require('../database/model/users');
let { COOKIES_AGE, ERROR_MSG, validRes, ejsData, COOKIE_PROP } = require('../config');
const { bodyDataValidCred, bodyDataValidJSON } = require('../function');
const { jwtCreate } = require("../function/cookies"); 

//home page
router.get('/', (req, res)=>res.render('index'));

//rendering login & signup page
router.get('/login-signup', (req, res)=>{
	//taking query and display to front end
	if (req.query.q){
		ejsData.msg = req.query.q;
		ejsData.color = (req.query.color) ? "green" : "red";
		ejsData.icon = (req.query.color) ? "check_circle":"cancel";
		req.query.q = null;
	}

	//removing token cookie if exist
	if (req.cookies.token){
		res.cookie("token", "", { maxAge: 0}).render('login-signup', ejsData);
	}else{
		res.render("login-signup", ejsData);
	}
});

router.get('/login', (req, res)=>res.status(302).redirect("/login-signup"));

router.get('/signup', (req, res)=>res.status(302).redirect("/login-signup"));


//user login
router.post('/login', bodyDataValidCred, jwtCreate, (req, res)=>{
	//creating session variable to limit the login attempt
	if (req.cookies.count || (req.session.loginCount && req.session.loginCount > 5)){
		ERROR_MSG = "Try After 24Hours";
		//restricting user for 24 hour to login attempt
		return res.cookie('count', "dont", { maxAge: (COOKIES_AGE/400) }).status(302).redirect(`/login-signup?q=${ERROR_MSG}`);
	}else{
		ERROR_MSG = 'Invalid credentials';
	
		let { email, password } = req.body;
		
		//initiating login attempts
		if (!req.session.loginCount)
			req.session.loginCount = 1;
		else{
			//increase login attempts
			req.session.loginCount++;
		}
		
		email = email.toLowerCase();
		//finding user in db
		User.findOne({ email }, "password", async (err, user)=>{
			if (err) console.error.bind('Database Error', err);
			//console.log("User=", user);
			if (user && bcrypt.compareSync(password, user.password)){
				//setting cookies in db
				user.set({ cookie: req.data.token });
				await user.save()
				//sending response
				return res.cookie('token', req.data.jwt, COOKIE_PROP).status(302).redirect('/users');
			}else{
				req.session.loginCount++;
				return res.status(302).redirect(`/login-signup?q=${ERROR_MSG}`);
			}
		});
	}
});

//user registration
router.post('/signup', bodyDataValidCred, jwtCreate, async (req, res)=>{
	ERROR_MSG = "Password and Confirm Password are not same";
	//console.log(req.body, req.ip);
	if (req.body.password == req.body.cpassword){

		try{
			delete req.body.cpassword

			let newUser = {
				...req.body,
				cookie: req.data.token,
				ipAddress: req.ip, 
				verificationCode: null
			};
			//hashing password
			newUser.password = bcrypt.hashSync(req.body.password);
			//creating new user for the data
			newUser = new User(newUser);

			//console.log(newUser, req.data);

			//sending email to user and email verification process will start
			await newUser.save();
			return res.cookie('token', req.data.jwt, COOKIE_PROP).status(302).redirect('/users');
			
		}catch(err){
			console.log("ERROR", err);
			if(err.code == 11000){
				ERROR_MSG = "User Already Exist";
				return res.redirect(`/login-signup?q=${ERROR_MSG}&color=green`);
			}else{
				ERROR_MSG = "SOMETHING HAPPENING WRONG";
				return res.redirect(`/login-signup?q=${ERROR_MSG}`);
			}
		}
	}else
		return res.status(302).redirect(`/login-signup?q=${ERROR_MSG}`);
});

//forget password page
router.get('/forget-password', (req, res)=>res.render("forget-password", ejsData));

router.post('/forget-password', bodyDataValidJSON, (req, res)=>{
	//prcoess forget password
	/*
	find the email in the database
	generate new verification link & save to db
	send email to the user with link
	*/
	res.json(validRes);
});

router.get('/forget-password/code/:verificationCode', (req, res)=>res.render('new-password', ejsData));

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