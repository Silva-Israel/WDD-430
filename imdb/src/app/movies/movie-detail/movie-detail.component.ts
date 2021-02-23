import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RatingModule } from 'ng-starrating';

import { Movie } from '../movie.model';
import { MovieService } from '../movie.service';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css'],
})
export class MovieDetailComponent implements OnInit {
  movie: Movie;
  id: number;
  url: string;
  totalstar: number = 10;

  constructor(
    private movieService: MovieService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params
      .subscribe(
        (params: Params) => {
        this.id = +params['id'];
        this.movie = this.movieService.getMovie(this.id);
        }
      );

    this.url = 'https://www.imdb.com/find?q=';
  }

  onEditMovie() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onDelete() {
    this.movieService.deleteMovie(this.id);
    this.router.navigateByUrl('movies');
  }

  onRate() {

  }
}
