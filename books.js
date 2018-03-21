'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Books = new Schema({
	
	type: String,
	allbooks: Array
});

module.exports = mongoose.model('Books', Books);
