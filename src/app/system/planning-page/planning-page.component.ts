import {Component, OnDestroy, OnInit} from '@angular/core';
import {BillService} from '../shared/services/bill.service';
import {CategoryService} from '../shared/services/category.service';
import {EventService} from '../shared/services/event.service';
import {combineLatest, Subscription} from 'rxjs';
import {Bill} from '../shared/interfaces/bill.interface';
import {Category} from '../shared/interfaces/category.interface';
import {AppEvent} from '../shared/interfaces/event.interface';

@Component({
  selector: 'app-planning-page',
  templateUrl: './planning-page.component.html'
})
export class PlanningPageComponent implements OnInit, OnDestroy {

    isLoaded = false;
    bill: Bill;
    categories: Category[] = [];
    events: AppEvent[] = [];

    private _sub: Subscription;

    constructor(private _billService: BillService,
                private _categoryService: CategoryService,
                private _eventService: EventService) {
    }

    ngOnInit() {
        this._sub = combineLatest(
            this._billService.getBill(),
            this._categoryService.getCategories(),
            this._eventService.getEvents())
            .subscribe((data: Array<object>) => {
                this.bill = data[0]['bill'][0];
                this.categories = data[1]['categories'];
                this.events = data[2]['events'];

                this.isLoaded = true;
            });
    }

    getCategoryCost(categ: Category): number {
      const categEvents = this.events.filter((event) =>
          categ.id === event.category_id && event.type === 'outcome'
      );

      return categEvents.reduce((total, e) => {
        total += e.amount;
        return total;
      }, 0);
    }

    private _getPercent(categ: Category): number {
        const percent = (100 * this.getCategoryCost(categ)) / categ.capacity;
        return percent > 100 ? 100 : percent;
    }

    getCategPercent(categ: Category): string {
      return `${this._getPercent(categ)}%`;
    }

    getCategColorClass(categ: Category): string {
     const percent = this._getPercent(categ);
     return percent < 60 ? 'success' : percent >= 100 ? 'danger' : 'warning';
    }

    ngOnDestroy() {
      if (this._sub) {
        this._sub.unsubscribe();
      }
    }
}
