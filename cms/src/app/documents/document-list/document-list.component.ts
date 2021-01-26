import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  documents: Document[] = [
    new Document(1, 'Document 01', 'This is the first document', 'thisWillBeTheUrl', null),
    new Document(2, 'Document 02', 'This is the second document', 'thisWillBeTheUrl', null),
    new Document(3, 'Document 03', 'This is the third document', 'thisWillBeTheUrl', null),
    new Document(4, 'Document 04', 'This is the fourth document', 'thisWillBeTheUrl', null),
    new Document(5, 'Document 05', 'This is the fifth document', 'thisWillBeTheUrl', null)
  ]

  constructor() { }

  ngOnInit(): void {
  }

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }

}
