import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {NgForm} from '@angular/forms';

import {CategoryService} from '../../shared/services/category.service';
import {Subscription} from 'rxjs';
import {Category} from '../../shared/interfaces/category.interface';
import {Message} from '../../../shared/interfaces/message.interface';
import {MessageModel} from '../../../shared/models/message.model';
import {CategoryModel} from '../../shared/models/category.model';
import {AuthService} from '../../../shared/services/auth.service';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html'
})
export class EditCategoryComponent implements OnInit, OnDestroy {
    currentCategoryId = 1;
    currentCategory: Category;

    message: Message;
    private _sub: Subscription;

    @Input() categories: Category[] = [];
    @Output() onCategoryEdit = new EventEmitter<Category>();

    constructor(private _categoryService: CategoryService, private _authService: AuthService) {
    }

    ngOnInit() {
        this.onCategoryChange();

        this.message = new MessageModel('success', '');
    }

    onCategoryChange() {
        this.currentCategory = this.categories
            .find((c) => c.id === +this.currentCategoryId);
    }

    onSubmit(form: NgForm) {
        let {name, capacity} = form.value;
        if (capacity < 0) {
            capacity *= -1;
        }

        const category: Category = new CategoryModel(name, capacity, +this.currentCategoryId);

        this._sub = this._categoryService.updateCategory(category)
            .subscribe(
                res => {
                    if (res['category']) {
                        this.onCategoryEdit.emit(res['category']);
                        this.message = {
                            text: 'Category was successfully edited.',
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
