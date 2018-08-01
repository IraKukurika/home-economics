import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import * as moment from 'moment';
import {mergeMap} from 'rxjs/internal/operators';

import {EventService} from '../../shared/services/event.service';
import {AuthService} from '../../../shared/services/auth.service';
import {BillService} from '../../shared/services/bill.service';
import {Subscription} from 'rxjs';
import {Message} from '../../../shared/interfaces/message.interface';
import {Category} from '../../shared/interfaces/category.interface';
import {MessageModel} from '../../../shared/models/message.model';
import {AppEventModel} from '../../shared/models/event.model';
import {Bill} from '../../shared/interfaces/bill.interface';

@Component({
    selector: 'app-add-event',
    templateUrl: './add-event.component.html'
})
export class AddEventComponent implements OnInit, OnDestroy {

    types = [
        {type: 'income', label: 'Income'},
        {type: 'outcome', label: 'Outcome'}
    ];

    message: Message;
    private _subscriptions: Subscription[] = [];

    @Input() categories: Category[] = [];

    constructor(
        private _eventService: EventService,
        private _router: Router,
        private _authService: AuthService,
        private _billService: BillService
    ) {}

    ngOnInit() {
        this.message = new MessageModel('danger', '');
    }

    onSubmit(form: NgForm) {
        const {category_id, type, amount, description} = form.value;

        const event = new AppEventModel(
            +category_id,
            type,
            amount,
            description,
            moment().format('DD.MM.YYYY HH:mm:ss')
        );

        this._subscriptions.push(
            this._billService.getBill()
                .subscribe(
                    (res: { bill: Bill }) => {
                        let value = 0;
                        if (type === 'outcome') {
                            if (amount > res.bill[0].value) {
                                this.message = {
                                    text: `There are not enough funds on the account. You don't have enough ${amount - res.bill[0].value}`,
                                    type: 'danger'
                                };
                                return;
                            } else {
                                value = res.bill[0].value - amount;
                            }
                        } else {
                            value = res.bill[0].value + amount;
                        }

                        this._subscriptions.push(
                            this._billService.updateBill(
                                {
                                    value,
                                    currency: res.bill[0].currency,
                                    id: res.bill[0].id
                                })
                                .pipe(mergeMap(() => this._eventService.addEvent(event)))
                                .subscribe(
                                    () => {
                                        form.setValue({
                                            category_id: 1,
                                            type: 'outcome',
                                            amount: 0,
                                            description: ' '
                                        });
                                    },
                                    (error) => {
                                        if (error.error.error === 'Token Expired') {
                                            this._authService.logout();
                                        } else {
                                            this.message = {
                                                text: 'Something was wrong. Try later',
                                                type: 'danger'
                                            };
                                        }
                                    }));
                    }));
    }

    ngOnDestroy() {
        if (this._subscriptions.length) {
            for (const sub of this._subscriptions) {
                sub.unsubscribe();
            }
        }
    }
}
