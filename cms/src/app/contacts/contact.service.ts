import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Contact } from './contact.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contactSelectedEvent = new EventEmitter<Contact>();
  contactChangedEvent = new EventEmitter<Contact[]>();
  contactListChanged = new Subject<Contact[]>();
  contacts: Contact[] = [];
  maxContactId: number;
  url: string = 'https://israelsilva-cms.firebaseio.com/contacts.json'

  constructor(private http: HttpClient) {
    this.getContacts();
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

  storeContacts() {
    const contacts = JSON.stringify(this.contacts);
    this.http.put('https://israelsilva-cms.firebaseio.com/contacts.json', contacts)
    .subscribe(() => {
        this.contactListChanged.next([...this.contacts]);
    });
}

  getContacts() {
    this.http
      .get<Contact[]>(
        this.url)
      .subscribe(
        (contacts: Contact[]) => {
          this.contacts = contacts;
          this.maxContactId = this.getMaxId();
          contacts.sort();
          this.contactListChanged.next(this.contacts.slice());
        },
        (error: any) => {
          console.log(error);
        }
      );
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

    this.storeContacts();
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

  addToGroup() {

  }
}
