import { Injectable, EventEmitter } from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  // //variable for event emiter
  contactChangedEvent = new EventEmitter<Contact[]>();

  //subject property
  contactListChangedEvent = new Subject<Contact[]>();

  //property to hold max id
  maxContactId: number;

  contacts: Contact[] = [];

  //inject http client
  constructor(private http: HttpClient) {
    //init contact to be the ones coming from mockcontaccts
    // this.contacts = MOCKCONTACTS;
    // this.getContacts();
    //get the max id at init time
    this.maxContactId = this.getMaxId();
  }

  //method to get all contaccts
  getContacts() {
    //use http get
    this.http.get<{ message: string, contacts: Contact[] }>('http://localhost:3000/contacts')
      //subscribe to observable returning
      .subscribe(
        //sucess function
        (responseData) => {
          //assign the array of contacts received to the contacts class attribute
          this.contacts = responseData.contacts;
          //sort alphabetically by name
          this.contacts.sort((a, b) => (a.name < b.name) ? 1 : (a.name > b.name) ? -1 : 0)
          //signal that the list has changed
          this.contactListChangedEvent.next(this.contacts.slice());
        },
        (error: any) => {
          console.log(error);
        }
      )
  }

  //method to get a single specific contact
  getContact(id: string) {
    // //loop through all the contacts
    // this.contacts.forEach(contact => {
    //   //if ids match
    //   if (contact.id === id) {
    //     return contact;
    //   }
    // })
    // //if no id is found...
    // return null;

    // for (const contact of this.contacts) {
    //   if (contact.id === id) {
    //     return contact;
    //   }
    // }
    // return null;

    return this.http.get<{ message: string, contact: Contact }>('http://localhost:3000/contacts/' + id);
  }

  //method to get max id number in contact list
  getMaxId(): number {
    //variable to hold max Id
    let maxId = 0;
    //loop through the contact list
    for (const contact of this.contacts) {
      //get current id as a number
      const currentId = +contact.id;
      //if the current id is greater than max ID...
      if (currentId > maxId) {
        //then max id is the current id
        maxId = currentId;
      }
    }
    //return that max id
    return maxId;
  }

  //method to add a contact when user press add button
  addContact(newContact: Contact) {
    ////check if contact is defined
    if (!newContact) {
      //exit
      return;
    }

    //set headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    //convert object to string to send in req
    newContact.id = '';
    const strContact = JSON.stringify(newContact);

    //send req with object and headers
    this.http.post('http://localhost:3000/contacts', strContact, { headers: headers })
      //subscribe to response
      .subscribe(
        (contacts: Contact[]) => {
          //assign contact list
          this.contacts = contacts;
          //emit changes
          this.contactChangedEvent.next(this.contacts.slice());
        });
  }

  //method to update/replace an existing contact
  updateContact(originalContact: Contact, newContact: Contact) {
    //check if contact or update is defined
    if (!originalContact || !newContact) {
      //exit
      return;
    }

    //geet position in list of contacts
    const pos = this.contacts.indexOf(originalContact);
    //if position is not in array
    if (pos < 0) {
      //exit
      return;
    }

    //set headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    //conver object to string to send in req
    const strContact = JSON.stringify(newContact);

    //send req with contact id, object and headers
    this.http.patch('http://localhost:3000/contacts/' + originalContact.id
      , strContact
      , { headers: headers })
      //subscribe to response
      .subscribe(
        (contacts: Contact[]) => {
          //assign contacts list
          this.contacts = contacts;
          //emit changes
          this.contactChangedEvent.next(this.contacts.slice());
        });
  }

  //method to delete a contact
  deleteContact(contact: Contact) {
    //check if contact is undefined
    if (!contact) {
      //exit
      return;
    }

    //send request with specific id
    this.http.delete('http://localhost:3000/contacts/' + contact.id)
      //subscribe to response
      .subscribe(
        (contacts: Contact[]) => {
          //assing list of contacts
          this.contacts = contacts;
          //emit changes
          this.contactChangedEvent.next(this.contacts.slice());
        });
  }

  //method to store contacts in database with put request
  // storeContacts() {
  //   //stringify the list of documnts
  //   let contacts = JSON.stringify(this.contacts);

  //   //create header for content type
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json'
  //   });

  //   //put method with url, contacts object to replace, and headers
  //   this.http.put('https://cms-app-d5fce.firebaseio.com/contacts.json', contacts, { headers: headers })
  //     //subscribe to response
  //     .subscribe(
  //       () => {
  //         //once a response has been received, signal that the document list has changed, send copy of list
  //         this.contactListChangedEvent.next(this.contacts.slice());
  //       }
  //     )
  // }
}
