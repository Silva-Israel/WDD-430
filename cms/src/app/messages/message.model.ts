export class Message {
  constructor(
    public id: string,
    public _id: string,
    public subject: string,
    public msgText: string,
    public sender: string
  ) { }
}
