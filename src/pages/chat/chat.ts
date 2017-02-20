import { Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { SocketService } from '../../providers/socket-service';
import { ChatUser, ChatMessage } from '../../models/epm-types';
import { MessagesPage } from './messages/messages';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';

@Component({
    selector: 'page-chat',
    templateUrl: 'chat.html'
})
export class ChatPage implements OnDestroy {
    subscription: Subscription;
    alerts: Subscription;
    
    private users: Array<ChatUser>;
    private defaultPic:string = '../../assets/img/avatar.png';
    
    private currentUser: ChatUser;

    onlineUsers: Array<ChatUser>  = [];
    offlineUsers: Array<ChatUser> = [];

    searchTerm: string = '';
    searching: any = false;
    searchControl: FormControl;
    chatAlerts = {};

    constructor(public navCtrl: NavController, private auth: AuthService, private chatService: SocketService) {
        this.searchControl = new FormControl();
        
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
