import {Component, Input, OnInit} from '@angular/core';
import {Category} from '../../shared/interfaces/category.interface';
import {AppEvent} from '../../shared/interfaces/event.interface';

@Component({
  selector: 'app-history-events',
  templateUrl: './history-events.component.html'
})
export class HistoryEventsComponent implements OnInit {

    searchValue = '';
    searchPlaceholder = 'Amount';
    searchField = 'amount';

    @Input() categories: Category[] = [];
    @Input() events: AppEvent[] = [];

    constructor() {}

    ngOnInit() {
        this.events.forEach((event) => {
            event.categoryName = this.categories.find(
                (category) => category.id === event.category_id
            ).name;
        });
    }

    getEventClass(event: AppEvent) {
        return {
            'label': true,
            'label-danger': event.type === 'outcome',
            'label-success': event.type === 'income'
        };
    }

    changeCriteria(field: string) {
        const namesMap = {
            amount: 'Amount',
            date: 'Date',
            categoryName: 'Category',
            type: 'Type'
        };
        this.searchPlaceholder = namesMap[field];
        this.searchField = field;
    }
}
