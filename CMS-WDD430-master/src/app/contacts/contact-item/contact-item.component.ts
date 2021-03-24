import { Component, OnInit, Input } from '@angular/core';
import { Contact } from '../contact.model';

@Component({
  selector: 'app-contact-item',
  templateUrl: './contact-item.component.html',
  styleUrls: ['./contact-item.component.css']
})
export class ContactItemComponent implements OnInit {
  //get Recipe from recipe list as Input
  @Input() contact: Contact;

  constructor() { }

  ngOnInit(): void {
  }

}
