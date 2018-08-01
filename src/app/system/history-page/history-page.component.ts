import {Component, OnDestroy, OnInit} from '@angular/core';
import {combineLatest, Subscription} from 'rxjs';
import * as moment from 'moment';
import {CategoryService} from '../shared/services/category.service';
import {EventService} from '../shared/services/event.service';
import {Category} from '../shared/interfaces/category.interface';
import {AppEvent} from '../shared/interfaces/event.interface';

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html'
})
export class HistoryPageComponent implements OnInit, OnDestroy {

    categories: Category[] = [];
    events: AppEvent[] = [];
    filteredEvents: AppEvent[] = [];

    isLoaded = false;
    private _sub: Subscription;

    chartData = [];
    isFilterVisible = false;

    constructor(private _categoryService: CategoryService,
                private _eventService: EventService) {
    }

    ngOnInit() {
        this._sub = combineLatest(this._categoryService.getCategories(),
            this._eventService.getEvents())
            .subscribe((data: Array<object>) => {
                this.categories = data[0]['categories'];
                this.events = data[1]['events'];

                this._setOriginalEvents();
                this._calculateChartData();

                this.isLoaded = true;
            });
    }

    private _setOriginalEvents() {
        this.filteredEvents = this.events.slice();
    }

    private _calculateChartData() {
      this.chartData = [];

      this.categories.forEach((category) => {
        const categEvent = this.filteredEvents.filter((event) =>
            event.category_id === category.id && event.type === 'outcome'
        );
        this.chartData.push({
            name: category.name,
            value: categEvent.reduce((total, e) => {
              total += e.amount;
              return total;
            }, 0)
        });
      });
    }

    private _toggleFilterVisibility(dir: boolean) {
        this.isFilterVisible = dir;
    }

    openFilter() {
        this._toggleFilterVisibility(true);
    }

    onFilterApply(filterData) {
        this._toggleFilterVisibility(false);
        this._setOriginalEvents();

        const startPeriod = moment().startOf(filterData.period).startOf('d');
        const endPeriod = moment().endOf(filterData.period).endOf('d');

        this.filteredEvents = this.filteredEvents
            .filter((e) => {
                return filterData.types.includes(e.type);
            })
            .filter((e) => {
                return filterData.categories.includes(e.category_id.toString());
            })
            .filter((e) => {
                const momentDate = moment(e.date, 'DD.MM.YYYY HH:mm:ss');
                return momentDate.isBetween(startPeriod, endPeriod);
            });

        this._calculateChartData();
    }

    onFilterCancel() {
        this._toggleFilterVisibility(false);
        this._setOriginalEvents();
        this._calculateChartData();
    }

    ngOnDestroy() {
        if (this._sub) {
            this._sub.unsubscribe();
        }
    }
}
