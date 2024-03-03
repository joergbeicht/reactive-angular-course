import {Component, OnInit} from '@angular/core';
import { LoadingService } from './loading/loading.service';
import { MessagesService } from './messages/xmessages.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  // ACHTUNG: Inject aller Services die in den Components benutzt werden,
  // die von app.component erben. Das sind alle die in app-routing.module.ts stehen
  providers: [LoadingService, MessagesService]
})
export class AppComponent implements  OnInit {

    constructor() {

    }

    ngOnInit() {


    }

  logout() {

  }

}
