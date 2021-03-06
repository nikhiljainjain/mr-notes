//installed packages
let express = require('express');
let router = express.Router();
let randomString = require('randomstring');
let shortid = require('shortid');

//self-made 
let { invalidRes, validRes, ejsData } = require('../config');
const { validId, bodyDataValidJSON } = require('../function');
const { cookieValid } = require("../function/cookies");
let { memberInvitation } = require("../function/email");
let User = require('../database/model/users');
let Notes = require('../database/model/notes');

//user invitation page rendering
router.get('/invitation/:specialCode/confirmation/:notesUid', async (req, res)=>{
	//checking data in data 
	const userData = await User.findOne({ specialCode: req.params.specialCode });
	const notesData = await Notes.findOne({ uid: req.params.notesUid });

	//both exist then page render for request accept
	if (userData && notesData){
		//saving data to session
		req.session.userData = userData;
		req.session.notesData = notesData; 

		//embdding data for 
		ejsData.specialCode = req.params.specialCode;
		ejsData.notesUid = req.params.notesUid;

		//saving data to session
		req.session.save(err => {
			if (err) console.error.bind("Session error", err);
			res.render('userInvitation', ejsData);
		});
	}else{
		//render 404 page
		res.status(404).send("<h1>Page Not Found<br>Error 404</h1>");
	}
});

//when user accept the request for the notes
router.get('/invitation/:specialCode/confirmation/:notesUid/accept', async (req, res)=>{
	let { userData, notesData } = req.session;

	//both exist then page render for request accept
	if (userData && notesData){
		//saving notes id & null the special code after that save userdata
		userData.notes.push(notesData._id);
		userData.set({ specialCode: null });
		userData.save();
		
		//pushing new member to notes
		notesData.members.push({ membersId: userData._id });
		notesData.save();

		req.session.regenerate(err => {
			if (err) console.error.bind("Session error", err);
			res.status(302).redirect('/users');
		});
	}else{
		//render 404 page
		res.status(404).send("<h1>Page Not Found<br>Error 404</h1>");
	}
});

//cookies validation
router.use(cookieValid);

//creating new tream board
router.post('/create/board', bodyDataValidJSON, (req, res)=>{
	let newNote = {
		name: req.body.name,
		desc: req.body.desc,
		creater: res.locals._id,
		teamWork: true,
		uid: null,
		ipAddress: req.ip
	}; 

	newNote.uid = shortid.generate();
	
	Notes.create(newNote, (err, data)=>{
		if (err) console.error.bind("Database error", err);
		let { notes } = res.locals;
		notes.push(data._id);
		res.locals.set({ notes });
		res.locals.save().then(()=>{
			res.status(302).redirect(`/teams/board/${newNote.uid}`);
		}).catch((err)=>{
			res.status(302).redirect("/users");
		});
	});
});

//inside board
router.get('/board/:uid', validId, (req, res)=>{
	Notes.findOne({ uid: req.params.uid }, "name teamWork").populate("members").exec((err, data)=>{
		if (err) console.error.bind("DB error", err);

		//checking if board really a team board or not
		if (data && data.teamWork){
			ejsData.uid = req.params.uid;
			ejsData.user = res.locals;
			ejsData.name = data.name;
			ejsData.members = data.members;
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
	if (req.body.email !== res.locals.email){
		User.findOne({ email: req.body.email }, "name", (err, userData)=>{
			if (err) console.error.bind("Database error", err);
			//console.log(userData);
			if (userData){
				//checking if notes exist or not
				Notes.findOne({ uid: req.params.uid }, (err, notesExist)=>{
					if (err) console.error.bind("Database error", err);
					//if notes exist then update on db
					if (notesExist){
						const specialCode = randomString.generate(32);
						//sending email to new member
						memberInvitation(userData.name, userData.email, res.locals.name, specialCode, req.params.uid);

						//saving special code in user schema
						userData.set({ specialCode });
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
	List.find({ notesUid: req.params.uid }, "name cards archive uid").populate("cards").select({ _id: 0 }).exec((err, data)=>{
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
			for (i in res.locals.notes){
				if (i._id == data._id){
					flag = true;
					break;
				}
			}

			if (flag){
				ejsData.uid = req.params.uid;
				ejsData.user = res.locals;
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
		uid: null,
		creationTime: null,
		ipAddress: req.ip
	};

	newNote.name = (newNote.name.charAt(0)).toUpperCase() + (newNote.name.slice(1));

	newNote.uid = shortid.generate();
	//console.log(newNote);
	Notes.create(newNote, (err, data)=>{
		if (err) console.error.bind("Database error", err);
		//extracting notes list from res.locals
		let { notes } = res.locals;
		notes.push(data._id);
		//saving new notes _id to notes array of user schema of the user
		res.locals.set({ notes });
		res.locals.save();
		// User.findByIdAndUpdate(res.locals._id, {$set: {notes}}, (err, newData)=>{
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
		creater: res.locals._id,
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
		List.findOneAndUpdate({ creater: res.locals._id, notesUid: req.params.noteId, uid: req.params.listId }, { $push: { cards: data._id } }/*, (err, listData)=>{
			if (err) throw err;
			//console.log(listData);
		}*/);
		validRes.data.creater = null;
		res.json(validRes);
	});
});

//list of all cards
router.get("/cards/:noteId/:listId", validId, (req, res)=>{
	List.findOne({ notesUid: req.params.noteId, uid: req.params.listId }, "cards").populate("cards").select({ _id: 0 }).exec((err, data)=>{
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
		creater: res.locals._id,
		notesUid: req.params.uid,
		ipAddress: req.ip
	};

	newList.uid = shortid.generate();
	//creating new list
	List.create(newList, (err, listSave)=>{
		if (err) console.error.bind("Database error", err);
		//creater: res.locals._id,
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