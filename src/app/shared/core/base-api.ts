import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable()
export class BaseApi {
    // private _baseUrl = 'http://localhost:8000/api/';
    private _baseUrl = 'http://portfolio.s-host.net/api-economics/public/api/';

    headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    });

    constructor(public http: HttpClient) {}

    private _getUrl(url: string = ''): string {
        return this._baseUrl + url;
    }

    public getToken() {
        return localStorage.getItem('token');
    }

    public get(url: string = '') {
        return this.http.get(this._getUrl(url));
    }

    public post(url: string = '', data: any = {}): Observable<any> {
        return this.http.post(this._getUrl(url), data, {headers: this.headers});
    }

    public put(url: string = '', data: any = {}): Observable<any> {
        return this.http.put(this._getUrl(url), data);
    }
}
