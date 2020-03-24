//installed packages
let express = require('express');
let router = express.Router();
let bcrypt = require('bcryptjs');
let shortid = require('shortid');

//self-made 
let { COOKIES_AGE, ERROR_MSG, invalidRes, validRes } = require('../config');
let { userValid } = require('../function');
let User = require('../model/users');
let Notes = require('../model/notes');
let List = require('../model/list');
let Card = require('../model/card');

//cookies validation
router.use(userValid);

//user home
router.get('/', (req, res, next)=>{
	res.render('home', { notes: req.data.notes, user: req.data });
});

//get the list & card 
router.get('/board/lists/cards/:uid', (req, res, next)=>{
	//remove _id before sending to front-end
	List.find({ notesUid: req.params.uid }).populate("cards").exec((err, data)=>{
		if (err) console.error.bind("DB errror ", err);
		validRes.data = data;
		res.json(validRes);
	});
});

//inside board
router.get('/board/:uid', (req, res, next)=>{
	res.render("board", { uid: req.params.uid, user: req.data });
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
			//console.log(newData);
		});
		res.status(302).redirect(`/users/board/${uid}`);
	});
});

//adding new card
router.post("/new/card/:noteId/:listId", (req, res, next)=>{
	let card = {
		uid: null,
		desc: req.body.desc,
		dueDate: null,
		creater: req.data._id,	
	};
	
	card.uid = shortid.generate();
	card.dueDate = (req.body.time != '') ? (new Date(req.body.time)):null;
	validRes.data = card;
	
	Card.create(card, (err, data)=>{
		if (err) console.error.bind("New card creation DB error", err);
		List.findOneAndUpdate({ uid: req.params.listId,  notesUid: req.params.noteId }, { $push: { cards: data._id } }, (err, newList)=>{
			if (err) console.error.bind("NC List DB error", err);
			validRes.data.creater = null;
			res.json(validRes);
		});
	});
});

//list of all cards 
router.get("/cards/:noteId/:listId", (req, res, next)=>{
	List.findOne({ notesUid: req.params.noteId, uid: req.params.listId }, "cards").populate("cards").exec((err, data)=>{
		if (err) console.error.bind("Database error", err);
		//console.log(data.cards);
		res.json({ data: data.cards });
	});
});

//adding new list in notes
router.post('/new/list/:uid', (req, res, next)=>{
	let newList = {
		name: (req.body.name).trim(),
		uid: null,
		creater: req.data._id,
		notesUid: req.params.uid
	};

	newList.uid = shortid.generate();
	
	validRes.data = newList;

	List.create({ name, uid, creater: _id, notesUid: temp.uid }, (err, data)=>{
		if (err) console.error.bind("Database error", err);
		Notes.findByIdAndUpdate(temp._id, { $push: { lists: data._id } }, (err)=>{
			if (err) console.error.bind("Database error", err);
			//validRes.data.creater = null;
			validRes.data.creater = null;
			res.json(validRes);
		});
	});
});

//archive the card
router.get("/card/archive/:uid", (req, res, next)=>{
	Card.findOneAndUpdate({ uid: req.params.uid }, {$set: {archive: true}}, (err, data)=>{
		if (err) console.error.bind("Database error", err);
		res.json(validRes);
	});
});

//team work

//creating new tream board
router.post('/create/team/board', (req, res, next)=>{
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
router.get('/team/board/:uid', (req, res, next)=>{
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
router.post('/team/add/member/:uid', (req, res, next)=>{
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