import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Movie } from './movie.model';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  movieSelectedEvent = new EventEmitter<Movie>();
  movieListChanged = new Subject<Movie[]>();
  private movies: Movie[] = [];

  constructor(
    private http: HttpClient) {
      this.getMovies();
/*
    this.movies = [
      new Movie(
        'Inception',
        'A movie about dreams inside dreams.',
        'https://resizing.flixster.com/4MrL62heb7yBgBt8zllSeqNZxg4=/206x305/v2/https://flxt.tmsimg.com/assets/p7825626_p_v10_af.jpg',
        '*****',
        [{ name: 'Leonardo DiCaprio' }, { name: 'Joseph Gordon-Levitt' }],
        'Christopher Nolan'
      ),
      new Movie(
        'The Lord of the Rings',
        'The first in this incredible trilogy.',
        'https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_.jpg',
        '****',
        [{ name: 'Elijah Wood' }, { name: 'Ian McKellen' }],
        'Peter Jackson'
      ),
      new Movie(
        'Back to the Future',
        'What would happen if you went back in time and met your parents in high school?',
        'https://img01.mgo-images.com/image/thumbnail/v2/content/1MV7df2fa6b9701b20d36d8079aaf32e950.jpeg',
        '**',
        [{ name: 'Michael J. Fox' }, { name: 'Christopher Lloyd' }],
        'Robert Zemeckis'
      ),
    ];*/
  }

  setMovies(movies: Movie[]) {
    this.movies = movies;
    this.movieListChanged.next(this.movies.slice());
  }

  getMovies() {
    this.http.get<{ message: string, movies: Movie[] }>('http://localhost:3000/movies')
      .subscribe(
        (response) => {
          this.movies = response.movies;
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  getMovie(id: string) {
    //return this.movies[index];
    return this.http.get<{ message: string, movie: Movie }>('http://localhost:3000/movies/' + id);
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
