import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';
import {Injectable} from '@angular/core';

@Injectable()
export class AuthGuardService implements CanActivate, CanActivateChild {
    constructor(private _authService: AuthService, private _router: Router) {}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (this._authService.isAuth()) {
            return true;
        } else {
            this._router.navigate(['/login'], {
                queryParams: {
                    accessDenied: true
                }
            });
            return false;
        }
    }
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this.canActivate(childRoute, state);
    }
}
