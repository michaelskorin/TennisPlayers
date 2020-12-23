const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const playerSchema = new Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  age: { type: Number, required: true },
  grand_slams: { type: Number, required: false },
  ranking: { type: Number, required: false },
  points: { type: Number, required: true },
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  image: { type: String, required: true },
});

module.exports = mongoose.model('Player', playerSchema);
