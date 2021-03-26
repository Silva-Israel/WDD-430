import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Movie } from '../movie.model';
import { MovieService } from '../movie.service';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css']
})
export class MovieListComponent implements OnInit, OnDestroy {
  movies: Movie[];
  subscription: Subscription;
  term: string;

  constructor(private movieService: MovieService) { }

  ngOnInit() {
    this.movieService.getMovies();

    this.subscription = this.movieService.movieListChanged
      .subscribe(
        (movieList: Movie[]) => {
          this.movies = movieList;

          this.movies.sort((a, b) => a.title < b.title ? -1 : a.title > b.title ? 1 : 0);
        }
      );
  }

  search(value: string) {
    this.term = value;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
