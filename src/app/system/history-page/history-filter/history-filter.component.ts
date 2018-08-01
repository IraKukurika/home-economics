import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Category} from '../../shared/interfaces/category.interface';

@Component({
  selector: 'app-history-filter',
  templateUrl: './history-filter.component.html',
  styleUrls: ['./history-filter.component.scss']
})
export class HistoryFilterComponent {

    timePeriods = [
        {type: 'd', label: 'Day'},
        {type: 'w', label: 'Week'},
        {type: 'M', label: 'Month'},
    ];
    selectedPeriod = 'd';
    types = [
        {type: 'income', label: 'Income'},
        {type: 'outcome', label: 'Outcome'}
    ];
    selectedTypes: string[] = [];
    selectedCategories: string[] = [];

    @Input() categories: Category[] = [];
    @Output() filterCancel = new EventEmitter<void>();
    @Output() filterApply = new EventEmitter<object>();

    closeFilter() {
      this.selectedPeriod = 'd';
      this.selectedTypes = [];
      this.selectedCategories = [];
      this.filterCancel.emit();
    }

    private _calculateInputParams(field: string, checked: boolean, value: string) {
        if (checked) {
            return !this[field].includes(value) ? this[field].push(value) : null;
        } else {
            this[field] = this[field].filter(i => i !== value);
        }
    }

    handleChangeType({checked, value}) {
      this._calculateInputParams('selectedTypes', checked, value);
    }

    handleChangeCategory({checked, value}) {
        this._calculateInputParams('selectedCategories', checked, value);
    }

    onApplyFilter() {
      this.filterApply.emit({
          types: this.selectedTypes,
          categories: this.selectedCategories,
          period: this.selectedPeriod
      });
    }
}
