import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { SocketService } from '../../providers/socket-service';
import { Subscription } from 'rxjs/Subscription';

@IonicPage()
@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    private subscription: Subscription;
    private chatPage: any = 'ChatPage';
    private profilePage: any = 'ProfilePage';
    private worklistPage: any = 'WorklistPage';
    private optionsPage: any = 'OptionsPage';

    private chatAlerts: string;
    private worklistEpisodes: string;

    private developer: boolean = false;

    constructor(private nav: NavController, public auth: AuthService, public socket: SocketService) {
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
            this.nav.setRoot('LoginPage');
        });
    }

    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.subscription.unsubscribe();
    }

}
