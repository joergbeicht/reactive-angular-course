import { Component, OnInit } from '@angular/core';
import { Course, sortCoursesBySeqNo } from '../model/course';
import { interval, noop, Observable, of, throwError, timer } from 'rxjs';
import { catchError, delay, delayWhen, filter, finalize, map, retryWhen, shareReplay, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { CoursesService } from '../services/courses.service';
import { LoadingService } from '../loading/loading.service';
import { MessagesService } from '../messages/xmessages.service';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  beginnerCourses$: Observable<Course[]>;

  advancedCourses$: Observable<Course[]>;

  constructor(
    private messagesService: MessagesService,
    public loadingService: LoadingService,
    private coursesService: CoursesService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.reloadCourses();
  }

  reloadCourses(event?: any) {

    console.log('reloadCourses', event);

    // vorher
    // this.loadingService.loadingOn();

    // const courses$ = this.coursesService.loadAllCourses()
    //   .pipe(
    //     map(courses => courses.sort(sortCoursesBySeqNo)),
    //     finalize(() => this.loadingService.loadingOff())
    //   )

    // this.beginnerCourses$ = courses$.pipe(
    //   map(courses => courses.filter(course => course.category == 'BEGINNER'))
    // );

    // this.advancedCourses$ = courses$.pipe(
    //   map(courses => courses.filter(course => course.category == 'ADVANCED'))
    // );

    // nachher
    const courses$ = this.coursesService.loadAllCourses()
      .pipe(
        map(courses => courses.sort(sortCoursesBySeqNo)),
        catchError(err => {
          const message = 'Could not load courses';
          this.messagesService.showErrors(message);
          console.log(message, err);
          // gibt ein neues Observable zurtück und terminiert das reigesteckt Observable!
          return throwError(err);
        })
      )

    // showLoaderUntilCompleted<Course[]> bedeutet,
    // Das Observable emits ein Array of courses
    // loadCourses$ ist damit typsiert und der weitere Code ist type save, obwohl
    // showLoaderUntilCompleted eine generische Methode ist
    const loadCourses$ = this.loadingService.showLoaderUntilCompleted<Course[]>(courses$);

    this.beginnerCourses$ = loadCourses$.pipe(
      // map greift in das Array hinein, gibt aber ein Observable zurück
      map(courses => courses.filter(course => course.category == 'BEGINNER'))
    );

    this.advancedCourses$ = loadCourses$.pipe(
      // map greift in das Array hinein, gibt aber ein Observable zurück
      map(courses => courses.filter(course => course.category == 'ADVANCED'))
    );



  }

}




