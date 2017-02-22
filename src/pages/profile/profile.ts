import { ConfService } from '../../providers/conf-service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../providers/auth-service';
import { User } from '../../models/epm-types';

@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html'
})
export class ProfilePage implements OnInit{
    public user: User;
    private defaultPic: string;

    constructor(private auth: AuthService, private conf:ConfService) {
        this.defaultPic = this.conf.defaultUserPhoto();
    }

    ngOnInit():void {
        this.user = this.auth.getUser();
    }

        
}
