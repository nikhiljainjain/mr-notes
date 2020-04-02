//installed packages
let express = require('express');
let router = express.Router();
let shortid = require('shortid');

//self-made 
let { validRes, invalidRes } = require('../config');
let { userValid, validId } = require('../function');
let User = require('../database/model/users');
let Notes = require('../database/model/notes');
let List = require('../database/model/list');
let Card = require('../database/model/card');

//cookies validation
router.use(userValid);

//user home
router.get('/', (req, res, next)=>{
	Notes.find({creater: req.data._id}, "name uid teamWork").sort("name").exec((err, data)=>{
		if (err) console.error.bind("DB error", err);
		/*data.forEach((i)=>{
			console.log(i.name);
		});*/
		//query handler
		res.render('home', { notes: data, user: req.data, name: null });
	});
});

//get the list & card 
router.get('/board/lists/cards/:uid', validId, (req, res, next)=>{
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
router.get('/board/:uid', validId, (req, res, next)=>{
	Notes.findOne({ uid: req.params.uid }, "name teamWork", (err, data)=>{
		if (err) console.error.bind("DB error", err);
		//generate get query if 'if' condition fail
		if (data && !(data.teamWork))
			res.render("board", { uid: req.params.uid, user: req.data, name: data.name });
		else
			res.status(302).render('/users/?code=404');
	})
});

//creating new board
router.post('/new/board', (req, res, next)=>{
	let newNote = {
		name: req.body.name,
		desc: req.body.desc,
		creater: req.data._id,
		uid: null
	};

	newNote.name = (newNote.name.charAt(0)).toUpperCase() + (newNote.name.slice(1));

	newNote.uid = shortid.generate();
	//console.log(newNote);
	Notes.create(newNote, (err, data)=>{
		if (err) console.error.bind("Database error", err);
		User.updateOne({ _id: req.data._id}, { $push: { notes : data._id }}/*, (err, userData)=>{
			if (err) console.error.bind("DB error", err);
			console.log(userData);
		}*/);
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
router.get("/cards/:noteId/:listId", validId, (req, res, next)=>{
	List.findOne({ notesUid: req.params.noteId, uid: req.params.listId }, "cards").populate("cards").exec((err, data)=>{
		if (err) console.error.bind("Database error", err);
		//remove _id from array of card before sending to response
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
		Notes.findOneAndUpdate({ creater: req.data._id, uid: newList.notesUid }, { $push: { lists: data._id } });
		validRes.data.creater = null;
		res.json(validRes);
	});
});

//archive the card
router.get("/card/archive/:uid", validId, (req, res, next)=>{
	Card.findOneAndUpdate({ uid: req.params.uid }, {$set: { archive: true}}, (err, data)=>{
        if (err) console.error.bind("DB error", err);
        //console.log(data);
        res.json(data ? validRes: invalidRes);
    });
});

module.exports = router;