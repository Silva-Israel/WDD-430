import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Contact } from '../contacts/contact.model';

import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messageChangedEvent = new EventEmitter<Message[]>();
  messages: Message[] = [];
  maxMessageId: number;
  url: string = 'https://israelsilva-cms.firebaseio.com/messages.json'

  constructor(private http: HttpClient) {
    this.getMessages();
  }

  getMaxId(): number {
    let maxId = 0;

    this.messages.forEach(
      message => {
        let currentId = +message.id;
        if(currentId > maxId) {
          maxId = currentId;
        }
      }
    );

    return maxId;
  }

  storeMessages() {
    const msgString = JSON.stringify(this.messages);
    const header = new HttpHeaders;

    header.set('Content-Type', 'application/json');
    this.http
      .put(
        this.url, msgString
      )
      .subscribe(
        () => {
          this.messageChangedEvent.next(this.messages.slice());
        }
      );
  }

  getMessages() {
    this.http
      .get<Message[]>(
        this.url)
      .subscribe(
        (messages: Message[]) => {
          this.messages = messages;
          this.maxMessageId = this.getMaxId();
          messages.sort();
          this.messageChangedEvent.next(this.messages.slice());
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  getMessage(id: string): Message {
    for(let message of this.messages) {
      if(message.id = id) {
        return message;
      }
    }
    return null;
  }

  addMessage(message: Message) {
    this.messages.push(message);

    //this.messageChangedEvent.emit(this.messages.slice());
    this.storeMessages();
  }
}
