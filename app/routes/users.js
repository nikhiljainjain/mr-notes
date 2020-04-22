//installed packages
let express = require('express');
let router = express.Router();
let shortid = require('shortid');

//self-made
let { validRes, invalidRes, ejsData } = require('../config');
let { bodyDataValidJSON, cookieValid, validId } = require('../function');
let User = require('../database/model/users');
let Notes = require('../database/model/notes');
let List = require('../database/model/list');
let Card = require('../database/model/card');

//cookies validation
router.use(cookieValid);

//user home
router.get('/', (req, res)=>{
	User.findById(req.data._id, "notes").populate("notes").sort("name").exec((err, data)=>{
		if (err) console.error.bind("DB error", err);
		data.notes.forEach((i)=>{
			i._id = null;
		});
		//console.log("Users data", data.notes.length, data.notes);
		ejsData.notes = data.notes;
		ejsData.user = req.data;
		res.render('home', ejsData);
	});
});

//get the list & card
router.get('/board/lists/cards/:uid', validId, (req, res)=>{
	//in find query add attribute -> archive: false
	List.find({ notesUid: req.params.uid }, "name cards archive uid").populate("cards").exec((err, data)=>{
		if (err) console.error.bind("DB errror ", err);
		data.forEach((i)=>{
			i._id = null;
			i.cards.forEach((j)=>{
				j._id = null;
			});
		});
		validRes.data = data;
		res.json(validRes);
	});
});

//inside board
router.get('/board/:uid', validId, (req, res)=>{
	Notes.findOne({ uid: req.params.uid }, "name teamWork", (err, data)=>{
		if (err) console.error.bind("DB error", err);
		//generate get query if 'if' condition fail
		if (data && !(data.teamWork)){
			ejsData.uid = req.params.uid;
			ejsData.user = req.data;
			ejsData.name = data.name;
			res.render("board", ejsData);
		}
		else
			res.status(302).render('/users/?code=404&type=board');
	})
});

//creating new board
router.post('/new/board', bodyDataValidJSON, (req, res)=>{
	let newNote = {
		name: req.body.name,
		desc: req.body.desc,
		creater: req.data._id,
		uid: null,
		creationTime: null,
		registerIP: req.ip
	};

	newNote.creationTime = (new Date());
	newNote.name = (newNote.name.charAt(0)).toUpperCase() + (newNote.name.slice(1));

	newNote.uid = shortid.generate();
	//console.log(newNote);
	Notes.create(newNote, (err, data)=>{
		if (err) console.error.bind("Database error", err);
		let { notes } = req.data;
		notes.push(data._id);
		req.data.set({ notes });
		req.data.save();
		// User.findByIdAndUpdate(req.data._id, {$set: {notes}}, (err, newData)=>{
		// 	if (err) console.error.bind('Database error', err);
		// 	console.log(newData);
		// });
		res.status(302).redirect(`/users/board/${newNote.uid}`);
	});
});

//adding new card
router.post("/new/card/:noteId/:listId", validId, bodyDataValidJSON, async (req, res)=>{
	let card = {
		uid: null,
		desc: req.body.desc,
		dueDate: req.body.time,
		creater: req.data._id,
		creationTime: null,
		registerIP: req.ip
	};

	card.creationTime = (new Date());
	card.uid = shortid.generate();
	card.dueDate = (req.body.time != '') ? (new Date(req.body.time)):null;
	validRes.data = card;
	//console.log(req.body, card);

	Card.create(card, (err, data)=>{
        //console.log(data);
		if (err) console.error.bind("New card creation DB error", err);
		List.findOneAndUpdate({ creater: req.data._id, notesUid: req.params.noteId, uid: req.params.listId }, { $push: { cards: data._id } }/*, (err, listData)=>{
			if (err) throw err;
			//console.log(listData);
		}*/);
		validRes.data.creater = null;
		res.json(validRes);
	});
});

//list of all cards
router.get("/cards/:noteId/:listId", validId, (req, res)=>{
	List.findOne({ notesUid: req.params.noteId, uid: req.params.listId }, "cards").populate("cards").exec((err, data)=>{
		if (err) console.error.bind("Database error", err);
		//remove _id from array of card before sending to response
		validRes.data = data.cards;
		res.json(validRes);
	});
});

//adding new list in notes
router.post('/new/list/:uid', validId, bodyDataValidJSON, async (req, res)=>{
	let newList = {
		name: (req.body.name).trim(),
		uid: null,
		creater: req.data._id,
		notesUid: req.params.uid,
		creationTime: null,
		registerIP: req.ip
	};

	newList.creationTime = (new Date());
	newList.uid = shortid.generate();
	validRes.data = newList;

	List.create(newList, async (err, data)=>{
		if (err) console.error.bind("Database error", err);
		Notes.findOneAndUpdate({ creater: req.data._id, uid: newList.notesUid }, { $push: { lists: data._id } });
		validRes.data.creater = null;
		res.json(validRes);
	});
});

//archive the card
router.get("/card/archive/:uid", validId, (req, res)=>{
	Card.findOneAndUpdate({ uid: req.params.uid }, {$set: { archive: true}}, (err, data)=>{
        if (err) console.error.bind("DB error", err);
        //console.log(data);
        res.json(data ? validRes: invalidRes);
    });
});

module.exports = router;
