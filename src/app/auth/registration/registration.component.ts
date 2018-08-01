import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

import {AuthService} from '../../shared/services/auth.service';
import {UsersService} from '../../shared/services/users.service';
import {UserModel} from '../shared/models/user.model';
import {User} from '../../shared/interfaces/user.interface';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html'
})
export class RegistrationComponent implements OnInit, OnDestroy {

    form: FormGroup;
    private _emailPattern = '[a-zA-Z_]+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}';
    private _namePattern = '^([a-zA-Z]|\\s)*$';

    private _subscriptions: Subscription[] = [];

    constructor(private _fb: FormBuilder,
                private _usersService: UsersService,
                private _authService: AuthService,
                private _router: Router,
                private _title: Title) {
        _title.setTitle('Sign up');
    }

    ngOnInit() {
        this._buildForm();
    }

    private _buildForm(): void {
        this.form = this._fb.group({
            'email': [null, [
                Validators.required,
                Validators.pattern(this._emailPattern),
            ],
                this.forbiddenEmails.bind(this)
            ],
            'password': [null, [
                Validators.required,
                Validators.minLength(6)
            ]],
            'name': ['', [
                Validators.required,
                Validators.pattern(this._namePattern),
                Validators.minLength(4)
            ]],
            'agree': [false, [
                Validators.requiredTrue
            ]],
        });
    }

    isControlInvalid(controlName: string): boolean {
        const control = this.form.controls[controlName];
        return control.invalid && control.touched;
    }

    onSubmit() {
      const {email, password, name} = this.form.value;
      const newUser: User = new UserModel(email, password, name);

        this._subscriptions.push(this._usersService.createNewUser(newUser)
          .subscribe(() => {
            this._router.navigate(['/login'], {
              queryParams: {
                nowCanLogin: true
              }
            });
          }));
    }

    forbiddenEmails(control: FormControl): Promise<any> {
        return new Promise((resolve) => {
            this._subscriptions.push(this._usersService.emailCheck(control.value)
                .subscribe(
                    response => {
                        if (response['success']) {
                            resolve(null);
                        }
                    },
                    err => {
                        if (err.status === 422) {
                            resolve({forbiddenEmail: true});
                        }
                    }
                ));
        });
    }

    ngOnDestroy() {
        if (this._subscriptions.length) {
            for (const sub of this._subscriptions) {
                sub.unsubscribe();
            }
        }
    }
}
