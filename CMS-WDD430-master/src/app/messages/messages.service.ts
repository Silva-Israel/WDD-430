import { Injectable, EventEmitter } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  //event emiter
  // messageChangeEvent = new EventEmitter<Message[]>();
  messageListChangedEvent = new Subject<Message[]>();
  //variable for array of messages
  messages: Message[] = [];

  maxMessageId: number;

  //inject http client
  constructor(private http: HttpClient) {
    // this.getMessages();

  }

  //method to get all messages
  getMessages() {
    //use http get
    this.http.get<{ message: string, messages: Message[] }>('http://localhost:3000/messages')
      //subscribe to observable returning
      .subscribe(
        //sucess function
        (messagesData) => {
          //assign the array of contacts received to the contacts class attribute
          this.messages = messagesData.messages;
          //sort alphabetically by name
          this.messages.sort((a, b) => (a.id < b.id) ? 1 : (a.id > b.id) ? -1 : 0)
          //signal that the list has changed
          this.messageListChangedEvent.next(this.messages.slice());
        },
        (error: any) => {
          console.log(error);
        }
      )
  }

  //method to get a single specific message
  getMessage(id: string): Message {
    //loop through all the messages
    for (const message of this.messages) {
      if (message.id === id) {
        return message;
      }
    }
    return null;
  }

  //method to get max id number in contact list
  getMaxId(): number {
    //variable to hold max Id
    let maxId = 0;
    //loop through the message list
    for (const message of this.messages) {
      //get current id as a number
      const currentId = +message.id;
      //if the current id is greater than max ID...
      if (currentId > maxId) {
        //then max id is the current id
        maxId = currentId;
      }
    }
    //return that max id
    return maxId;
  }

  //method to add a message
  addMessage(newMessage: Message) {
    //check if message is defined
    if (!newMessage) {
      //exit
      return;
    }

    //set headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    //convert object to string to send on request
    newMessage.id = '';
    const strMessage = JSON.stringify(newMessage);

    //send request with object and headers
    this.http.post('http://localhost:3000/messages', strMessage, { headers: headers })
      //subscribe to response
      .subscribe(
        (messages: Message[]) => {
          //assign messages list
          this.messages = messages;
          //emit change
          this.messageListChangedEvent.next(this.messages.slice());
        });
  }
}

