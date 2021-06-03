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

                this.onRate();
              }
            )
        }
      );

    this.url = 'https://www.imdb.com/find?q=';
  }

  onEditMovie() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onDelete() {
    this.movieService.deleteMovie(this.movie);

    this.router.navigateByUrl('movies');

    this.movieService.getMovies();

    this.router.navigate(['/movies']);
  }

  onRate() {
    let container = document.querySelector('.star-rating');

    if(!this.movie.rating) {
      container.innerHTML = '<span style="color: black; font-size: .8em;">Not yet rated<span>';
    } else {
      switch(this.movie?.rating) {
        case '*':
          container.innerHTML = '&#9733; &#9734; &#9734; &#9734; &#9734;';
          break;
        case '**':
          container.innerHTML = '&#9733; &#9733; &#9734; &#9734; &#9734;';
          break;
        case '***':
          container.innerHTML = '&#9733; &#9733; &#9733; &#9734; &#9734;';
          break;
        case '****':
          container.innerHTML = '&#9733; &#9733; &#9733; &#9733; &#9734;';
          break;
        case '*****':
          container.innerHTML = '&#9733; &#9733; &#9733; &#9733; &#9733;';
          break;
        default:
          container.innerHTML = '';
      }
    }
  }
}
