import { Component, Input } from '@angular/core';

@Component({
    selector: 'message-component',
    templateUrl: 'message-component.html'
})

export class MessageComponent {
    @Input('msgSide') side;
    @Input('message') message;

    placeholder = 'assets/img/avatar.png';
    //side: string = '';

    constructor() {}

    ngAfterViewInit(){
        console.log(this.side); //this.side = this.msgSide || 'left';
        console.log(this.message);
    }
}