import { ConfProvider } from '../../providers/conf-provider';
import { Component, OnInit } from '@angular/core';
import { AuthProvider } from '../../providers/auth-provider';
import { User } from '../../providers/epm-types';
import { IonicPage } from 'ionic-angular';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { ProfileEditPage } from './form/profile-edit';

@IonicPage()
@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html'
})
export class ProfilePage{
    private user: User = null;
    private defaultPic: string;
    private isBoss: boolean = false;

    constructor(public auth: AuthProvider, public conf:ConfProvider, private navCtrl:NavController) {
        this.defaultPic = this.conf.defaultUserPhoto();
    }

    ionViewDidLoad() {
        if(this.auth.isLogged()){
            this.user   = this.auth.getUser();
            this.isBoss = this.auth.isBoss();
        }
    }


    profileForm(): void{
        if(this.user != null){
            this.navCtrl.push(ProfileEditPage, { user: this.user });
        }
    }
        
}