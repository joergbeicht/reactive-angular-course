import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {LoadingService} from './loading.service';

@Component({
  selector: 'loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})

// Das coole ist LoadingComponent muss nirgends in keine anderen 
// Component die den Spinner nutzen möchte bekannt gemacht werden.
// Die Loading Componenten kennt nur den Service fertig.
export class LoadingComponent implements OnInit {


  constructor(public loadingService: LoadingService) {

  }

  ngOnInit() {

  }


}