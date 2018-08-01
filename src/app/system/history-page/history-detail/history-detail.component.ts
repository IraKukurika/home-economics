import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Subscription} from 'rxjs';
import {mergeMap} from 'rxjs/internal/operators';
import {Location} from '@angular/common';

import {EventService} from '../../shared/services/event.service';
import {CategoryService} from '../../shared/services/category.service';
import {AppEvent} from '../../shared/interfaces/event.interface';
import {Category} from '../../shared/interfaces/category.interface';

@Component({
  selector: 'app-history-detail',
  templateUrl: './history-detail.component.html'
})
export class HistoryDetailComponent implements OnInit, OnDestroy {

    event: AppEvent;
    category: Category;

    isLoaded = false;
    private _sub: Subscription;

    constructor(private _route: ActivatedRoute,
                private _eventService: EventService,
                private _categoryService: CategoryService,
                private _location: Location) {
    }


    ngOnInit() {
        this._sub = this._route.params
            .pipe(mergeMap((params: Params) => this._eventService.getEventById(params['id'])))
            .pipe(mergeMap((res: { event: AppEvent }) => {
                this.event = res['event'];
                return this._categoryService.getCategoryById(res['event'].category_id);
            }))
            .subscribe((res: { category: Category }) => {
                this.category = res['category'];

                this.isLoaded = true;
            });
    }

    backClicked() {
        this._location.back();
    }

    ngOnDestroy() {
        if (this._sub) {
            this._sub.unsubscribe();
        }
    }
}
