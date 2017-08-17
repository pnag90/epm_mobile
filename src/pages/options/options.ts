import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { BackgroundMode } from '@ionic-native/background-mode';
import { AuthService } from '../../providers/auth-service';
import { User } from '../../providers/epm-types';

@IonicPage()
@Component({
    selector: 'page-options',
    templateUrl: 'options.html'
})
export class OptionsPage {
 public user: User;
 private developer: boolean = false;

 private opt_notifMessages: boolean;
 private opt_notifAppointments: boolean;
 private opt_runBackground : boolean;
 private DEFAULT_NOTIF_APPOINTMENTS = false;
 private DEFAULT_NOTIF_MESSAGES = true;

    constructor(public auth: AuthService, private nav: NavController, private backgroundMode: BackgroundMode) {
        this.user = this.auth.getUser();
        this.developer = this.auth.isFIRST();

        this.opt_notifMessages = this.DEFAULT_NOTIF_MESSAGES;
        this.opt_notifAppointments = this.DEFAULT_NOTIF_APPOINTMENTS;
        this.opt_runBackground = this.backgroundMode.isEnabled();

        if(this.user && this.user.options){
            for(let i=0; i<this.user.options.length; i++){
                if(this.user.options[i].code=='OPT_NOTIF_APP'){
                    this.opt_notifAppointments = this.user.options[i].value>0;
                }
                if(this.user.options[i].code=='OPT_NOTIF_MSG'){
                    this.opt_notifMessages = this.user.options[i].value>0;
                }
            }
        }
    }

    updateOption(code:string, value:boolean): void{
        if(code && this.user){
            //save option this.user.userId;
            if(code==='R'){
                if(this.opt_runBackground){
                    this.backgroundMode.enable();
                }else{
                    this.backgroundMode.disable();
                }
            }
        }
    }


}
