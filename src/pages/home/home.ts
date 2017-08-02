import { OptionsPage } from '../options/options';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { SocketService } from '../../providers/socket-service';
import { LoginPage } from '../login/login';
import { ChatPage } from '../chat/chat';
import { WorklistPage } from '../worklist/worklist';
import { ProfilePage } from '../profile/profile';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    private subscription: Subscription;
    private chatPage: any;
    private profilePage: any;
    private worklistPage: any;
    private optionsPage: any;

    private chatAlerts: string;
    private worklistEpisodes: string;

    private developer: boolean;

    constructor(private nav: NavController, public auth: AuthService, public socket: SocketService) {
        this.chatPage = ChatPage;
        this.profilePage = ProfilePage;
        this.worklistPage = WorklistPage;
        this.optionsPage = OptionsPage;
        this.developer = false;

        if(this.auth.isLogged()){
            this.socket.initialize();

            this.developer = this.auth.isFIRST();
            this.loadAlerts();  
        }
        this.worklistEpisodes = null;
    }

    private loadAlerts() {
        this.subscription = this.socket.getAlerts().subscribe(alerts => {
            let alertCount: number = 0;
            if(alerts){
                for (let a in alerts) {
                    console.log(a);
                    alertCount +=  alerts[a] || 0;   
                }
            }
            if(alertCount>0){
                this.chatAlerts = alertCount + "";
            }else{
                this.chatAlerts = null;
            }
        });
    }

    public logout() {
        this.auth.logout().subscribe(res => {
            this.socket.disconnect();
            this.nav.setRoot(LoginPage)
        });
    }

    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.subscription.unsubscribe();
    }

}
