import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

import {CategoryService} from '../../shared/services/category.service';
import {Subscription} from 'rxjs';
import {Category} from '../../shared/interfaces/category.interface';
import {Message} from '../../../shared/interfaces/message.interface';
import {MessageModel} from '../../../shared/models/message.model';
import {AuthService} from '../../../shared/services/auth.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html'
})
export class AddCategoryComponent implements OnInit, OnDestroy {

    form: FormGroup;
    private _sub: Subscription;
    message: Message;

    @Output() onCategoryAdd = new EventEmitter<Category>();

    constructor(
        private _fb: FormBuilder,
        private _authService: AuthService,
        private _categoryService: CategoryService
    ) {}

    ngOnInit() {
        this.message = new MessageModel('danger', '');

        this._buildForm();
    }

    private _buildForm(): void {
        this.form = this._fb.group({
            'name': ['', [
                Validators.required
            ]],
            'capacity': [null, [
                Validators.required,
                Validators.min(1)
            ]],
        });
    }

    isControlInvalid(controlName: string): boolean {
        const control = this.form.controls[controlName];
        return control.invalid && control.touched;
    }

    onSubmit() {
        this._sub = this._categoryService.addCategory(this.form.value)
            .subscribe(
                (res) => {
                    if (res['category']) {
                        this.form.reset();
                        this.onCategoryAdd.emit(res['category']);

                        this.message = {
                            text: 'Category was successfully created',
                            type: 'success'
                        };
                    }
                },
                error => {
                    if (error.error['error'] === 'Token Expired') {
                        this._authService.logout();
                    } else {
                        this.message = {
                            text: 'Something was wrong. Try later',
                            type: 'danger'
                        };
                    }
                });
    }

    ngOnDestroy() {
        if (this._sub) {
            this._sub.unsubscribe();
        }
    }
}
