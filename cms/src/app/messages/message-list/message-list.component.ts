import { Component, OnInit } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {
  messages: Message[] = [
    new Message(2, 'First message', 'This is the first message in the list', 'Person One'),
    new Message(3, 'Second message', 'This is the second message in the list', 'Person Two'),
    new Message(4, 'Third message', 'This is the third message in the list', 'Person Three')
  ];

  constructor() { }

  ngOnInit(): void {
  }

  onAddMessage(message: Message) {
    this.messages.push(message);
  }

}
