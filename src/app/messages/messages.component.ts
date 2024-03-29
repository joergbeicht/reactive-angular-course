import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {Message} from '../model/message';
import {tap} from 'rxjs/operators';
import {MessagesService} from './xmessages.service';

@Component({
  selector: 'mymessages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']  
})
export class MessagesComponent implements OnInit {

  showMessages = false;

  errors$: Observable<string[]>;


  constructor(private messagesService: MessagesService) {

      console.log("Created messages component");

      this.messagesService.getHallo();
  }

  ngOnInit() {
      this.errors$ = this.messagesService.errors$
          .pipe(
              tap(() => this.showMessages = true)
          );

  }


  onClose() {
      this.showMessages = false;

  }

}