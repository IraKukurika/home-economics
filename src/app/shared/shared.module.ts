import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {LoaderComponent} from './components/loader/loader.component';
import {MessageComponent} from './components/message/message.component';
import { GithubLinkComponent } from './components/github-link/github-link.component';

@NgModule({
    imports: [ReactiveFormsModule, FormsModule, NgxChartsModule],
    exports: [
        ReactiveFormsModule,
        FormsModule,
        NgxChartsModule,
        LoaderComponent,
        MessageComponent,
        GithubLinkComponent
    ],
    declarations: [LoaderComponent, MessageComponent, GithubLinkComponent]
})
export class SharedModule {}
