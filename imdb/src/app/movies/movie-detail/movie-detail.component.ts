import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Movie } from '../movie.model';
import { MovieService } from '../movie.service';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css'],
})
export class MovieDetailComponent implements OnInit {
  movie: Movie;
  id: string;
  url: string;

  constructor(
    private movieService: MovieService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params.id;
          this.movieService.getMovie(this.id)
            .subscribe(
              response => {
                this.movie = response.movie;
              }
            )
        this.onRate(this.id);
        }
      );

    this.url = 'https://www.imdb.com/find?q=';
  }

  onEditMovie() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onDelete() {
    //this.movieService.deleteMovie(this.id);
    this.router.navigateByUrl('movies');
  }

  onRate(id: string) {
    switch(this.movie.rating) {
      case '*':
        document.getElementById('star-rating').innerHTML = '&#9733;';
        break;
      case '**':
        document.getElementById('star-rating').innerHTML = '&#9733; &#9733;';
        break;
      case '***':
        document.getElementById('star-rating').innerHTML = '&#9733; &#9733; &#9733;';
        break;
      case '****':
        document.getElementById('star-rating').innerHTML = '&#9733; &#9733; &#9733; &#9733;';
        break;
      case '*****':
        document.getElementById('star-rating').innerHTML = '&#9733; &#9733; &#9733; &#9733; &#9733;';
        break;
    }
  }
}
