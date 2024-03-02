import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject,of} from 'rxjs';
import {concatMap, finalize, tap} from 'rxjs/operators';


@Injectable()
export class LoadingService {

    private loadingSubject = new BehaviorSubject<boolean>(false);

    //Damit wird das Observable mit false beim Start als Init geladen
    loading$: Observable<boolean> = this.loadingSubject.asObservable();

    constructor() {
        console.log("Loading service created ...");        
    }

    showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
        return of(null)
            .pipe(
                tap(() => this.loadingOn()),
                concatMap(() => obs$),
                finalize(() => this.loadingOff())
            );
    }

    loadingOn() {
        //.next bewirkt ein emit an das Observable
        this.loadingSubject.next(true);

    }

    loadingOff() {
        //.next bewirkt ein emit an das Observable
        this.loadingSubject.next(false);
    }

}