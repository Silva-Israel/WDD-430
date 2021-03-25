const mongoose = require('mongoose');

const movieSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  rating: { type: String, required: true },
  cast: { type: mongoose.Schema.Types.Array, required: true },
  director: { type: String, required: true }
  });

  module.exports = mongoose.model('Movie', movieSchema);
