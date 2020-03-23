//installed packages
let express = require('express');
let router = express.Router();
let bcrypt = require('bcryptjs');
let shortid = require('shortid');

//self-made 
let { COOKIES_AGE, ERROR_MSG } = require('../config');
let { userValid } = require('../function');
let User = require('../model/users');
let Notes = require('../model/notes');
let List = require('../model/list');
let Card = require('../model/card');

//cookies validation
router.use(userValid);

//user home
router.get('/', (req, res, next)=>{
	res.render('home', { notes: req.data.notes });
});

//get the list & card 
router.get('/board/lists/cards/:uid', (req, res, next)=>{
	//remove _id before sending to front-end
	List.find({ notesUid: req.params.uid}).populate("cards").exec((err, data)=>{
		if (err) console.error.bind("DB errror on inside board", err);
		res.json({data});
	});
});

//inside board
router.get('/board/:uid', (req, res, next)=>{
	res.render("board", { uid: req.params.uid });
});

//creating new board
router.post('/new/board', (req, res, next)=>{
	let { name, desc } = req.body;
	
	let { notes, _id } = req.data; 
	let uid = shortid.generate();
	
	Notes.create({ name, desc, creater: _id, uid }, (err, data)=>{
		if (err) console.error.bind("Database error", err);
		notes.push(data._id);
		User.findByIdAndUpdate(req.data._id, {$set: {notes}}, (err, newData)=>{
			if (err) console.error.bind('Database error', err);
			console.log(newData);
		});
		res.status(302).redirect(`/users/board/${uid}`);
	});
});

//adding new list in notes
router.post('/new/list/:uid', (req, res, next)=>{
	let { name } = req.body;
	
	let uid = shortid.generate();
	let { notes, _id } = req.data;
	
	let temp = null;
	notes.forEach((i)=>{
		temp = (i.uid == req.params.uid) ? i : temp;
	});
	
	List.create({ name, uid, creater: _id, notesUid: temp.uid }, (err, data)=>{
		if (err) console.error.bind("Database error", err);
		//console.log(data);
		temp.lists.push(data._id);
		Notes.findByIdAndUpdate(temp._id, {$set: { lists: temp.lists }}, (err)=>{
			if (err) console.error.bind("Database error", err);
			res.send("OK");
		});
	});
});

module.exports = router;