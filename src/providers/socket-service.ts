import { ConfService } from './conf-service';
import { Injectable } from '@angular/core';
import { Storage  } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { User, ChatUser } from '../providers/epm-types';
import { AuthService } from '../providers/auth-service';
import { UtilService } from '../providers/utils-service';
import 'rxjs/add/operator/map';
import * as io from "socket.io-client";

@Injectable()
export class SocketService {
    private socket: any; 

    /* events */
    public EVENT_MESSAGE_SEND :string        = 'epm:chat:message';
    public EVENT_MESSAGE_SENT :string        = 'epm:chat:message:sent';
    public EVENT_MESSAGE_RECEIVED :string    = 'epm:chat:message';
    public EVENT_MESSAGE_NEW :string         = 'epm:chat:message:new';
    public EVENT_USER_STATUS_CHANGED :string = 'epm:chat:users:update';
    public EVENT_TYPING :string              = 'epm:chat:typing';

    /* chat vars */
    private session: User;
    private chatMessages = new BehaviorSubject({});
    private chatMessagesData = {};
    private chatUsersArray = [];
    private chatUsers = new BehaviorSubject([]); 
    private chatAlerts = new BehaviorSubject({}); 
    private notificationsActive:boolean = false;
    private reconnectsMax:number = 0;

    constructor(private storage: Storage, 
                private localNotifications: LocalNotifications,
                public conf: ConfService, 
                public auth: AuthService,
                public util: UtilService) {}

    public initialize() : void{
        this.socket = io.connect(this.conf.socket(), {'transports': ['websocket', 'polling', 'flashsocket']});
        this.reconnectsMax = 30;

        this.storage.get('epmChatMessages').then((val) => {
            if(val !== undefined && val !== null){
                this.chatMessagesData = val || {};
                this.chatMessages.next(this.chatMessagesData); 
                this.updateAlerts();
            }
        });

        this.socket.on("connect", (msg) => {
            console.log('on connect');
            //this.socketObserver.next({ category: 'connect', message: 'user connected'});
            this.setAuthentication();
        });

        this.socket.on("reconnecting", (msg) => {
            console.log('on reconnecting');
        });

        this.socket.on("reconnect_error", (msg) => {
            this.reconnectsMax--;
            console.log('on reconnect_error');
        });

        this.socket.on("reconnect_failed", (msg) => {
            this.reconnectsMax--;
            console.log('on reconnect_failed');
        });

        /*this.socket.on('authenticated', function(sender, data) {
            if(data) {
               //console.log("on authenticated",data);
            }
        });*/

        this.socket.on('disconnect', function (e) {
            console.log('user disconnected',e);
        });

        this.socket.on("epm:chat:presence", (data) => {
            this.getChatUsers(data.users);
        });

    }

    public setAuthentication(){
        if(this.auth.isLogged()) {
            this.session = this.auth.getUser();
            //console.log("setAuthentication", this.session);
            this.socket.emit('authenticate', this.session);

            if(this.session && this.session.options){
                for(let i=0; i<this.session.options.length; i++){
                    if(this.session.options[i].code=='OPT_NOTIF_MSG'){
                        this.notificationsActive=this.session.options[i].value>0; 
                        break;
                    }
                }
            }

            this.socket.on(this.EVENT_MESSAGE_RECEIVED + ':' + this.session.userId, (newMsg) => {
                console.log('epmChatService: new message',newMsg);
                this.newChatMessage(newMsg,false);
            });

            this.socket.on(this.EVENT_MESSAGE_SENT, (newMsg) => {
                console.log('epmChatService: message sent',newMsg);
                this.newChatMessage(newMsg,true);
            });

        }
    }
    public disconnect(){
        if(this.socket) {
            this.socket.emit('logout');
        }
    }


    /* CHAT - USERS */
    public getUsers(): Observable<any> {
        return this.chatUsers.asObservable();
    }
    private refreshUsers():void{
        var len:number = this.chatUsersArray.length || 0;
        console.log("emitUsersUpdate",len);
        this.chatUsers.next(this.chatUsersArray);    
    }

    private getChatUsers(onlineUsers: Array<number>) {
        return this.storage.get('epmChatUsers').then((val) => {
            if(val !== undefined && val !== null && val.length !== 0){
                this.chatUsersArray = this.getChatUsersStatus(onlineUsers,val);
                this.refreshUsers(); //resolve(true);
            }else{
                this.conf.get('/hiscore/utils/users').then(res => {
                    console.log(res);
                    let result = res.result || [];
                    this.chatUsersArray = this.getChatUsersStatus(onlineUsers,result);
                    this.refreshUsers(); 
                }, err => {
                    console.error(err);
                    this.chatUsers.error(err);
                });
    /*          this.http.get(this.conf.rest() + '/hiscore/utils/users', { withCredentials: true }).map(res => res.json()).subscribe(
                    res => {
                        let result = res.result || [];
                        this.chatUsersArray = this.getChatUsersStatus(onlineUsers,result);
                        this.refreshUsers(); 
                    },
                    err => {
                        console.error(err);
                        this.chatUsers.error(err);
                    }
                ); */
            }
        });
    }

    private getChatUsersStatus(onlineUsers: Array<number>, users: Array<ChatUser>) : Array<ChatUser> {
        let usersArr : Array<ChatUser> = [];

        for (var i=0; i < users.length; i++) {
            if (users[i].userId != this.session.userId) {
                usersArr.push({
                    userId: users[i].userId,
                    userName: users[i].userName,
                    state: this.util.isInArray(onlineUsers,users[i].userId) ? 'online' : 'offline',
                    photo: users[i].photo,
                    canReceiveCall: users[i].canReceiveCall,
                    shortDescription: users[i].shortDescription
                });
            }
        }
        this.storage.set('epmChatUsers',usersArr);
        return usersArr;
    }

    /** CHAT - MESSAGES */
    public messages(): Observable<any> {
        return this.chatMessages.asObservable();
    }

    public readMessages(userId:string){
        if(!userId || !this.chatMessagesData){
            return true;
        }
        if(this.chatMessagesData[userId]==undefined || this.chatMessagesData[userId]==null){
            this.chatMessagesData[userId] = [];
        }else{
            for(var i=0; i<this.chatMessagesData[userId].length; i++){
                this.chatMessagesData[userId][i].readed=true;
            }
        }
        this.storage.set('epmChatMessages',this.chatMessagesData);
        this.updateAlerts();
    }

    private updateAlerts():void{
        if(this.chatMessagesData){
            let unread = {}, j, u;
            for (u in this.chatMessagesData) {
                unread[u] = 0;
                for(j=this.chatMessagesData[u].length-1; j>=0; j--){
                    if(!this.chatMessagesData[u][j].readed){
                        unread[u]++;
                    }
                    else{
                        break;
                    }
                }
            }
            this.chatAlerts.next(unread);
        }
    }

    private notify():void{
        if( this.notificationsActive==true ){
            this.localNotifications.schedule({
                text: 'Recebeu uma nova mensagem',
                at: new Date(new Date().getTime() + 500)
            });
        }
    }

    public getAlerts(): Observable<any> {
        return this.chatAlerts.asObservable();
    }

    private newChatMessage(newMsg:any,isMine:boolean){
        if (newMsg && newMsg.sender && newMsg.messages) {
            
            var senderId  = newMsg.sender.userId + '';
            var receiptId = newMsg.receipt + '';

            var userIdx = isMine ? receiptId : senderId;

            // user messages
            if(this.chatMessagesData[userIdx]==undefined || this.chatMessagesData[userIdx]==null){
                this.chatMessagesData[userIdx] = [];
            }

            // check last message time and user
            if (this.chatMessagesData[userIdx].length > 0) {

                var lastIndex       = this.chatMessagesData[userIdx].length - 1;
                var lastTimeStamp   = this.chatMessagesData[userIdx][lastIndex].timestamp;
                var lastUser        = this.chatMessagesData[userIdx][lastIndex].sender.userId;

                if ( this.util.isSameTime(lastTimeStamp,newMsg.timestamp) && lastUser == senderId){
                    this.chatMessagesData[userIdx][lastIndex].timestamp = newMsg.timestamp;
                    this.chatMessagesData[userIdx][lastIndex].messages  = this.chatMessagesData[userIdx][lastIndex].messages.concat(newMsg.messages);
                    this.chatMessagesData[userIdx][lastIndex].readed = isMine;
                }else{
                    newMsg.readed = isMine;
                    this.chatMessagesData[userIdx].push(newMsg);
                }

            }else{
                newMsg.readed = isMine;
                this.chatMessagesData[userIdx].push(newMsg);
            }

            this.storage.set('epmChatMessages',this.chatMessagesData);
            this.chatMessages.next(this.chatMessagesData);
            if(!isMine){
                this.notify();
            }
            this.updateAlerts();
        }
    }

    public sendMessage(to:any, message:string):void{
        this.socket.emit(this.EVENT_MESSAGE_SEND, {to: to, message: message});
    }

}