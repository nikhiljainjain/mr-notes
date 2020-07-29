//installed packages
const express = require('express');
const router = express.Router();

const { isEmail } = require("validator");

//self-made
let User = require('../database/model/users');
let { validRes, COOKIE_PROP, invalidRes } = require('../config');
const { bodyDataValidCred, bodyDataValidJSON } = require('../function');
const { jwtCreate, cookieValid } = require("../function/cookies"); 
const { sendOTPEmail } = require("../function/email");
const { otpGeneration,  } = require("../function/otp");
const { loadErrorPage } = require("../function/errorHandling");
const { cookieUidGenerator } = require("../function/codeGenerator");

//home page
router.get('/', (req, res)=>res.render('index'));

router.use((req, res, next)=>{
	res.locals = {
		msg: null
	};
	next();
});

/**
 * @description => render login page
 */
router.get("/login", async(req, res)=>res.render("login"));

/**
 * Custom Login
 * @param {string} req.body.email The email of the user
 */
router.post("/login", bodyDataValidCred, jwtCreate, async (req, res) => {
	try{
		const { email } = req.body;

		//valid email address
		if(!isEmail(email)) throw "INVALID EMAIL ID";
			
		//finding user  
		let userRecord = await User.findOne({ email });

		//The user does not exist
		// if (!userRecord){
		// 	//new User object
		// 	let newUser = new User({ email });
		// 	newUser.inviteFriendUid = inviteFriendUidGenerator();
		// 	userRecord = await newUser.save();
		// } 

		// //generating randomstring for token
		// userRecord.cookie = res.locals.token;

		// //genearting otp for email verification
		// userRecord.set({ otp:{
		// 	number : otpGeneration(),
		// 	medium : "EMAIL",
		// 	attempts: 0,	
		// 	lastAttempt : Date.now()
		// }});

		// req.session = userRecord;

		// sendOTPEmail(userRecord);
		// await userRecord.save();

		res.locals.msg = "We have Sent OTP to Your Account";
		//return res.cookie("token", res.locals.jwt, COOKIE_PROP)
		res.render("otp", res.locals);
	}catch(error){
	  	loadErrorPage(error, res);
  	}
});

router.use(cookieValid);

/**
 * this route defined, if sms not reached to user mobile
 * they request again from app for new otp
 */
router.get("/otp/send/again", async (req, res)=>{
	try{
        let falseOrUserDataObject = await createOTPAgain(res.locals);

		//!production_env ? console.log(falseOrUserDataObject, res.locals):null;

        //if users reached to it's maxium number of attempts
        if (!falseOrUserDataObject) throw "Try Again After 24Hours";
		
		//write code here to send otp again base on medium
		//code for sending otp to user
		sendOTPEmail(falseOrUserDataObject);

		//saving data to db
		await falseOrUserDataObject.save();

		//sending otp to response when not in production mode
		res.locals.msg = "OTP SENT AGAIN";
		return res.render("otp", res.locals);
    }catch(err){
		loadErrorPage(err, res);
    }
});

/**
 * @description => verify otp send to email
 * 
 * @param {Number} req.body.otp => otp receive by the user
 */
router.post('/verify/otp', bodyDataValidJSON, async (req, res)=>{
	try{
		//verify otp number is valid & send to a user
        let otpStatusFailOrUserObject = await verifyOTPNumber(res.locals, req.body.otpNumber);

        //if otp is not send to any user then
		if (!otpStatusFailOrUserObject){
			//updating number of attempts
			await User.findByIdAndUpdate(res.locals._id, {$inc:{"otp.attempts": 1}});

			throw "INVALID OTP";
		}else if (typeof(otpStatusFailOrUserObject) == "string") throw otpStatusFailOrUserObject;
		else{
            //generating payload & cookie for next steps
            let cookie = {
                token: cookieUidGenerator(),
                jwt: null
            }

            //generating jwt payload
            jwtGenerateLoginToken({ token: cookie.token }).then(async jwtToken =>{
                //console.log("JWT TOKEN=", jwtToken);
                cookie.jwt = jwtToken;

				//setting cookie value to user object receive at otp verificaiton
				res.locals.otp = otpStatusFailOrUserObject.otp;
				res.locals.cookie = cookie.token;

                //console.log("User Data=", otpStatusFailOrUserObject, "\nCookie=", cookie);
                await res.locals.save();

				res.cookie("token", cookie.jwt, COOKIE_PROP);

				if (!res.locals.name)
					return res.render("/add/profile");

                return res.status(302).render("/users");
            });
        }
	}catch(err){
		loadErrorPage(err, res);
	}
});

router.get("/add/profile", async(req, res)=>res.render('signup'));

router.post("/add/profile", async(req, res)=>{
	try{
		console.log(req.body);
		return res.redirect("/users", res.locals);
	}catch(error){
		loadErrorPage(error, res);
	}
});

module.exports = router;
