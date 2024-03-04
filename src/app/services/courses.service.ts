import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Course } from '../model/course';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Lesson } from '../model/lesson';

@Injectable({
    providedIn: 'root'
})
export class CoursesService {

    constructor(private http: HttpClient) { }

    loadCourseById(courseId: number) {
        return this.http.get<Course>(`/api/courses/${courseId}`)
            .pipe(
                shareReplay()
            )
        //   .toPromise();
    }

    loadAllCourseLessons(courseId: number) {
        return this.http.get<Lesson[]>('/api/lessons', {
            params: {
                pageSize: '10000',
                courseId: courseId.toString()
            }
        })
            .pipe(
                map(res => res['payload']),
                shareReplay()
            )
            // .toPromise();
    }

    loadAllCourses(): Observable<Course[]> {
        return this.http.get<Course[]>('/api/courses')
            // wandelt das Observable in ein weiteres Observable
            .pipe(
                // Map erlaubt ein mapping
                // wir greifen das property payload raus was eine Course Liste ist
                map(res => res['payload']),
                // Sorgt dafür dass http nicht mehrfach ausgeführt wird!
                // siehe // courses$.subscribe(val => console.log('val', val));
                // nimm shareReplay() einmal weg und führe 
                // courses$.subscribe(val => console.log('val', val));
                // dann siehst du in der Network Response dass loadAllCourses mehrfach
                // ausgeführt wird
                shareReplay()
            );
    }

    saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {

        return this.http.put(`/api/courses/${courseId}`, changes)
            .pipe(
                shareReplay()
            );
    }

    searchLessons(search: string): Observable<Lesson[]> {
        return this.http.get<Lesson[]>('/api/lessons', {
            params: {
                filter: search,
                pageSize: '100'
            }
        })
            .pipe(
                map(res => res['payload']),
                shareReplay()
            );
    }
}