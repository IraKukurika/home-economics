import {BaseApi} from '../../../shared/core/base-api';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AppEvent} from '../interfaces/event.interface';

@Injectable()
export class EventService extends BaseApi {
    private _token = this.getToken();

    constructor(public http: HttpClient) {
        super(http);
    }

    addEvent(eventData: AppEvent): Observable<object> {
        return this.post(`post-event?token=${this._token}`, eventData);
    }

    getEvents(): Observable<object> {
        return this.get('get-events');
    }

    getEventById(id: string): Observable<object> {
        return this.get(`get-event/${id}`);
    }
}
