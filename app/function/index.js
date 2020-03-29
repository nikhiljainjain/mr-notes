let User = require("../model/users");
let shortid = require('shortid');
let { invalidRes } = require('../config');

const userValid = (req, res, next) =>{
  	let cookie = req.cookies.token;
	if (cookie != null){
		User.findOne({cookie}).populate("notes").exec((err, data)=>{
			if (err) throw console.error.bind(err);
			if (data){
				req.data = data;
				next();
			}else
				res.status(302).redirect("/login-signup");		  
		});	
	}else
		res.status(302).redirect("/login-signup");
};

const validId = (req, res, next) => {
	let flag = true, i;
	//console.log(req.params);
	for(i in req.params){
		//console.log(shortid.isValid(req.params[`${i}`]), req.params[`${i}`]);
		flag = (shortid.isValid(req.params[`${i}`])) ? true: false;
	}
	//console.log(flag);
	flag ? next():res.json(invalidRes);
};

module.exports = { userValid, validId };