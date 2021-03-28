export class Movie {
  constructor(
    public id: string,
    public _id: string,
    public title: string,
    public description: string,
    public imageUrl: string,
    public rating: string,
    public cast: string[],
    public director: string
  ) {}
}
