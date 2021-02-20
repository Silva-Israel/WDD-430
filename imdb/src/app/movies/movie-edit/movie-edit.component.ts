import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Actor } from 'src/app/shared/actor.model';
import { Movie } from '../movie.model';
import { MovieService } from '../movie.service';

@Component({
  selector: 'app-movie-edit',
  templateUrl: './movie-edit.component.html',
  styleUrls: ['./movie-edit.component.css']
})
export class MovieEditComponent implements OnInit {
  editMode: boolean = false;
  id: number;
  movieForm: FormGroup;

  constructor(
    private movieService: MovieService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
          this.editMode = params['id'] != null;
          this.initForm();
        }
      )
  }

  get controls() {
    return (<FormArray>this.movieForm.get('cast')).controls;
  }

  onSubmit() {
    if(this.editMode) {
      this.movieService.updateMovie(this.id, this.movieForm.value);
    } else {
      this.movieService.addMovie(this.movieForm.value);
    }

    this.onCancel();
  }

  onAddActor() {
    (<FormArray>this.movieForm.get('cast')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required)
      })
    );
  }

  onDeleteActor(index: number) {
    (<FormArray>this.movieForm.get('cast')).removeAt(index);
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  private initForm() {
    let movieTitle = '';
    let movieDescription = '';
    let movieImageUrl = '';
    let movieDirector = '';
    let movieRating = '';
    let movieCast = new FormArray([]);

    if(this.editMode) {
      const movie = this.movieService.getMovie(this.id);
      movieTitle = movie.title;
      movieDescription = movie.description;
      movieImageUrl = movie.imageUrl;
      movieDirector = movie.director;
      movieRating = movie.rating;

      if(movie['cast']) {
        for(let actor of movie.cast) {
          movieCast.push(
            new FormGroup({
              'name': new FormControl(actor.name)
            })
          );
        }
      }
    }

      this.movieForm = new FormGroup({
        'title': new FormControl(movieTitle, Validators.required),
        'description': new FormControl(movieDescription),
        'imageUrl': new FormControl(movieImageUrl),
        'director': new FormControl(movieDirector),
        'rating': new FormControl(movieRating),
        'cast': movieCast
      });
  }
}
