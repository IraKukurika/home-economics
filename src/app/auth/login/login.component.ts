import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';

import {UsersService} from '../../shared/services/users.service';
import {AuthService} from '../../shared/services/auth.service';
import {Subscription} from 'rxjs';
import {Message} from '../../shared/interfaces/message.interface';
import {MessageModel} from '../../shared/models/message.model';
import {Meta, Title} from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy {

    form: FormGroup;
    private _emailPattern = '[a-zA-Z_]+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}';
    message: Message;
    private _subscriptions: Subscription[] = [];

    constructor(private _fb: FormBuilder,
                private _usersService: UsersService,
                private _authService: AuthService,
                private _router: Router,
                private _route: ActivatedRoute,
                private _title: Title,
                private _meta: Meta) {
        _title.setTitle('Sign in');
        _meta.addTags([
            {name: 'keywords', content: 'login,sign in,system'}
        ]);
    }

    ngOnInit() {
        this.message = new MessageModel('danger', '');

        this._buildForm();

        this._subscriptions.push(this._route.queryParams
            .subscribe(
                (params: Params) => {
                    if (params['nowCanLogin']) {
                        this.message = {
                            text: 'Now you can login.',
                            type: 'success'
                        };
                    } else if (params['accessDenied']) {
                        this.message = {
                            text: 'To work with the system you need to login',
                            type: 'warning'
                        };
                    }
                }));
    }

    private _buildForm(): void {
        this.form = this._fb.group({
            'email': [null, [
                Validators.required,
                Validators.pattern(this._emailPattern)
            ]],
            'password': [null, [
                Validators.required,
                Validators.minLength(6)
            ]],
        });
    }

    isControlInvalid(controlName: string): boolean {
        const control = this.form.controls[controlName];
        return control.invalid && control.touched;
    }

    onSubmit() {
        const formData = this.form.value;

        this._subscriptions.push(this._usersService.login(formData)
            .subscribe(
                () => {
                    this._router.navigate(['/system']);
                },
                error => {
                    if (error.error['error-email-not-exist']) {
                        this.message = {
                            text: 'Email does not exist',
                            type: 'danger'
                        };
                    } else {
                        this.message = {
                            text: 'Wrong data',
                            type: 'danger'
                        };
                    }
                }
        ));
    }

    ngOnDestroy() {
        if (this._subscriptions.length) {
            for (const sub of this._subscriptions) {
                sub.unsubscribe();
            }
        }
    }
}
