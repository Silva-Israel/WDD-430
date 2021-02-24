import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Document } from './document.model';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  documentSelectedEvent = new EventEmitter<Document>();
  documentChangedEvent = new EventEmitter<Document[]>();
  documentListChangedEvent = new Subject<Document[]>();
  documents: Document[] = [];
  maxDocumentId: number;
  url: string = 'https://israelsilva-cms.firebaseio.com/documents.json';

  constructor(private http: HttpClient) {
    this.getDocuments();
  }

  getMaxId(): number {
    let maxId = 0;

    this.documents.forEach(
      document => {
        let currentId = +document.id;
        if(currentId > maxId) {
          maxId = currentId;
        }
      }
    );

    return maxId;
  }

  storeDocuments() {
    const docString = JSON.stringify(this.documents);
    const header = new HttpHeaders;

    header.set('Content-Type', 'application/json');
    this.http
      .put(
        this.url, docString
      )
      .subscribe(
        () => {
          this.documentListChangedEvent.next(this.documents.slice());
        }
      );
  }

  getDocuments() {
    this.http
      .get<Document[]>(
        this.url)
      .subscribe(
        // Success method
        (documents: Document[]) => {
          this.documents = documents;
          this.maxDocumentId = this.getMaxId();
          documents.sort();
          this.documentListChangedEvent.next(this.documents.slice());
        },
        // Error method
        (error: any) => {
          console.log(error);
        }
      );
    return this.documents;
  }

  getDocument(id: String): Document {
    return this.documents.find((document) => document.id === id);
  }

  addDocument(newDocument: Document) {
    if(!newDocument) {
      return;
    }

    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();

    this.documents.push(newDocument);

    this.storeDocuments();
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if(!originalDocument || !newDocument) {
      return;
    }

    var pos = this.documents.indexOf(originalDocument);
    if(pos < 0) {
      return;
    }

    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    var documentsListClone = this.documents.slice();

    //this.documentListChangedEvent.next(documentsListClone);
    this.storeDocuments();
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }

    var pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }

    this.documents.splice(pos, 1);

    //var documentsListClone = this.documents.slice();
    //this.documentListChangedEvent.next(documentsListClone);
    this.storeDocuments();
  }
}
