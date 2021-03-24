import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  // //event emitter object
  // @Output() selectedFeatureEvent = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  // //function respinsible to fire the event
  // onSelected(selectedEvent: string) {
  //   //emit event and pass the data of the event
  //   this.selectedFeatureEvent.emit(selectedEvent);
  // }

}
