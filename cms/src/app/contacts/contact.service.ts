import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Contact } from './contact.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contactSelectedEvent = new EventEmitter<Contact>();
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
    const header = new HttpHeaders;

    header.set('Content-Type', 'application/json');
    this.http
      .put(
        this.url, contacts
      )
    .subscribe(
      () => {
        this.contactListChanged.next(this.contacts.slice());
      }
    );
}

  getContacts() {
    this.http
      .get<Contact[]>(
        this.url)
      .subscribe(
        // Success
        (contacts: Contact[]) => {
          this.contacts = contacts;
          this.maxContactId = this.getMaxId();
          contacts.sort();
          this.contactListChanged.next(this.contacts.slice());
        },
        // Error
        (error: any) => {
          console.log(error);
        }
      );
      return this.contacts;
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

    this.maxContactId++;
    newContact.id = this.maxContactId.toString();

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

    //var contactsListClone = this.contacts.slice();
    //this.contactListChanged.next(contactsListClone);

    this.storeContacts();
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

    //var contactsListClone = this.contacts.slice();
    //this.contactListChanged.next(contactsListClone);
    this.storeContacts();
  }

  addToGroup() {

  }
}
