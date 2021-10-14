import {Component, Injectable} from '@angular/core';
import {Title} from "@angular/platform-browser";

@Injectable({providedIn: 'root'})
@Component({
  selector: '.d-flex.justify-content-center.min-vh-100.align-items-center',
  templateUrl: './page-not-found.component.html'
})
export class PageNotFoundComponent {
  constructor(
    private title: Title
  ) {
    title.setTitle("404 Not Found")
  }
}
