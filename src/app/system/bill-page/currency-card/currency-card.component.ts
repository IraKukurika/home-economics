import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-currency-card',
  templateUrl: './currency-card.component.html'
})
export class CurrencyCardComponent {
    @Input() currencies: any;
}
