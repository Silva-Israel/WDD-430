const mongoose = require('mongoose');

const movieSchema = mongoose.Schema({
  id: { type: String },
  title: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String },
  rating: { type: String },
  cast: { type: mongoose.Schema.Types.Array },
  director: { type: String }
  });

  module.exports = mongoose.model('Movie', movieSchema);
