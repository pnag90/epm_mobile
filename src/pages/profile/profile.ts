import { ConfProvider } from '../../providers/conf-provider';
import { Component, OnInit } from '@angular/core';
import { AuthProvider } from '../../providers/auth-provider';
import { User } from '../../providers/epm-types';
import { IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html'
})
export class ProfilePage{
    private user: User;
    private defaultPic: string;
    private isBoss: boolean=false;

    constructor(public auth: AuthProvider, public conf:ConfProvider) {
        this.defaultPic = this.conf.defaultUserPhoto();
    }

    ionViewDidLoad() {
        if(this.auth.isLogged()){
            this.user   = this.auth.getUser();
            this.isBoss = this.auth.isBoss();
        }
    }
        
}