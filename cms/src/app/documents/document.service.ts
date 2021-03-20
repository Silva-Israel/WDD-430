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
  url: string = 'http://localhost:3000/documents/';

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

  // storeDocuments() {
  //   const docString = JSON.stringify(this.documents);
  //   const header = new HttpHeaders;

  //   header.set('Content-Type', 'application/json');
  //   this.http
  //     .put(
  //       this.url, docString
  //     )
  //     .subscribe(
  //       () => {
  //         this.documentListChangedEvent.next(this.documents.slice());
  //       }
  //     );
  // }

  getDocuments() {
    this.http.get<{ message: string, document: Document[] }>(this.url)
      .subscribe(
        // Success method
        (responseData: any) => {
          this.documents = responseData.documents;
          this.sortAndSend();
        },
        // Error method
        (error: any) => {
          console.log(error);
        }
      );
  }

  getDocument(id: String) {
    return this.http.get<{ message: string, document: Document }>(this.url + id);
    // if (!this.documents) {
    //   return null;
    // }

    // for (let document of this.documents) {
    //   if (document.id === id) {
    //     return document;
    //   }
    // }

    // return null;
  }

  addDocument(document: Document) {
    if(!document) {
      return;
    }

    document.id = '';

    const headers = new HttpHeaders({'Content-Type':'application/json'});

    this.http.post<{ message: string, document: Document }>(this.url,
      document,
      { headers: headers })
      .subscribe(
        (responseData) => {
          this.documents.push(responseData.document);
          this.sortAndSend();
        }
      );
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if(!originalDocument || !newDocument) {
      return;
    }

    // const pos = this.documents.indexOf(originalDocument);
    const pos = this.documents.findIndex(doc => doc.id === originalDocument.id);

    if(pos < 0) {
      return;
    }

    newDocument.id = originalDocument.id;
    //newDocument._id = originalDocument._id;

    const headers = new HttpHeaders({'Content-Type':'application/json'});

    this.http.put(this.url + originalDocument.id,
      newDocument, {headers: headers})
      .subscribe(
        (response: Response) => {
          this.documents[pos] = newDocument;
          this.sortAndSend();
        }
      );

    //this.storeDocuments();
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }

    const pos = this.documents.findIndex(doc => doc.id === document.id);

    if (pos < 0) {
      return;
    }

    this.http.delete(this.url + document.id)
      .subscribe(
        (response: Response) => {
          this.documents.splice(pos, 1);
          this.sortAndSend();
        }
      );

    //this.storeDocuments();
  }

  sortAndSend() {
    this.documents.sort((a, b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0);
    this.documentListChangedEvent.next(this.documents.slice());
  }
}
