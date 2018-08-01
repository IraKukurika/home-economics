import {Component, OnDestroy, OnInit} from '@angular/core';
import {BillService} from '../shared/services/bill.service';
import {combineLatest, Subscription} from 'rxjs';
import {Bill} from '../shared/interfaces/bill.interface';

@Component({
  selector: 'app-bill-page',
  templateUrl: './bill-page.component.html'
})
export class BillPageComponent implements OnInit, OnDestroy {
    bill: Bill;
    currencies: any[] = [];

    private _sub: Subscription[] = [];
    isLoaded = false;

    constructor(private _billService: BillService) {
    }

    ngOnInit() {
        this._sub.push(
            combineLatest(
                this._billService.getBill(),
                this._billService.getCurrency()
            ).subscribe(
                (data: Array<object>) => {
                    this.bill = data[0]['bill'][0];
                    this._getCurrencies(data[1]);

                    this.isLoaded = true;
                },
                error => {
                    console.log(error);
                })
        );
    }

    private _getCurrencies(currency) {
        currency.map((curr) => {
            switch (curr.cc) {
                case 'USD':
                case 'EUR':
                case 'RUB':
                    this.currencies.push(curr);
            }
        });
    }

    onRefresh() {
        this.isLoaded = false;
        this.currencies = [];
        this._sub.push(this._billService.getCurrency()
            .subscribe((currency: any) => {
                this._getCurrencies(currency);
                this.isLoaded = true;
            }));
    }

    ngOnDestroy() {
        if (this._sub.length) {
            for (const sub of this._sub) {
                sub.unsubscribe();
            }
        }
    }
}
