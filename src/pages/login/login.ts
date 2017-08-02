import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { HomePage } from '../home/home';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {

    loading: Loading;
    credentials = {username: '', password: '', institution: ''};

    constructor(private nav: NavController, 
                public auth: AuthService, 
                private alertCtrl: AlertController, 
                private loadingCtrl: LoadingController) {}

    public login() {
        this.showLoading();
        this.auth.login(this.credentials).then((data) => {
            if (data.isError) {
                this.showError(data.error);
            } else {
                setTimeout(() => {
                    this.loading.dismiss();
                    this.nav.setRoot(HomePage)
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
        alert.present(prompt);
    }

}
