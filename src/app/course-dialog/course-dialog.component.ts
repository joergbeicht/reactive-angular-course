import { AfterViewInit, Component, DestroyRef, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Course } from "../model/course";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import * as moment from 'moment';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CoursesService } from '../services/courses.service';
import { LoadingService } from '../loading/loading.service';

@Component({
    selector: 'course-dialog',
    templateUrl: './course-dialog.component.html',
    styleUrls: ['./course-dialog.component.css'],
    // LoadingService muss hier separat injected werden, da CourseDialogComponent
    // 
    providers: [LoadingService]
})
export class CourseDialogComponent implements AfterViewInit {

    form: FormGroup;

    course: Course;

    constructor(
        public loadingService: LoadingService,
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

        const saveCourse$ = this.coursesStore.saveCourse(this.course.id, changes);
   
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

