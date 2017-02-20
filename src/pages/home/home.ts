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
    subscription: Subscription;
    chatPage : any;
    profilePage : any;
    worklistPage : any;

    private chatAlerts: string;
    private worklistEpisodes: string;

    constructor(private nav: NavController, private auth: AuthService, private socket: SocketService) {
        this.chatPage = ChatPage;
        this.profilePage = ProfilePage;
        this.worklistPage = WorklistPage;

        if(this.auth.isLogged()){
            this.socket.initialize();

            this.loadAlerts();
        }
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
