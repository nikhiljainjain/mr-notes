let jwt = require("jsonwebtoken");
let shortid = require('shortid');

let User = require("../database/model/users");
let { COOKIES_AGE, COOKIE_PROP } = require('../config');

//user cookies validation
const cookieValid = (req, res, next) =>{
	console.log(req.cookies, req.session);

	//extracting cookies from req parameter
  	let cookie = req.cookies.token;
	if (cookie != null){
		try{
			//token validation from jwt
			cookie = jwt.verify(cookie, process.env.JWT_SECRET);
			cookie = cookie.token;

			req.session.reload(async err=>{
                if (err) console.log("Session error", err);
            
                //checking string already saved in session or not
                if(req.session.cookieToken === cookie){
                    //if save in session then retireve data user data and set on req.data
                    req.data = req.session.user;
                    next();
                }else{
                    //checking cookie value in db
                    const userData = await User.findOne({cookie});

                    console.log(req.cookies, userData, req.session);

                    if(userData){
                        //setting user data to request so it can use further no need of user fetch 
                        req.session.cookieToken = cookie;
                        req.session.user = userData;
                        req.data = userData;
                        next();
                    }else{
                        res.status(403).cookie('token', null, COOKIE_PROP).redirect("/login-signup");		  
                    }
                }
            });
		}catch(err){
			res.status(403).cookie('token', null, COOKIE_PROP).redirect("/login-signup");
		}	
	}else
		res.status(403).cookie('token', null, COOKIE_PROP).redirect("/login-signup");
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