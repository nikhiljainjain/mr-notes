let mongoose = require("mongoose");
let shortid = require("shortid");

let njnotes = new mongoose.Schema({
	//unique id generator
	uid: { type: String, default: null },
	//board name
    name: { type: String, default: "Mr. X"},
	//description
	desc: { type: String, default: null},
	//creator
	creator: { type: mongoose.Schema.ObjectId, ref: "njnotesusers" },
	//other members
	members: [ { type: mongoose.Schema.ObjectId, ref: 'njnotesusers' } ], 
	//last login time
    creationTime: { type: Date, default: Date.now },
	//notes id
	lists: [ { type: mongoose.Schema.ObjectId, ref: 'njnoteslists' } ]
});

njnotes.pre(['create', 'save'], (next)=>{
	this.uid = shortid.generate();
});

module.exports = mongoose.model('njnotes', njnotes);