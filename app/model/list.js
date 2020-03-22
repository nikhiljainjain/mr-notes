let mongoose = require("mongoose");
let shortid = require("shortid");

let njlist = new mongoose.Schema({
	//unique id generator
	uid: { type: String, default: null },
	//board name
    name: { type: String, default: "Mr. X"},
	//creator
	creator: { type: mongoose.Schema.ObjectId, ref: "njnotesusers" },
	//creation time
    creationTime: { type: Date, default: Date.now },
	//notes id
	cards: [ { type: mongoose.Schema.ObjectId, ref: 'njnotescards' } ]
});

njlist.pre(['create', 'save'], (next)=>{
	this.uid = shortid.generate();
});

module.exports = mongoose.model('njnoteslists', njlist);