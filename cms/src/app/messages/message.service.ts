import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';

import { Message } from './message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messageChangedEvent = new EventEmitter<Message[]>();
  private messages: Message[] = [];

  maxMessageId: number;
  url: string = 'http://localhost:3000/messages/';

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

  // storeMessages() {
  //   const msgString = JSON.stringify(this.messages);
  //   const header = new HttpHeaders;

  //   header.set('Content-Type', 'application/json');
  //   this.http
  //     .put(
  //       this.url, msgString
  //     )
  //     .subscribe(
  //       () => {
  //         this.messageChangedEvent.next(this.messages.slice());
  //       }
  //     );
  // }

  getMessages() {
    this.http.get<{ messageS: string, message: Message[] }>(this.url)
      .subscribe(
        (responseData: any) => {
          this.messages = responseData.messages;
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  getMessage(id: string) {
    return this.http.get<{ messageS: string, message: Message }>(this.url + id);
    // if (!this.messages) {
    //   return null;
    // }

    // for (let message of this.messages) {
    //   if (message.id === id) {
    //     return message;
    //   }
    // }

    // return null;
  }

  addMessage(newMessage: Message) {
    if(!newMessage) {
      return;
    }

    newMessage.id = '';

    const headers = new HttpHeaders({'Content-Type':'application/json'});

    this.http.post<{ messageString: string, message: Message }>(this.url,
      newMessage,
      { headers: headers})
        .subscribe(
          (responseData) => {
            this.messages.push(responseData.message);
          }
        );
    // this.storeMessages();
  }

}
