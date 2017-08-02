import { Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavController } from 'ionic-angular';
import { ConfService } from '../../providers/conf-service';
import { AuthService } from '../../providers/auth-service';
import { SocketService } from '../../providers/socket-service';
import { ChatUser } from '../../providers/epm-types';
import { MessagesPage } from './messages/messages';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';

@Component({
    selector: 'page-chat',
    templateUrl: 'chat.html'
})
export class ChatPage implements OnDestroy {
    private subscription: Subscription;
    private alerts: Subscription;
    
    private users: Array<ChatUser>;
    private defaultPic:string;
    private currentUser: ChatUser;

    onlineUsers: Array<ChatUser>  = [];
    offlineUsers: Array<ChatUser> = [];

    searchTerm: string = '';
    searching: any = false;
    searchControl: FormControl;
    chatAlerts = {};

    constructor(public navCtrl: NavController, private auth: AuthService, 
    private chatService: SocketService, private conf: ConfService) {
        this.searchControl = new FormControl();

        this.defaultPic = this.conf.defaultUserPhoto();
        
        this.subscription = this.chatService.getUsers().subscribe(data => { 
            this.users = data; 
            this.setFilteredUsers();
        });
        this.alerts = this.chatService.getAlerts().subscribe(alerts => {
            this.chatAlerts = alerts;
        });
    }

    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.subscription.unsubscribe();
        this.alerts.unsubscribe();
    }

    ionViewDidLoad() {
        this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
            this.searching = false;
            this.setFilteredUsers();
        }); 
    }

    onSearchInput(){
        this.searching = true;
    }

    setFilteredUsers() {
        this.onlineUsers  = this.filterUsers('online');
        this.offlineUsers = this.filterUsers('offline');
    }

    filterUsers(state:string) {
        if(this.users===undefined || this.users===null){
            return [];
        }        
        return this.users.filter((u:ChatUser) => {
            return u.state==state && (this.searchTerm.length<3 || u.userName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1);
        });   
    }

    openUser(user:ChatUser){
        if(user){
            if(this.currentUser==null || user.userId!==this.currentUser.userId) {
                this.currentUser = user;
            }
            // open chat window
            this.navCtrl.push(MessagesPage, {chatUser:this.currentUser});
        }
    }

}
