import { Pipe, PipeTransform } from '@angular/core';
import { Contact } from './contact.model';

@Pipe({
  name: 'contactsFilter'
})
export class ContactsFilterPipe implements PipeTransform {

  //function to transform the incoming value
  transform(contacts: any, [term]) {
    //variable to store filtered array
    let filteredArray: Contact[] = [];

    //use filter in the array of contacts to go through all the array and filter only the ones who contain the term and store them in the filtered array
    filteredArray = contacts.filter(
      (contact: any) => contact.name.toLowerCase().includes(term.toLowerCase())
    );

    //if there is nothing on the filtered array...
    if (filteredArray.length < 1) {
      //return original array of contacts
      return [...contacts];
    }

    //if something was found, return the filtered array
    return filteredArray;
  }

}
