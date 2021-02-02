import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent implements OnInit {
  currentSender: string = 'Israel Silva';

  @ViewChild('subject', {static: false}) subjectInputRef: ElementRef;
  @ViewChild('msgText', {static: false}) msgTextInputRef: ElementRef;

  constructor(private messageService: MessageService) { }

  ngOnInit() {
  }

  onSendMessage() {
    const msgSubj = this.subjectInputRef.nativeElement.value;
    const msgTxt = this.msgTextInputRef.nativeElement.value;
    const newMessage = new Message('', msgSubj, msgTxt, this.currentSender);
    this.messageService.addMessage(newMessage);

    this.onClear();
  }

  onClear() {
    this.subjectInputRef.nativeElement.value = '';
    this.msgTextInputRef.nativeElement.value = '';
  }

}
