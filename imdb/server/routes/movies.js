var express = require('express');
var router = express.Router();
const sequenceGenerator = require('./sequenceGenerator');
const Movie = require('../models/movie');
module.exports = router;

router.get('/', (req, res, next) => {
  Movie.find()
    .populate('group')
    .then(movies => {
      res.status(200).json({
        message: 'Movies fetched successfully!',
        movies: movies
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred.',
        error: error
      });
    });
});

router.get('/:id', (req, res, next) => {
  Movie.findOne({
    "id": req.params.id
  })
    .populate('group')
    .then(movie => {
      res.status(200).json({
        message: 'Movie fetched successfully!',
        movie: movie
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred.',
        error: error
      });
    });
});

router.post('/', (req, res, next) => {
  const maxMovieId = sequenceGenerator.nextId("movies");

  const movie = new Movie({
    id: maxMovieId,
    title: req.body.title,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    cast: req.body.cast,
    director: req.body.director,
    rating: req.body.rating
  });

  movie.save()
    .then(createdMovie => {
      res.status(201).json({
        message: 'Movie added successfully',
        movie: createdMovie
      });
    })
    .catch(error => {
       res.status(500).json({
          message: 'An error occurred',
          error: error
        });
    });
});

router.put('/:id', (req, res, next) => {
  Movie.findOne({ id: req.params.id })
    .then(movie => {
      movie.title = req.body.title,
      movie.description = req.body.description,
      movie.imageUrl = req.body.imageUrl,
      movie.cast = req.body.cast,
      movie.director = req.body.director,
      movie.rating = req.body.rating

      Movie.updateOne({ id: req.params.id }, movie)
        .then(result => {
          res.status(204).json({
            message: 'Movie updated successfully'
          })
        })
        .catch(error => {
           res.status(500).json({
           message: 'An error occurred',
           error: error
         });
        });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Movie not found.',
        error: { movie: 'Movie not found'}
      });
    });
});

router.delete('/:id', (req, res, next) => {
  Movie.findOne({ id: req.params.id })
    .then(movie => {
      movie.deleteOne({ id: req.params.id })
        .then(result => {
          res.status(204).json({
            message: "Movie deleted successfully"
          });
        })
        .catch(error => {
           res.status(500).json({
           message: 'An error occurred',
           error: error
         });
        })
    })
    .catch(error => {
      res.status(500).json({
        message: 'Movie not found.',
        error: { movie: 'Movie not found'}
      });
    });
});
