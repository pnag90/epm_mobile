import { UserProvider } from '../../providers/user-provider';
import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
//import { BackgroundMode } from '@ionic-native/background-mode';
import { AuthProvider } from '../../providers/auth-provider';
import { ConfProvider } from '../../providers/conf-provider';
import { User, UserOption } from '../../providers/epm-types';

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
    private opt_runBackground: boolean;
    private DEFAULT_NOTIF_APPOINTMENTS = false;
    private DEFAULT_NOTIF_MESSAGES = true;

    constructor(public auth: AuthProvider, private nav: NavController, private conf: ConfProvider, private userProvider:UserProvider /*, private backgroundMode: BackgroundMode*/) {
        this.user = this.auth.getUser();
        this.developer = this.auth.isBoss();

        this.opt_notifMessages = this.DEFAULT_NOTIF_MESSAGES;
        this.opt_notifAppointments = this.DEFAULT_NOTIF_APPOINTMENTS;
        //this.opt_runBackground = this.backgroundMode.isEnabled();
    }

    ionViewDidLoad() {
        if (this.user && this.user.options) {
            for (let i = 0; i < this.user.options.length; i++) {
                if (this.user.options[i].code == 'OPT_NOTIF_APP') {
                    this.opt_notifAppointments = this.user.options[i].value == "Y";
                }
                if (this.user.options[i].code == 'OPT_NOTIF_MSG') {
                    this.opt_notifMessages = this.user.options[i].value == "Y";
                }
            }
        }
    }


    updateOption(code: string, value: boolean): void {
        let x=false;
        if (code && this.user) {
            //save option this.user.userId;
            if (code === 'R') {
                if (this.opt_runBackground) {
                    //this.backgroundMode.enable();
                } else {
                    //this.backgroundMode.disable();
                }
            }
            if(x){
                this.conf.request('/mobile/user/options/set/'+code+'?value='+value)
                    .then(res=> {
                        console.log('option saved',res);
                        if(res && res.result){
                            this.userProvider.setOption(res.result);
                        }
                    }, (err) => {
                        console.error('option not saved',err);
                    })
            }
        }
    }


}
