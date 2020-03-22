let User = require("../model/users");

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

module.exports = { userValid };