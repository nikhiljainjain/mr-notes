//installed packages
let express = require('express');
let router = express.Router();
let shortid = require('shortid');

//self-made 
let {  ERROR_MSG, invalidRes, validRes } = require('../config');
let { userValid } = require('../function');
let User = require('../model/users');
let Notes = require('../model/notes');
let List = require('../model/list');
let Card = require('../model/card');

//cookies validation
router.use(userValid);

//creating new tream board
router.post('/create/board', (req, res, next)=>{
	let { name, desc } = req.body;
	
	let { notes, _id } = req.data; 
	let uid = shortid.generate();
	
	Notes.create({ name, desc, creater: _id, uid, teamWork: true }, (err, data)=>{
		if (err) console.error.bind("Database error", err);
		
		User.findByIdAndUpdate(req.data._id, {$push: {notes: data._id}}, (err, newData)=>{
			if (err) console.error.bind('Database error', err);
		});
		res.status(302).redirect(`/users/team/board/${uid}`);
	});
});

//inside board
router.get('/board/:uid', (req, res, next)=>{
	Notes.findOne({ uid: req.params.uid }, "teamWork", (err, data)=>{
		if (err) console.error.bind("DB error", err);
		//checking if board really a team board or not
		if (data.teamWork)
			res.render("team", { uid: req.params.uid, user: req.data });
		else
			res.status(302).redirect('/users');
	});
});

//adding new member
router.post('/add/member/:uid', (req, res, next)=>{
	/*
	Checking if adder email id isn't same of new member email id
	*/
	if (req.body.email !== req.data.email){
		User.findOne({email: req.body.email}, "email", (err, userData)=>{
			if (err) console.error.bind("Database error", err);
			//console.log(userData);
			if (userData){
				Notes.findOneAndUpdate({ uid: req.params.uid }, {$push: { members: userData._id }}, (err, data)=>{
					if (err) console.error.bind("Database error", err);
					//console.log(data);
					res.json((data) ? validRes: invalidRes);
					if (data)
						User.findByIdAndUpdate(userData._id, { $push: { notes: data._id } }, (err, updateData)=>{
							if (err) console.error.bind("Database error", err);
							//console.log(updateData);
						});				
				});
			}else
				res.json(invalidRes);
		});
	}else{
		res.json(invalidRes);
	}	
});

module.exports = router;