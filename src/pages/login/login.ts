import { Component, ViewChild } from '@angular/core';
import { BrowserTab } from '@ionic-native/browser-tab';
import { IonicPage, Content, NavController, AlertController, LoadingController, Loading } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth-provider';

@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {
    @ViewChild(Content) content: Content;
    loading: Loading;
    credentials = { username: '', password: '', institution: '' };

    constructor(private nav: NavController,
        private auth: AuthProvider,
        private alertCtrl: AlertController,
        private loadingCtrl: LoadingController,
        private browserTab: BrowserTab) { }


    ionViewDidLoad() {
        if(this.auth.isLogged()){
           this.nav.setRoot('HomePage');
        }
    }

    login() {
        this.showLoading();
        this.auth.login(this.credentials).then((data) => {
            //console.log("on login",data);
            if (data.isError) {
                this.showError(data.error);
            } else {
                setTimeout(() => {
                    this.loading.dismiss();
                    this.nav.setRoot('HomePage');
                });
            }
        });
    }

    showLoading() {
        this.loading = this.loadingCtrl.create({
            content: 'Aguarde...'
        });
        this.loading.present();
    }

    showError(text) {
        setTimeout(() => {
            this.loading.dismiss();
        });

        let alert = this.alertCtrl.create({
            title: 'Erro',
            subTitle: text,
            buttons: ['OK']
        });
        alert.present();
    }

    onFocus() {
        this.scrollToForm();
    }

    scrollToForm() {
        setTimeout(() => {
            if (this.content.scrollTo) { 
                this.content.scrollTo(0, 86, 600)
            }
        }, 100);
    }

    poweredBy() {
        let url = 'http://www.first-global.com/pt-pt/Solucoes/epm';
        this.browserTab.isAvailable()
            .then((isAvailable: boolean) => {
                if (isAvailable) {
                    this.browserTab.openUrl(url);
                }
            })
            .catch(err => console.error(err));
    }

}
