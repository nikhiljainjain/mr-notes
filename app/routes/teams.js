//installed packages
let express = require('express');
let router = express.Router();
let shortid = require('shortid');

//self-made 
let { invalidRes, validRes, ejsData } = require('../config');
const { validId, bodyDataValidJSON } = require('../function');
const { cookieValid } = require("../function/cookies");
let User = require('../database/model/users');
let Notes = require('../database/model/notes');

//cookies validation
router.use(cookieValid);

//creating new tream board
router.post('/create/board', bodyDataValidJSON, (req, res)=>{
	let newNote = {
		name: req.body.name,
		desc: req.body.desc,
		creater: req.data._id,
		teamWork: true,
		uid: null,
		registerIP: req.ip
	}; 

	newNote.uid = shortid.generate();
	
	Notes.create(newNote, (err, data)=>{
		if (err) console.error.bind("Database error", err);
		let { notes } = req.data;
		notes.push(data._id);
		req.data.set({ notes });
		req.data.save().then(()=>{
			res.status(302).redirect(`/teams/board/${newNote.uid}`);
		}).catch((err)=>{
			res.status(302).redirect("/users");
		});
	});
});

//inside board
router.get('/board/:uid', validId, (req, res)=>{
	Notes.findOne({ uid: req.params.uid }, "name teamWork", (err, data)=>{
		if (err) console.error.bind("DB error", err);
		//checking if board really a team board or not
		if (data && data.teamWork){
			ejsData.uid = req.params.uid;
			ejsData.user = req.data;
			ejsData.name = data.name;
			res.render("team", ejsData);
		}
		else
			res.status(302).redirect('/users?q=code404');
	});
});

//adding new member
router.post('/add/member/:uid', validId, bodyDataValidJSON, (req, res)=>{
	/*
	Checking if adder email id isn't same of new member email id
	*/
	if (req.body.email !== req.data.email){
		User.findOne({email: req.body.email}, (err, userData)=>{
			if (err) console.error.bind("Database error", err);
			//console.log(userData);
			if (userData){
				//checking if notes exist or not
				Notes.findOne({ uid: req.params.uid }, (err, notesExist)=>{
					if (err) console.error.bind("Database error", err);
					//if notes exist then update on db
					if (notesExist){
						//notes members array
						notesExist.members.push(userData._id);
						notesExist.save();
						//updating notes list to new member
						userData.notes.push(notesExist._id);
						userData.save();
						res.json(validRes);
					}else{
						res.json(invalidRes);
					}			
				});
			}else
				res.json(invalidRes);
		});
	}else{
		res.json(invalidRes);
	}	
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

//inside board personal board only
router.get('/board/:uid', validId, (req, res)=>{
	Notes.findOne({ uid: req.params.uid }, "name teamWork", (err, data)=>{
		if (err) console.error.bind("DB error", err);
		//generate get query if 'if' condition fail
		if (data && !(data.teamWork)){
			let flag = false;

			//checking if user have premission to this notes 
			for (i in req.data.notes){
				if (i._id == data._id){
					flag = true;
					break;
				}
			}

			if (flag){
				ejsData.uid = req.params.uid;
				ejsData.user = req.data;
				ejsData.name = data.name;
				res.render("board", ejsData);
			}else{
				ERROR_MSG = "You haven't authorized to access notes";
				res.status(302).redirect(`/users?q=${ERROR_MSG}`);
			}
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
		creationTime: null,
		registerIP: req.ip
	};

	newNote.creationTime = (new Date());
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
		creationTime: null,
		registerIP: req.ip
	};

	card.creationTime = (new Date());
	card.uid = shortid.generate();
	//checking if date in valid format or not
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
	//creating new list
	List.create(newList, (err, listSave)=>{
		if (err) console.error.bind("Database error", err);
		//creater: req.data._id,
		Notes.findOne({ uid: newList.notesUid }, (err, notesExist)=>{
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
	Card.findOne({ uid: req.params.uid }, "archive", (err, cardExist)=>{
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