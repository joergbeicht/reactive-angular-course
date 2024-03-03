import { AfterViewInit, Component, DestroyRef, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Course } from "../model/course";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import * as moment from 'moment';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CoursesService } from '../services/courses.service';
import { LoadingService } from '../loading/loading.service';
import { MessagesService } from '../messages/xmessages.service';

@Component({
    selector: 'course-dialog',
    templateUrl: './course-dialog.component.html',
    styleUrls: ['./course-dialog.component.css'],
    // LoadingService und MessagesService erstellen jeweils eine neue Instanz des jeweiligen Service
    // LoadingService und MessagesService müssen hier separat injected werden, obwohl
    // beide bereits in app.component instanziiert werden.
    // Das sit zwar richtig, dass beide bereits in app.component instanziiert werden
    // aber CourseDialogComponent ist kein Kind aus app.component siehe auch router
    // on router findest du alle Kinder
    // CourseDialogComponent ist also auf einer anderen Ebene, daher muss hier 
    // erneut instnaziiert werden, damit die jeweiligen Servides benutzt werden können
    providers: [LoadingService, MessagesService]
})
export class CourseDialogComponent implements AfterViewInit {

    form: FormGroup;

    course: Course;

    constructor(
        public loadingService: LoadingService,
        public messagesService: MessagesService,
        private destroyRef: DestroyRef,
        private coursesStore: CoursesService,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) course: Course) {

        this.course = course;

        this.form = fb.group({
            description: [course.description, Validators.required],
            category: [course.category, Validators.required],
            releasedAt: [moment(), Validators.required],
            longDescription: [course.longDescription, Validators.required]
        });
    }

    ngAfterViewInit() {

    }

    save() {

        const changes = this.form.value;

        const saveCourse$ = this.coursesStore.saveCourse(this.course.id, changes)
            .pipe(
                catchError(err => {
                    const message = 'Could not save course';
                    console.log(message, err);
                    this.messagesService.showErrors(message);
                    return throwError(err);
                })
            )
   
        console.log('saveCourse$', saveCourse$);

        this.loadingService.showLoaderUntilCompleted(saveCourse$)    
        .subscribe(val => {
            this.dialogRef.close(val);
        })

    }

    close() {
        this.dialogRef.close();
    }

}
function takeUntilDestroyed(destroyRef: any): import("rxjs").OperatorFunction<any, unknown> {
    throw new Error('Function not implemented.');
}

