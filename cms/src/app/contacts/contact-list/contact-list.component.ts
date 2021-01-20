import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Contact } from '../contact.model';

@Component({
  selector: 'cms-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
  @Output() selectedContactEvent = new EventEmitter<Contact>();

  contacts: Contact[] = [
    new Contact(1, "Tim Thayne", "thaynet@byui.edu", "208-496-3777", "/assets/thayneti.jpg", null),
    new Contact(2, "Rex Barzee", "barzeer@byui.edu", "208-496-3768", "/assets/barzeer.jpg", null)
  ];

  constructor() { }

  ngOnInit(): void {
  }

  onSelected(contact: Contact) {
    this.selectedContactEvent.emit(contact);
  }

}
