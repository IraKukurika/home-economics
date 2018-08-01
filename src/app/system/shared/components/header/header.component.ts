import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../../shared/services/auth.service';
import {User} from '../../../../shared/interfaces/user.interface';
import {UsersService} from '../../../../shared/services/users.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

    date: Date = new Date();
    user: User;

    constructor(private _authService: AuthService,
                private _userService: UsersService) {}

    ngOnInit(): void {
        this.user = this._userService.getUser();
    }

    onLogout() {
      this._authService.logout();
    }
}
