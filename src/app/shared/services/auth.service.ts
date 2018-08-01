import {Router} from '@angular/router';
import {Injectable} from '@angular/core';

@Injectable()
export class AuthService {

    constructor(private _router: Router) {}

    login(data: any) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
            'name': data.user.name,
            'id': data.user.id
        }));
    }

    logout() {
        localStorage.clear();
        this._router.navigate(['/login']);
    }

    isAuth(): boolean {
        return !!localStorage.getItem('token');
    }
}
