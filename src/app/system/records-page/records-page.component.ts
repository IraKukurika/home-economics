import { Component, OnInit } from '@angular/core';
import {CategoryService} from '../shared/services/category.service';
import {Category} from '../shared/interfaces/category.interface';

@Component({
  selector: 'app-records-page',
  templateUrl: './records-page.component.html'
})
export class RecordsPageComponent implements OnInit {
    categories: Category[] = [];
    isLoaded = false;

    constructor(private _categoryService: CategoryService) {}

    ngOnInit() {
        this._categoryService.getCategories()
            .subscribe((res: {categories: Category[]}) => {
                this.categories = res['categories'];
                this.isLoaded = true;
            });
    }

    addNewCategory(category: Category) {
        this.categories.push(category);
    }

    editCategory(category: Category) {
        const idx = this.categories
            .findIndex((c) => c.id === category.id);

        this.categories[idx] = category;
    }
}
