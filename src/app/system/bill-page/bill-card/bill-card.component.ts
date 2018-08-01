import {Component, Input, OnInit} from '@angular/core';
import {Bill} from '../../shared/interfaces/bill.interface';

@Component({
  selector: 'app-bill-card',
  templateUrl: './bill-card.component.html'
})
export class BillCardComponent implements OnInit {

  usd: number;
  eur: number;

  @Input() bill: Bill;
  @Input() currencies: any;

  ngOnInit() {
    this.currencies.map((curr) => {
      switch (curr.cc) {
          case 'USD':
              this.usd = this.bill.value / curr.rate;
          // falls through
          case 'EUR':
              this.eur = this.bill.value / curr.rate;
      }
    });
  }
}
