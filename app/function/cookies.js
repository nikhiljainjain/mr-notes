let jwt = require("jsonwebtoken");

let User = require("../database/model/users");
let { invalidRes, COOKIES_AGE, COOKIE_PROP } = require('../config');
const { cookieUidGenerator } = require("./codeGenerator");

//user cookies validation
const cookieValid = async (req, res, next) =>{
	//console.log(req.session, req.cookies);
	//extracting cookies from req parameter
	//checking token in headers for app
    let cookie = req.cookies.token || req.headers.token;
      
	if (cookie){
        //try catch defined for jwt error  if something wrong happened with jwt
        try{
            //token validation from jwt
            cookie = jwt.verify(cookie, process.env.JWT_SECRET);
            cookie = cookie.token;
            
            //console.log(res.locals, req.session, req.cookies);

            if(req.session.cookieToken === cookie){
                res.locals = res.locals = req.session.user;
                next();
            }else{
                const userData = await User.findOne({cookie});

                //console.log(req.cookies, userData, req.session);

                if(userData){
                    req.session.cookieToken = cookie;
                    req.session.user = userData;
                    res.locals = res.locals = userData;
                    next();
                }else{
                    res.status(403).cookie('token', null, COOKIE_PROP).redirect('/login');
                }
            }
        }catch(err){
            res.status(302).cookie('token', null, COOKIE_PROP).redirect('/login');
        }
	}else{
		res.status(403).cookie('token', null, COOKIE_PROP).redirect('/login');
	}
};

/**
 * for token a random string is generated using library randomstring
 * generating jwt token with expiration time defined in cookies_age
 *
 * this function works as middleware & generate random string & token save into res.locals
 */
const jwtCreate = (req, res, next) =>{
    const expiresIn = (COOKIES_AGE/1000);
    res.locals = {
        token: null,
        jwt: null
    };
	res.locals.token = cookieUidGenerator();
    res.locals.jwt = jwt.sign({ token: res.locals.token }, process.env.JWT_SECRET, { expiresIn });
    next();
};

module.exports = { jwtCreate, cookieValid };