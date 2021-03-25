import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Document } from './document.model';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  documentSelectedEvent = new EventEmitter<Document>();
  documentChangedEvent = new EventEmitter<Document[]>();
  documentListChangedEvent = new Subject<Document[]>();
  private documents: Document[] = [];
  maxDocumentId: number;

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

  getDocuments() {
    this.http.get<{ message: string, documents: Document[] }>('http://localhost:3000/documents')
      .subscribe(
        // Success method
        (responseData) => {
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
    return this.http
      .get<{ message: string, document: Document }>('http://localhost:3000/documents/' + id);
  }

  addDocument(newDocument: Document) {
    if(!newDocument) {
      return;
    }

    newDocument.id = '';

    const headers = new HttpHeaders({'Content-Type':'application/json'});

    this.http.post<{ message: string, document: Document }>('http://localhost:3000/documents',
      newDocument,
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

    const pos = this.documents.findIndex(doc => doc.id === originalDocument.id);
    //const pos = this.documents.indexOf(originalDocument);

    if(pos < 0) {
      return;
    }

    //const stringDocument = JSON.stringify(newDocument);
    newDocument.id = originalDocument.id;

    const headers = new HttpHeaders({'Content-Type':'application/json'});

    this.http.put('http://localhost:3000/documents/' + originalDocument.id,
      newDocument, {headers: headers})
      .subscribe(
        (response: Response) => {
          this.documents[pos] = newDocument;
          //this.sortAndSend();
        }
      );
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }

    const pos = this.documents.findIndex(doc => doc.id === document.id);

    if (pos < 0) {
      return;
    }

    this.http.delete('http://localhost:3000/documents/' + document.id)
      .subscribe(
        (response: Response) => {
          this.documents.splice(pos, 1);
          this.sortAndSend();
        }
      );
  }

  sortAndSend() {
    this.documents.sort((a, b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0);
    this.documentListChangedEvent.next(this.documents.slice());
  }
}
