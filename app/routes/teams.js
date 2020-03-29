//installed packages
let express = require('express');
let router = express.Router();
let shortid = require('shortid');

//self-made 
let { invalidRes, validRes } = require('../config');
let { userValid, validId } = require('../function');
let User = require('../model/users');
let Notes = require('../model/notes');
let List = require('../model/list');
let Card = require('../model/card');

//cookies validation
router.use(userValid);

//creating new tream board
router.post('/create/board', (req, res, next)=>{
	let newNote = {
		name: req.body.name,
		desc: req.body.desc,
		creater: req.data._id,
		teamWork: true,
		uid: null
	}; 
	newNote.uid = shortid.generate();
	
	Notes.create(newNote, async (err, data)=>{
		if (err) console.error.bind("Database error", err);
		await User.findByIdAndUpdate(req.data._id, { $push: { notes: data._id}});
		res.status(302).redirect(`/users/team/board/${uid}`);
	});
});

//inside board
router.get('/board/:uid', validId, (req, res, next)=>{
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
router.post('/add/member/:uid', validId, (req, res, next)=>{
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