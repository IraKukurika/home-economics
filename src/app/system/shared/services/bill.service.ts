import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BaseApi} from '../../../shared/core/base-api';
import {Observable} from 'rxjs';
import {Bill} from '../interfaces/bill.interface';

@Injectable()
export class BillService extends BaseApi {

    constructor(public http: HttpClient) {
        super(http);
    }

    getBill(): Observable<object> {
        return this.get('get-bill');
    }

    updateBill(bill: Bill): Observable<Bill> {
        return this.put(`bills/${bill.id}`, bill);
    }

    getCurrency(): Observable<any> {
        return this.http.get(`https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json`);
    }
}
