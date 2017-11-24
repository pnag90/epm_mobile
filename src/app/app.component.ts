import { Component } from '@angular/core';
import { Config, Platform } from 'ionic-angular';

import { BrowserTab } from '@ionic-native/browser-tab';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TranslateService } from '@ngx-translate/core';
import { AuthProvider } from '../providers/auth-provider';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage: any = null;

    constructor(public platform: Platform,
        public statusBar: StatusBar,
        public splashScreen: SplashScreen,
        public translate: TranslateService,
        public authProvider: AuthProvider,
        public config: Config) {

        this.initTranslate();
        this.initializeApp();
        this.checkAuth();
    }

    ionViewDidLoad() {
        this.platform.ready().then(() => {
            //if (this.platform.is('cordova')) {
                this.initPlugins();
            //}
        });
    }

    initPlugins() {
        //this.statusBar.styleDefault();
        this.statusBar.styleLightContent();
        this.statusBar.backgroundColorByHexString('#194378');
        this.splashScreen.hide();
    }

    initializeApp() {
        this.watchForNetworkChanges();
    }

    initTranslate() {
        // Set the default language for translation strings, and the current language.
        this.translate.setDefaultLang('pt');

        if (this.translate.getBrowserLang() !== undefined) {
            this.translate.use(this.translate.getBrowserLang());
        } else {
            this.translate.use('pt'); // Set your language here
        }

        this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
            this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
        });
    }

    checkAuth(): void {
        this.authProvider.hasPreviousAuthorization().then((isAuthenticated) => {
            if (!isAuthenticated) {
                this.rootPage = 'LoginPage';
            } else {
                this.rootPage = 'HomePage';
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