import { Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IonicPage, NavController } from 'ionic-angular';
import { ConfProvider } from '../../providers/conf-provider';
import { AuthProvider } from '../../providers/auth-provider';
import { SocketProvider } from '../../providers/socket-provider';
import { ChatUser } from '../../providers/epm-types';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';

@IonicPage()
@Component({
    selector: 'page-chat',
    templateUrl: 'chat.html'
})
export class ChatPage {

    private messagesPage: any = 'MessagesPage';

    private subscription: Subscription;
    private alerts: Subscription;
    
    private users: Array<ChatUser>;
    private defaultPic:string;
    private currentUser: ChatUser;

    chatUsers: Array<ChatUser>  = [];

    searchTerm: string = '';
    searching: any = false;
    searchControl: FormControl;
    chatAlerts = {};

    constructor(public navCtrl: NavController, private auth: AuthProvider, 
    private chatService: SocketProvider, private conf: ConfProvider) {
        
        this.searchControl = new FormControl();
        this.defaultPic = this.conf.defaultUserPhoto();  
    }

    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        if(this.subscription){
            this.subscription.unsubscribe();
        }
        if(this.alerts){
            this.alerts.unsubscribe();
        }
    }

    ionViewDidLoad() {
        this.subscription = this.chatService.getUsers().subscribe(data => { 
            this.users = data; 
            this.filterUsers();
        });

        this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
            this.searching = false;
            this.filterUsers();
        }); 
    }

    onSearchInput(){
        this.searching = true;
    }

    private filterUsers() {
        if(this.users===undefined || this.users===null){
            this.chatUsers = [];
        }        
        let array = this.users.filter((u:ChatUser) => {
            return /*u.state==state &&*/ (this.searchTerm.length<3 || u.userName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1);
        });   
        

        if(!array || array === undefined || array.length === 0) {
            this.chatUsers = [];
        }else{
            array.sort((a: any, b: any) => {
                if (a.lastActivity < b.lastActivity) {
                    return 1;
                } else if (a.lastActivity > b.lastActivity) {
                    return -1;
                } else if (a.state == b.state) {
                    return 0;
                } else if (a.state == 'online') {
                    return -1;
                } else {
                    return 1;
                }
            });
            this.chatUsers = array;
        }
    }

    openUser(user:ChatUser){
        if(user){
            if(this.currentUser==null || user.userId!==this.currentUser.userId) {
                this.currentUser = user;
            }
            // open chat window
            this.navCtrl.push(this.messagesPage, { chatUser: this.currentUser });
        }
    }

}
