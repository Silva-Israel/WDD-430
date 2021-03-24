import { EventEmitter, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { Contact } from './contact.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  contactSelectedEvent = new EventEmitter<Contact>();
  contactListChanged = new Subject<Contact[]>();
  contacts: Contact[] = [];
  maxContactId: number;

  constructor(private http: HttpClient) {
    this.getContacts();
  }

  getMaxId(): number {
    let maxId = 0;

    this.contacts.forEach((contact) => {
      let currentId = +contact.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    });
    return maxId;
  }

  getContacts() {
    this.http.get<{ message: string, contacts: Contact[] }>('http://localhost:3000/contacts/')
      .subscribe(
        // Success
        (responseData) => {
          this.contacts = responseData.contacts;
          this.sortAndSend();
        },
        // Error
        (error: any) => {
          console.log(error);
        }
      );
  }

  getContact(id: string) {
    return this.http.get<{ message: string, contact: Contact }>('http://localhost:3000/contacts/' + id);
  }

  addContact(newContact: Contact) {
    if (!newContact) {
      return;
    }

    newContact.id = '';

    const headers = new HttpHeaders({'Content-Type':'application/json'});

    this.http.post<{ message: string, contact: Contact }>('http://localhost:3000/contacts',
      newContact,
      { headers: headers })
        .subscribe(
          (responseData) => {
            this.contacts.push(responseData.contact);
            this.sortAndSend();
          }
        );
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return;
    }

    const pos = this.contacts.findIndex(con => con.id === originalContact.id);

    if (pos < 0) {
      return;
    }

    newContact.id = originalContact.id;

    const headers = new HttpHeaders({'Content-Type':'application/json'});

    this.http.put('http://localhost:3000/contacts/' + originalContact.id,
      newContact, { headers: headers})
        .subscribe(
          (response: Response) => {
            this.contacts[pos] = newContact;
            this.sortAndSend();
          }
        )
  }

  deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }

    const pos = this.contacts.findIndex(con => con.id);

    if (pos < 0) {
      return;
    }

    this.http.delete('http://localhost:3000/contacts/' + contact.id)
      .subscribe(
        (response: Response) => {
          this.contacts.splice(pos, 1);
          this.sortAndSend();
        }
      );
  }

  sortAndSend() {
    this.contacts.sort((a, b) => a.name < b.name ? 1 : a.name > b.name ? -1 : 0);
    this.contactListChanged.next(this.contacts.slice());
  }
}
