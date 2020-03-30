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

/*

//get the list & card 
router.get('/board/lists/cards/:uid', validId, (req, res, next)=>{
	console.log(req.params);
	List.find({ notesUid: req.params.uid, creater: req.data._id }).populate("cards").exec((err, data)=>{
		if (err) console.error.bind("DB errror ", err);
		//remove _id before sending to front-end
		validRes.data = data;
		res.json(validRes);
	});
});

//inside board
router.get('/board/:uid', validId, (req, res, next)=>{
	Notes.findOne({ uid: req.params.uid }, "teamWork", (err, data)=>{
		if (err) console.error.bind("DB error", err);
		//generate get query if 'if' condition fail
		if (data && !(data.teamWork))
			res.render("board", { uid: req.params.uid, user: req.data });
		else
			res.status(302).render('/users');
	})
});

//creating new board
router.post('/new/board', async (req, res, next)=>{
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
router.post("/new/card/:noteId/:listId", validId, async (req, res, next)=>{
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
router.get("/cards/:noteId/:listId", validId, (req, res, next)=>{
	List.findOne({ notesUid: req.params.noteId, uid: req.params.listId }, "cards").populate("cards").exec((err, data)=>{
		if (err) console.error.bind("Database error", err);
		validRes.data = data.cards;
		res.json(validRes);
	});
});

//adding new list in notes
router.post('/new/list/:uid', validId, async (req, res, next)=>{
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
router.get("/card/archive/:uid", validId, async (req, res, next)=>{
	await Card.findOneAndUpdate({ uid: req.params.uid }, {$set: {archive: true}});
	res.json(validRes);
});

*/

module.exports = router;