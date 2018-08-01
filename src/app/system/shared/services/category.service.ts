import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {BaseApi} from '../../../shared/core/base-api';
import {Observable} from 'rxjs';
import {Category} from '../interfaces/category.interface';

@Injectable()
export class CategoryService extends BaseApi {
    private _token = this.getToken();

    constructor(public http: HttpClient) {
        super(http);
    }

    addCategory(category: Category): Observable<any> {
        return this.post(`post-category?token=${this._token}`, category);
    }

    getCategories(): Observable<object> {
       return this.get(`get-categories`);
    }

    getCategoryById(id: number): Observable<object> {
        return this.get(`get-category/${id}`);
    }

    updateCategory(category: Category) {
        return this.put(`update-category/${category.id}`, category);
    }
}
