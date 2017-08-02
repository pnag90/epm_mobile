import { Component } from '@angular/core';
import { Config, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { AuthService } from '../providers/auth-service';


@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage = null;

    constructor(platform: Platform,
                statusBar: StatusBar, 
                splashScreen: SplashScreen,
                private translate: TranslateService,
                private auth: AuthService,
                private config: Config,) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();

            // this language will be used as a fallback when a translation isn't found in the current language
            translate.setDefaultLang('pt');
            // the lang to use, if the lang isn't available, it will use the current loader to get them
            translate.use('pt');

            translate.get('BACK').subscribe((res: string) => {
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
        this.watchForNetworkChanges();
        /*this.platform.ready().then(() => {
            console.log('Platform ready');
        });*/
    }

    checkPreviousAuthorization(): void {
        this.auth.hasPreviousAuthorization().then((isAuthenticated) => {
            if (!isAuthenticated) {
                this.rootPage = LoginPage;
            } else {
                this.rootPage = HomePage;
            }
        })
    }

    watchForNetworkChanges() {
        // watch network for a disconnect
        document.addEventListener("offline", this.onOffline, false);
        // watch network for a connection
        document.addEventListener("online", this.onOnline, false);
    }

    onOffline() {
         console.log('network was disconnected :-(');
    }

    onOnline() {
        console.log('network connected!');
    }

}