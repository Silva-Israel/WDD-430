import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Movie } from './movie.model';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  movieListChanged = new Subject<Movie[]>();
  private movies: Movie[] = [];

  constructor() {
    this.movies = [
      new Movie(
        'Inception',
        'A movie about dreams inside dreams.',
        'https://resizing.flixster.com/4MrL62heb7yBgBt8zllSeqNZxg4=/206x305/v2/https://flxt.tmsimg.com/assets/p7825626_p_v10_af.jpg',
        '5 stars',
        [{ name: 'Leonardo DiCaprio' }, { name: 'Joseph Gordon-Levitt' }],
        'Christopher Nolan'
      ),
      new Movie(
        'The Lord of the Rings',
        'The first in this incredible trilogy.',
        'https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_.jpg',
        '5 stars',
        [{ name: 'Elijah Wood' }, { name: 'Ian McKellen' }],
        'Peter Jackson'
      ),
      new Movie(
        'Back to the Future',
        'What would happen if you went back in time and met your parents in high school?',
        'https://img01.mgo-images.com/image/thumbnail/v2/content/1MV7df2fa6b9701b20d36d8079aaf32e950.jpeg',
        '5 stars',
        [{ name: 'Michael J. Fox' }, { name: 'Christopher Lloyd' }],
        'Robert Zemeckis'
      ),
    ];
  }

  setMovies(movies: Movie[]) {
    this.movies = movies;
    this.movieListChanged.next(this.movies.slice());
  }

  getMovies(): Movie[] {
    return this.movies.slice();
  }

  getMovie(index: number) {
    return this.movies[index];
  }

  addMovie(movie: Movie) {
    this.movies.push(movie);
    this.movieListChanged.next(this.movies.slice());
  }

  updateMovie(index: number, newMovie: Movie) {
    this.movies[index] = newMovie;
    this.movieListChanged.next(this.movies.slice());
  }

  deleteMovie(index: number) {
    this.movies.splice(index, 1);
    this.movieListChanged.next(this.movies.slice());
  }

  rateMovie() {

  }
}
