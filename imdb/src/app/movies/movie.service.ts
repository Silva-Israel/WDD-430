import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Movie } from './movie.model';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  movieSelectedEvent = new EventEmitter<Movie>();
  movieListChanged = new Subject<Movie[]>();
  movies: Movie[] = [];
  maxMovieId: number;

  constructor(private http: HttpClient) {
    this.getMovies();
  }

  getMaxId(): number {
    let maxId = 0;

    this.movies.forEach((movie) => {
      let currentId = +movie.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    });
    return maxId;
  }

  getMovies() {
    this.http
      .get<{ message: string; movies: Movie[] }>('http://localhost:3000/movies')
      //.get<{ message: string; movies: Movie[] }>('mongodb+srv://Silva:ICfj12481632@silvai.llhik.mongodb.net/imdb/movies?retryWrites=true&w=majority')
        .subscribe(
          (response) => {
            this.movies = response.movies;
            this.sortAndSend();
          },
          (error: any) => {
            console.log(error);
          }
      );
  }

  getMovie(id: string) {
    return this.http
      .get<{ message: string; movie: Movie }>('http://localhost:3000/movies/' + id);
      //.get<{ message: string; movie: Movie }>('mongodb+srv://Silva:ICfj12481632@silvai.llhik.mongodb.net/imdb/movies/' + id + '?retryWrites=true&w=majority');
  }

  addMovie(newMovie: Movie) {
    if(!newMovie) {
      return;
    }

    newMovie.id = '';

    const headers = new HttpHeaders({'Content-Type':'application/json'});

    this.http.post<{ message: string, movie: Movie }>('http://localhost:3000/movies',
      newMovie,
      { headers: headers })
        .subscribe(
          (response) => {
            this.movies.push(response.movie);
            this.sortAndSend();
          }
        );
  }

  updateMovie(originalMovie: Movie, newMovie: Movie) {
    if(!originalMovie || !newMovie) {
      return;
    }

    const pos = this.movies.findIndex(con => con.id === originalMovie.id);

    if(pos < 0) {
      return;
    }

    newMovie.id = originalMovie.id;

    const headers = new HttpHeaders({'Content-Type':'application/json'});

    this.http.put('http://localhost:3000/movies/' + originalMovie.id,
      newMovie, { headers: headers })
        .subscribe(
          (response: Response) => {
            this.movies[pos] = newMovie;
            this.sortAndSend();
          }
        );
  }

  deleteMovie(movie: Movie) {
    if(!movie) {
      return;
    }

    const pos = this.movies.findIndex(con => con.id);

    if(pos < 0) {
      return;
    }

    this.http.delete('http://localhost:3000/movies/' + movie.id)
      .subscribe(
        (response) => {
          this.movies.splice(pos, 1);
          this.sortAndSend();
        }
      )
  }

  sortAndSend() {
    this.movies.sort((a, b) => a.title < b.title ? -1 : a.title > b.title ? 1 : 0);
    this.movieListChanged.next(this.movies.slice());
  }
}
