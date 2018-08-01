import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Message} from '../../interfaces/message.interface';
import {fadeStateTrigger} from '../../animations/fade.animation';

@Component({
    selector: 'app-message',
    templateUrl: './message.component.html',
    animations: [fadeStateTrigger]
})
export class MessageComponent implements OnInit {

    @Input() showMessage: Message;
    @Output() changeMessage = new EventEmitter<string>();

    ngOnInit() {
      setTimeout(() => {
        this.changeMessage.emit('');
      }, 5000);
    }
}
