import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Contact } from 'src/app/contacts/contact.model';
import { ContactService } from 'src/app/contacts/contact.service';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent implements OnInit {
  @ViewChild('subject', {static: false}) subjectInputRef: ElementRef;
  @ViewChild('msgText', {static: false}) msgTextInputRef: ElementRef;
  currentSender: Contact;

  constructor(
    private messageService: MessageService,
    private contactService: ContactService) { }

  ngOnInit() {
    this.contactService.getContact('101')
      .subscribe(
        response => {
          this.currentSender = response.contact;
        }
      )
  }

  onSendMessage() {
    const msgSubj = this.subjectInputRef.nativeElement.value;
    const msgTxt = this.msgTextInputRef.nativeElement.value;
    const newMessage: Message = new Message(
      '',
      '',
      msgSubj,
      msgTxt,
      this.currentSender
    );

    this.messageService.addMessage(newMessage);
    this.onClear();

    this.messageService.getMessages();
  }

  onClear() {
    this.subjectInputRef.nativeElement.value = '';
    this.msgTextInputRef.nativeElement.value = '';
  }
}
