import { ConfService } from '../../providers/conf-service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../providers/auth-service';
import { User } from '../../providers/epm-types';
import { IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html'
})
export class ProfilePage implements OnInit{
    public user: User;
    private defaultPic: string;

    constructor(public auth: AuthService, public conf:ConfService) {
        this.defaultPic = this.conf.defaultUserPhoto();
    }

    ngOnInit():void {
        this.user = this.auth.getUser();
    }
        
}