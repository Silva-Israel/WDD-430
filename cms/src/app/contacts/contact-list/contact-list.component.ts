import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css'],
})
export class ContactListComponent implements OnInit, OnDestroy {
  contacts: Contact[] = [];
  subscription: Subscription;
  term: string;

  constructor(private contactService: ContactService) {

  }

  ngOnInit() {
    //this.contacts = this.contactService.getContacts();

    this.subscription = this.contactService.contactListChanged
      .subscribe(
        (contactsList: Contact[]) => {
          this.contacts = contactsList;

          this.contacts.sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
      }
    );
  }

  search(value: string) {
    this.term = value;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
