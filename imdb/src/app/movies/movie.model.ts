import { Actor } from '../shared/actor.model';

export class Movie {
  constructor(
    public title: string,
    public description: string,
    public imageUrl: string,
    public rating: string,
    public cast: Actor[],
    public director: string
  ) {}
}