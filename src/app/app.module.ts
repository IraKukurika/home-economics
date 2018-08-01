import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import {AuthModule} from './auth/auth.module';
import {AppRoutingModule} from './app-routing.module';
import {UsersService} from './shared/services/users.service';
import {AuthService} from './shared/services/auth.service';
import {AuthGuardService} from './shared/services/auth-guard.service';
import {NotFoundComponent} from './shared/components/not-found/not-found.component';

@NgModule({
    declarations: [
        AppComponent,
        NotFoundComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AuthModule,
        AppRoutingModule,
        BrowserAnimationsModule
    ],
    providers: [UsersService, AuthService, AuthGuardService],
    bootstrap: [AppComponent]
})
export class AppModule { }
