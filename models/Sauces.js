const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const saucesSchema = mongoose.Schema({
	userID: { type: String, required: true },
	name: { type: String, required: true },
	manufacturer: { type: String, required: true },
	description: { type: String, required: true },
    mainingredient: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true},
    likes: { type: Number},
    dislikes: { type: Number},
    usersliked: [String],
    usersdisliked: [String]
});

saucesSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Sauces', saucesSchema);