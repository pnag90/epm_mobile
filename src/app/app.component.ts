import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { AuthService } from '../providers/auth-service';


@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage = null;

    constructor(platform: Platform, private auth: AuthService) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();
            Splashscreen.hide();

            // new
            //this.platform = platform;
            this.initializeApp();
            this.checkPreviousAuthorization();
        });
    }

    initializeApp() {
        /*this.platform.ready().then(() => {
            console.log('Platform ready');
        });*/
    }

    checkPreviousAuthorization(): void {
        this.auth.hasPreviousAuthorization().then((isAuthenticated) => {
            if(!isAuthenticated) {
                this.rootPage = LoginPage;
            } else {
                this.rootPage = HomePage;
            }
        })
    }
}
