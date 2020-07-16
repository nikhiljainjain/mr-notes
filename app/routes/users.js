//installed packages
let express = require('express');
let router = express.Router();
let shortid = require('shortid');

//self-made
let { validRes, invalidRes, ejsData, ERROR_MSG } = require('../config');
const { bodyDataValidJSON, validId } = require('../function');
const { cookieValid } = require("../function/cookies");
let User = require('../database/model/users');
let Notes = require('../database/model/notes');
let List = require('../database/model/list');
let Card = require('../database/model/card');

//cookies validation
router.use(cookieValid);

//user home
router.get('/', (req, res)=>{
	User.findById(req.data._id, "notes").populate("notes").sort("name").select({ _id: 0 }).exec((err, data)=>{
		if (err) console.error.bind("DB error", err);

		//checking if some query is sent or not
		ejsData.msg = (req.query.q) ? req.query.q: null;
		ejsData.notes = data.notes;
		ejsData.user = req.data;
		res.render('home', ejsData);
	});
});

//get the list & card
router.get('/board/lists/cards/:notesUid', validId, (req, res)=>{
	//in find query add attribute -> archive: false
	List.find({ notesUid: req.params.uid }, "name cards archive uid")
		.populate("cards").exec((err, data)=>{
		if (err) console.error.bind("DB errror ", err);
		//console.log(data);
		validRes.data = data;
		res.json(validRes);
	});
});

//inside board personal board only
router.get('/board/:uid', validId, (req, res)=>{
	Notes.findOne({ uid: req.params.uid }).select({ name: 1, teamWork: 1, _id: 0 }).exec((err, data)=>{
		if (err) console.error.bind("DB error", err);
		//generate get query if 'if' condition fail
		if (data && !(data.teamWork)){
			ejsData.uid = req.params.uid;
			ejsData.user = req.data;
			ejsData.name = data.name;
			res.render("board", ejsData);
		}
		else{
			ERROR_MSG = "Notes NOT FOUND";
			res.status(302).render(`/users/?q=${ERROR_MSG}`);
		}
	})
});

//creating new board
router.post('/new/board', bodyDataValidJSON, (req, res)=>{
	let newNote = {
		name: req.body.name,
		desc: req.body.desc,
		creater: req.data._id,
		uid: null,
		ipAddress: req.ip
	};

	newNote.name = (newNote.name.charAt(0)).toUpperCase() + (newNote.name.slice(1));

	newNote.uid = shortid.generate();
	//console.log(newNote);
	Notes.create(newNote, (err, data)=>{
		if (err) console.error.bind("Database error", err);
		//extracting notes list from req.data
		let { notes } = req.data;
		notes.push(data._id);
		//saving new notes _id to notes array of user schema of the user
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
		ipAddress: req.ip
	};

	card.uid = shortid.generate();
	//checking if date in valid format or not
	card.dueDate = (req.body.time != '') ? (new Date(req.body.time)):null;
	validRes.data = card;
	//console.log(req.body, card);

	Card.create(card, (err, data)=>{
        //console.log(data);
		if (err) console.error.bind("New card creation DB error", err);
		List.findOne({ creater: req.data._id, notesUid: req.params.noteId, uid: req.params.listId }, (err, listData)=>{
			if (err || !listData){
				if (err){
					console.log("DB error", err);
				}
				invalidRes.data = 'DATA NOT FOUND';
				res.json(invalidRes);
			}else{
				//saving object id of new card in list
				listData.cards.push(data._id);
				listData.save();

				//sending response back to front end
				validRes.data.creater = null;
				res.json(validRes);
			} 
		});
	});
});

//list of all cards
router.get("/cards/:noteId/:listId", validId, (req, res)=>{
	//finding list belonging to particular notes
	List.findOne({ creater: req.data._id, notesUid: req.params.noteId, uid: req.params.listId },
		 "cards").populate("cards").select({ _id: 0 }).exec((err, listExist)=>{
		if (err) console.error.bind("Database error", err);
		//console.log(listExist);
		validRes.data = listExist.cards;
		res.json(validRes);
	});
});

//adding new list in notes
router.post('/new/list/:uid', validId, bodyDataValidJSON, (req, res)=>{
	//creating new list object
	let newList = {
		name: (req.body.name).trim(),
		uid: null,
		creater: req.data._id,
		notesUid: req.params.uid,
		ipAddress: req.ip
	};

	newList.uid = shortid.generate();
	//creating new list
	List.create(newList, (err, listSave)=>{
		if (err) console.error.bind("Database error", err);
		//creater: req.data._id,
		Notes.findOne({ creater: req.data._id, uid: newList.notesUid }, (err, notesExist)=>{
			if (err) console.error.bind("DB error", err);
			if (notesExist){
				//sending back data in response
				validRes.data = newList;
				validRes.data.creater = null;
				//saving list id into notes list array
				notesExist.lists.push(listSave._id);
				notesExist.save();
				res.json(validRes);
			}else{
				res.json(invalidRes);
			}
		});
	});
});

//archive the card
router.get("/card/archive/:uid", validId, (req, res)=>{
	//finding card in the database
	Card.findOne({ creater: req.data._id, uid: req.params.uid }).select({ archive: 1, _id: 0}).exec((err, cardExist)=>{
		if (err) console.error.bind("DB error", err);
		//checking card exist or not in database and value should be false
		if (cardExist && !cardExist.archive){
			//changing archive value to true
			cardExist.set({ archive: true });
			cardExist.save();
			res.json(validRes);
		}else{
			res.json(invalidRes);
		}
    });
});

module.exports = router;