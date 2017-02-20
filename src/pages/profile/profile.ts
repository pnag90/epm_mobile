import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../providers/auth-service';
import { User } from '../../models/epm-types';

@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html'
})
export class ProfilePage implements OnInit{
    public user : User;

    constructor(private auth: AuthService) {}

    ngOnInit():void {
        this.user = this.auth.getUser();
    }

        
}
