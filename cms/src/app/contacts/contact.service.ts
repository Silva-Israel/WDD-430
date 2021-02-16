import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { MOCKCONTACTS } from './MOCKCONTACTS';
import { Contact } from './contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contactSelectedEvent = new EventEmitter<Contact>();
  contactChangedEvent = new EventEmitter<Contact[]>();
  contactListChanged = new Subject<Contact[]>();

  contacts: Contact[] = [];
  maxContactId: number;

  constructor() {
    this.contacts = MOCKCONTACTS;
    this.maxContactId = this.getMaxId();
  }

  getMaxId(): number {
    let maxId = 0;

    this.contacts.forEach(
      contact => {
        let currentId = +contact.id;
        if(currentId > maxId) {
          maxId = currentId;
        }
      }
    );

    return maxId;
  }

  getContacts(): Contact[] {
    return this.contacts.slice();
  }

  getContact(id: string): Contact {
    for(let contact of this.contacts) {
      if(contact.id === id) {
        return contact;
      }
    }
    return null;
  }

  addContact(newContact: Contact) {
    if(!newContact) {
      return;
    }

    this.maxContactId++

    this.maxContactId = +newContact.id;
    this.contacts.push(newContact);
    var contactsListsClone = this.contacts.slice();
    this.contactListChanged.next(contactsListsClone);
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if(!originalContact || !newContact) {
      return;
    }

    var pos = this.contacts.indexOf(originalContact);
    if(pos < 0) {
      return;
    }

    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    var contactsListClone = this.contacts.slice();
    this.contactListChanged.next(contactsListClone);
  }

  deleteContact(contact: Contact) {
    if(!contact) {
      return;
    }

    var pos = this.contacts.indexOf(contact);
    if(pos < 0) {
      return;
    }

    this.contacts.splice(pos, 1);
    var contactsListClone = this.contacts.slice();
    this.contactListChanged.next(contactsListClone);
  }
}
