import { Pipe, PipeTransform } from "@angular/core";

import { Movie } from "./movie.model";

@Pipe({
  name: 'moviesFilter'
})
export class MoviesFilterPipe implements PipeTransform {
  transform(movies: Movie[], term: string): any {
    let filteredMovies: Movie[] = [];

    if(term && term.length > 0) {
      filteredMovies = movies.filter(
        (movie: Movie) => movie.title.toLowerCase().includes(term)
      );
    }

    if(filteredMovies.length < 1) {
      return movies;
    }

    return filteredMovies;
  }
}
