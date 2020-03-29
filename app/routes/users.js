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
	let newNote = {
		name: req.body.name,
		desc: req.body.desc,
		creater: req.data._id,
		uid: null
	};

	newNote.uid = shortid.generate();
	
	Notes.create(newNote, async (err, data)=>{
		if (err) console.error.bind("Database error", err);
		await User.findByIdAndUpdate(newNote._id, { $push: { notes : data._id }});
		res.status(302).redirect(`/users/board/${newNote.uid}`);
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
	
	Card.create(card, async (err, data)=>{
		if (err) console.error.bind("New card creation DB error", err);
		await List.findOneAndUpdate({ uid: req.params.listId,  notesUid: req.params.noteId }, { $push: { cards: data._id } });
		validRes.data.creater = null;
		res.json(validRes);
	});
});

//list of all cards 
router.get("/cards/:noteId/:listId", (req, res, next)=>{
	List.findOne({ notesUid: req.params.noteId, uid: req.params.listId }, "cards").populate("cards").exec((err, data)=>{
		if (err) console.error.bind("Database error", err);
		validRes.data = data.cards;
		res.json(validRes);
	});
});

//adding new list in notes
router.post('/new/list/:uid', async (req, res, next)=>{
	let newList = {
		name: (req.body.name).trim(),
		uid: null,
		creater: req.data._id,
		notesUid: req.params.uid
	};

	newList.uid = shortid.generate();
	
	validRes.data = newList;

	List.create(newList, async (err, data)=>{
		if (err) console.error.bind("Database error", err);
		await Notes.findOneAndUpdate({ uid: newList.notesUid }, { $push: { lists: data._id } });
		validRes.data.creater = null;
		res.json(validRes);
	});
});

//archive the card
router.get("/card/archive/:uid", async (req, res, next)=>{
	await Card.findOneAndUpdate({ uid: req.params.uid }, {$set: {archive: true}});
	res.json(validRes);
});


module.exports = router;