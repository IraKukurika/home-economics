import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/internal/operators';
import {BaseApi} from '../core/base-api';
import {AuthService} from './auth.service';
import {User} from '../interfaces/user.interface';

@Injectable()
export class UsersService extends BaseApi {
    constructor(public http: HttpClient, private authService: AuthService) {
        super(http);
    }

    emailCheck(email: string): Observable<object> {
        return this.post('user/email-check', {'email': email});
    }

    login(data: {email: string, password: string}) {
        return this.post('user/login', data)
            .pipe(map((response: Response) => {
                const token = response['token'];
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace('-', '+').replace('_', '/');
                return {
                    token: token,
                    decoded: JSON.parse(atob(base64)),
                    user: response['user']
                };
            }))
            .pipe(tap(
                resData => {
                   this.authService.login(resData);
                }
            ));
    }

    createNewUser(user: User): Observable<object> {
        return this.post('user/register', user);
    }

    getUser(): User {
        if (JSON.parse(localStorage.getItem('user'))) {
            return JSON.parse(localStorage.getItem('user'));
        }
    }
}
