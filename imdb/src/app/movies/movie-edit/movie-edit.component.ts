import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Actor } from 'src/app/shared/actor.model';

import { Movie } from '../movie.model';
import { MovieService } from '../movie.service';

@Component({
  selector: 'app-movie-edit',
  templateUrl: './movie-edit.component.html',
  styleUrls: ['./movie-edit.component.css'],
})
export class MovieEditComponent implements OnInit {
  originalMovie: Movie;
  movie: Movie;
  editMode: boolean = false;
  id: string;
  groupActors: Actor[] = [];

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
          if(!this.id) {
            this.editMode = false;
            return;
          }

          this.movieService.getMovie(this.id)
            .subscribe(
              response => {
                this.originalMovie = response.movie;

                if(!this.originalMovie) {
                  return;
                }

                this.editMode = true;

                this.movie = JSON.parse(JSON.stringify(this.originalMovie));

                if(this.movie.cast) {
                  this.groupActors = this.movie.cast.slice();
                }
              }
            );
      });
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newMovie = new Movie(
      value.id,
      '',
      value.title,
      value.description,
      value.imageUrl,
      value.rating,
      this.groupActors,
      value.director
    );

    if (this.editMode) {
      this.movieService.updateMovie(this.originalMovie, newMovie);
    } else {
      this.movieService.addMovie(newMovie);
    }

    this.router.navigate(['/movies', newMovie.id], {
      relativeTo: this.route
    });
  }

  onCancel() {
    this.router.navigate(['/movies']);
  }

  onAddActor() {

  }

  onDeleteActor() {

  }
}
