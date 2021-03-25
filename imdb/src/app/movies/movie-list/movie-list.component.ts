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

  constructor(private movieService: MovieService) {

  }

  ngOnInit() {
    this.movieService.getMovies();

    this.subscription = this.movieService.movieListChanged
      .subscribe(
        (movieList: Movie[]) => {
          this.movies = movieList;

          console.log(movieList);
        }
      );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
