import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Tabs } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth-provider';
import { SocketProvider } from '../../providers/socket-provider';
import { Subscription } from 'rxjs/Subscription';
import { UtilsProvider } from '../../providers/utils-provider';
import { UserProvider } from '../../providers/user-provider';

@IonicPage()
@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    
    @ViewChild('mainTabs') tabs: Tabs;
    private chatPage: any = 'ChatPage';
    private profilePage: any = 'ProfilePage';
    private worklistPage: any = 'WorklistPage';
    private optionsPage: any = 'OptionsPage';

    private subscription: Subscription;

    private chatAlerts: string;
    private worklistEpisodes: string;

    constructor(public nav: NavController, 
                public auth: AuthProvider, 
                public socket: SocketProvider,
                public utils: UtilsProvider,
                public user: UserProvider) {
        
    }

    ionViewDidLoad() {
        if(this.auth.isLogged()){
            //this.socket.initialize();
            this.loadAlerts();
            //this.utils.showNotification('OLA','Teste');
        }
        this.worklistEpisodes = null;
    }

    private loadAlerts() {
        this.subscription = this.socket.getAlerts().subscribe(alerts => {
            let alertCount: number = alerts ||  0;
            if(alertCount > 0){
                this.chatAlerts = alertCount + "";
            }else{
                this.chatAlerts = null;
            }
        });
    }

    public logout() {
        this.auth.logout().then(res => {
            this.socket.disconnect();
            this.user.setUser(null);
            this.nav.setRoot('LoginPage');
        }, err => {
            
        });
    }

    ionViewWillUnload () {
        // unsubscribe to ensure no memory leaks
        this.subscription.unsubscribe();
    }

}
