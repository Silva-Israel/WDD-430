import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Message } from './message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messageChangedEvent = new EventEmitter<Message[]>();
  private messages: Message[] = [];
  maxMessageId: number;

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

  getMessages() {
    this.http.get<{ message: string, messages: Message[] }>('http://localhost:3000/messages')
      .subscribe(
        (responseData) => {
          this.messages = responseData.messages;
          this.sortAndSend();
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  getMessage(id: string) {
    return this.http.get<{ messageS: string, message: Message }>('http://localhost:3000/messages/' + id);
  }

  addMessage(newMessage: Message) {
    if(!newMessage) {
      return;
    }

    newMessage.id = '';

    const headers = new HttpHeaders({ 'Content-Type':'application/json' });

    this.http.post<{ messageString: string, message: Message }>('http://localhost:3000/messages',
      newMessage,
      { headers: headers})
        .subscribe(
          (responseData) => {
            this.messages.push(responseData.message);
            this.sortAndSend();
          }
        );
  }

  sortAndSend() {
    this.messages.sort((a, b) => a.id > b.id ? 1 : b.id > a.id ? -1 : 0);
    this.messageChangedEvent.next(this.messages.slice());
  }

}
