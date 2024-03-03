import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { catchError, map, shareReplay, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/xmessages.service";
import { response } from "express";

@Injectable({
    providedIn: 'root'
})
export class CoursesStore {

    private subject = new BehaviorSubject<Course[]>([]);

    courses$: Observable<Course[]> = this.subject.asObservable();

    constructor(
        private http: HttpClient,
        private loadingService: LoadingService,
        private messagesService: MessagesService
    ) {
        this.loadAllCourses();
    }

    private loadAllCourses() {
        const loadCourses$ = this.http.get<Course[]>('api/courses')
            .pipe(
                map(response => response['payload']),
                catchError(err => {
                    const message = 'Could not load courses';
                    this.messagesService.showErrors(message);
                    console.log(message, err);
                    // gibt ein neues Observable zurtück und terminiert das reigesteckt Observable!
                    return throwError(err);
                }),
                tap(courses => this.subject.next(courses))
            )
        this.loadingService.showLoaderUntilCompleted(loadCourses$)
            .subscribe();
    }

    filterByCategory(category: string): Observable<Course[]> {
        return this.courses$
            .pipe(
                map(courses => courses.filter(course => course.category == category)
                    .sort(sortCoursesBySeqNo)
                )
            )
    }

    saveCourse(courseId:string, changes: Partial<Course>):Observable<any> {
        return this.http.put(`/api/courses/${courseId}`, changes)
            .pipe(
                shareReplay()
            );
    }
}