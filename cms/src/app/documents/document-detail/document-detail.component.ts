import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { WindRefService } from 'src/app/wind-ref.service';

import { Document } from '../document.model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'cms-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.css']
})
export class DocumentDetailComponent implements OnInit {
  nativeWindow: any;
  document: Document;
  id: string;

  constructor(
    private windRefServ: WindRefService,
    private docService: DocumentService,
    private router: Router,
    private activRoute: ActivatedRoute
  ) {
    this.nativeWindow = windRefServ.getNativeWindow();
  }

  ngOnInit() {
    this.activRoute.params
      .subscribe(
        (params: Params) => {
          this.id = params.id;
          this.docService.getDocument(this.id)
            .subscribe(
              response => {
                this.document = response.document;
              }
            )
        }
      );
  }

  onView() {
    if(this.document.url) {
      this.nativeWindow.open(this.document.url);
    }
  }

  onDelete() {
    this.docService.deleteDocument(this.document);
    this.router.navigate(['/documents']);
  }

}
