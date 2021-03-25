import { Component, Input, OnInit } from '@angular/core';

import { Movie } from '../movie.model';
import { MovieService } from '../movie.service';

@Component({
  selector: 'app-movie-item',
  templateUrl: './movie-item.component.html',
  styleUrls: ['./movie-item.component.css'],
})
export class MovieItemComponent implements OnInit {
  @Input() movie: Movie;
  @Input() index: number;

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.movieService.movieSelectedEvent.emit(this.movie);
  }
}
