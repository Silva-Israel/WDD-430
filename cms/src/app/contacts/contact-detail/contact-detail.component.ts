import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css']
})
export class ContactDetailComponent implements OnInit {
  contact: Contact;
  id: string;
  groupContacts: Contact[];

  constructor(
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute
    ) { }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params.id;
          this.contactService.getContact(this.id)
            .subscribe(
              response => {
                this.contact = response.contact;
              }
            )
        }
      );
  }

  onDelete() {
    this.contactService.deleteContact(this.contact);

    this.router.navigateByUrl('contacts');

    this.contactService.getContacts();

    this.router.navigate(['/contacts']);
  }

}
