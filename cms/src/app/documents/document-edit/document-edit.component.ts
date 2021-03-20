import { Component, OnInit } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Document } from '../document.model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'cms-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css']
})
export class DocumentEditComponent implements OnInit {
  originalDocument: Document;
  document: Document;
  editMode: boolean = false;
  documentForm: FormGroup;

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute
    ) { }

  ngOnInit() {
     this.route.params
      .subscribe(
        (params: Params) => {
          const id = params['id'];
          if(!id) {
            this.editMode = false;
            return;
          }

          this.originalDocument = this.documentService.getDocument(id);

          if(!this.originalDocument) {
            return;
          }

          this.editMode = true;
          this.document = JSON.parse(JSON.stringify(this.originalDocument));
        }
      );
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newDocument = new Document(value.id, value.title, value.description, value.url, value.children);
    if(this.editMode) {
      this.documentService.updateDocument(this.originalDocument, newDocument);
    } else {
      this.documentService.addDocument(newDocument);
    }
    this.router.navigate(['/documents', newDocument.id], { relativeTo: this.route });
  }

  onCancel() {
    this.router.navigate(['/documents'], { relativeTo: this.route });
  }
}
