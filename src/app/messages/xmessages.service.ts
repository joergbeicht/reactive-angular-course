import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {filter} from 'rxjs/operators';


@Injectable()
export class MessagesService {

    private subject = new BehaviorSubject<string[]>([]);

    errors$: Observable<string[]> = this.subject.asObservable()
        .pipe(
            // messages && messages.length > 0
            // messages stellt sicher dass das messages Array existiert
            // &&  messages.length > 0 filtert das [] leere Array heraus
            // Die Error Meldung soll ja nur angezeigt werden,
            // wenn eine Message drin steht!
            filter(messages => messages && messages.length > 0)
        );

    showErrors(...errors: string[]) {
        this.subject.next(errors);
    }

    getHallo() {
        return '';
    }

}