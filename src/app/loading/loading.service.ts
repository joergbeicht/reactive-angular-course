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

    // https://entwickler.de/typescript/grundkurs-typescript-001
    // siehe Type T suche nach Klassen und Methoden parametrisieren mit Generics
    showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
        // of erstellt ein default Observable das mit null initialisiert wird
        // nachdem das Observable den null Wert empfangen hat, startet die  
        // pipe und tap usw.
        return of(null)
            .pipe(
                tap(() => this.loadingOn()),
                // Das Observable soll aber nicht null von init zurückgeben,
                // sondern das reingesteckte Observable
                concatMap(() => obs$),
                // erst enn das Input Observable obs$: Observable<T> fertig ist soll finalize erfolgen
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