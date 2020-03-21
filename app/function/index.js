let Admin = require("../models/admin");
let cookie = require("cookie");

const userValid = (req, res, next) =>{
    consle.log("available soon");
}

const adminValid = (req, res, next) =>{
    let session = cookie.parse(req.headers.cookie || '');
	if (session != null){
		session = session.token;
		Admin.findOne({session}, (err, data)=>{
			if (err) throw console.error.bind(err);
			if (data){
				req.data = data;
				next();
			}else{
				res.status(302).redirect("/admin/login");		  
			}
		});	
	}else{
		res.status(302).redirect("/admin/login");
	}
};

module.exports = { userValid, adminValid };