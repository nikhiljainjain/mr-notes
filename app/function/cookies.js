let jwt = require("jsonwebtoken");
let shortid = require('shortid');

let User = require("../database/model/users");
let { invalidRes, COOKIES_AGE } = require('../config');

//user cookies validation
const cookieValid = (req, res, next) =>{
	//console.log("COOKIE PART")
	//extracting cookies from req parameter
  	let cookie = req.cookies.token;
	if (cookie != null){
		try{
			//token validation from jwt
			cookie = jwt.verify(cookie, process.env.JWT_SECRET);
			cookie = cookie.token;
			//console.log(cookie)
			/*.populate("notes")*/
			User.findOne({cookie}).exec((err, data)=>{
				console.log(data);
				if (err) console.error.bind(err);
				if (data){
					req.data = data;
					//calling next process
					next();
				}else
					res.status(302).redirect("/login-signup");		  
			});
		}catch(err){	
			res.status(302).redirect("/login-signup");
		}	
	}else
		res.status(302).redirect("/login-signup");
};

/**
 * for token a random string is generated using library randomstring
 * generating jwt token with expiration time defined in cookies_age
 *
 * this function works as middleware & generate random string & token save into req.data
 */
const jwtCreate = (req, res, next) =>{
    const expiresIn = (COOKIES_AGE/1000);
    req.data = {
        token: null,
        jwt: null
    };
	req.data.token = shortid.generate();
    req.data.jwt = jwt.sign({ token: req.data.token }, process.env.JWT_SECRET, { expiresIn });
    next();
};

module.exports = { jwtCreate, cookieValid };