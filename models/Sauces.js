const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    userID: ​ { type: String, required: true },
    name: ​ { type: String, required: true },
    manufacturer:​ { type: String, required: true },
    description: { type: String, required: true },
    mainingredient: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number},
    likes: { type: Number},
    dislikes: { type: Number},
    usersliked: { type: String},
    usersdisliked: ​ {type: String } ​
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
