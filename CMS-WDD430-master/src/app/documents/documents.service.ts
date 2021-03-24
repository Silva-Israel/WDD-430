import { Injectable } from '@angular/core';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {
  documents: Document[] = [];
  // //event emiter for changes in the document
  // documentChangedEvent = new EventEmitter<Document[]>();

  //property for max id
  maxDocumentId: number;

  //subject property
  documentListChangedEvent = new Subject<Document[]>();

  constructor(private http: HttpClient) {
    //init documents to be the ones coming from mock
    // this.documents = MOCKDOCUMENTS;
    // this.getDocuments();
    //get the max id at init time
    // this.maxDocumentId = this.getMaxId();
  }

  //method to get all documents
  getDocuments() {
    // //return a copy of the array of documents
    // return this.documents.slice();

    //use http get
    this.http.get<{ message: string, documents: Document[] }>('http://localhost:3000/documents')
      //subscribe to observable returning
      .subscribe(
        //sucess function
        (documentData) => {
          //assign the array of documents received to the documents class attribute
          this.documents = documentData.documents;
          //sort alphabetically by name
          this.documents.sort((a, b) => (a.name < b.name) ? 1 : (a.name > b.name) ? -1 : 0)
          // signal that the list has changed
          this.documentListChangedEvent.next(this.documents.slice());
        },
        (error: any) => {
          console.log(error);
        }
      )
  }

  //method to get a single specific document
  getDocument(id: string): Document {
    for (const document of this.documents) {
      if (document.id === id) {
        return document;
      }
    }
    return null;
  }

  //method to get max id number in document list
  getMaxId(): number {
    //variable to hold max Id
    let maxId = 0;
    //loop through the document list
    for (const document of this.documents) {
      //get current id as a number
      const currentId = +document.id;
      //if the current id is greater than max ID...
      if (currentId > maxId) {
        //then max id is the current id
        maxId = currentId;
      }
    }
    //return that max id
    return maxId;
  }

  //method to add a document when user press add button
  addDocument(document: Document) {
    //check if document is defined
    if (!document) {
      //if so, exit function
      return;
    }

    //create header
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    //convert object to string to send on request
    document.id = '';
    const strDocument = JSON.stringify(document);

    //send post request with document and header
    this.http.post('http://localhost:3000/documents', strDocument, { headers: headers })
      //subscribe to response
      .subscribe(
        (documents: Document[]) => {
          //assign document list
          this.documents = documents;
          //emit the change
          this.documentListChangedEvent.next(this.documents.slice());
        });
  }

  //method to update/replace an existing document
  updateDocument(originalDocument: Document, newDocument: Document) {
    //check if documents are undefined
    if (!originalDocument || !newDocument) {
      //if so, exit
      return;
    }

    //get position of original document
    const pos = this.documents.indexOf(originalDocument);
    //if the position is not in the array
    if (pos < 0) {
      //exit
      return;
    }

    //set headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    //convert document object to string
    const strDocument = JSON.stringify(newDocument);

    //send patch request with original document id, new document object and headers
    this.http.patch('http://localhost:3000/documents/' + originalDocument.id
      , strDocument
      , { headers: headers })
      //subscribe to response
      .subscribe(
        (documents: Document[]) => {
          //assign updated document list
          this.documents = documents;
          //emit change
          this.documentListChangedEvent.next(this.documents.slice());
        });
  }

  //method to delete a document via request to server
  deleteDocument(document: Document) {
    //check if documents are undefined
    if (document === null || document === undefined) {
      //exit
      return;
    }

    //send request to delete using document id in params
    this.http.delete('http://localhost:3000/documents/' + document.id)
      //subscribe to response
      .subscribe(
        (documents: Document[]) => {
          //assign modified document list
          this.documents = documents;
          //emit changes
          this.documentListChangedEvent.next(this.documents.slice());
        });
  }

  //method to store documents in database with put request
  // storeDocuments() {
  //   //stringify the list of documnts
  //   let documents = JSON.stringify(this.documents);

  //   //create header for content type
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json'
  //   });

  //   //put method with url, documents object to replace, and headers
  //   this.http.put('https://cms-app-d5fce.firebaseio.com/documents.json', documents, { headers: headers })
  //     //subscribe to response
  //     .subscribe(
  //       () => {
  //         //once a response has been received, signal that the document list has changed, send copy of list
  //         this.documentListChangedEvent.next(this.documents.slice());
  //       }
  //     )
  // }
}
