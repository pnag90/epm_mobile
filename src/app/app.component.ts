import { Component } from '@angular/core';
import { Config, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { TranslateService } from 'ng2-translate/ng2-translate';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { AuthService } from '../providers/auth-service';


@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage = null;

    constructor(platform: Platform, private translate: TranslateService, private auth: AuthService, private config: Config) {
        this.translate.setDefaultLang('pt');
        this.translate.use('pt');

        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();
            Splashscreen.hide();

            this.translate.get('BACK').subscribe((res: string) => {
                // Let android keep using only arrow
                console.log(res);
                this.config.set('ios', 'backButtonText', res);
                // To cange label for all platforms: this.config.set('backButtonText', res);
            });

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
