import { Injectable } from '@angular/core';
import { Storage  } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { User, ChatUser } from './epm-types';
import { AuthProvider } from './auth-provider';
import { UtilsProvider } from './utils-provider';
import { ConfProvider } from './conf-provider';
import { UserProvider } from './user-provider';
import { PATH } from './constants';
import 'rxjs/add/operator/map';
import * as io from 'socket.io-client';

@Injectable()
export class SocketProvider {
    private socket: any; 
    private namespace: string = '/entities';

    /* events */
    public EVENT_MESSAGE :string             = 'epm:chat:message';
    public EVENT_MESSAGE_SENT :string        = 'epm:chat:message:sent';
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

    constructor(private storage: Storage, 
                public confProvider: ConfProvider, 
                public auth: AuthProvider,
                public userProvider: UserProvider,
                public utilsProvider: UtilsProvider) {
                    
        this.initSocket();      
    }

    private initSocket() : void {
        this.socket = io.connect(PATH.SOCKET + this.namespace, {'transports': ['websocket', 'polling', 'flashsocket']});

        this.socket.on("connect", () => {
            console.log("socket-connect");
            /* check user is already logged in */
            if(this.auth.isLogged()){
                this.session = this.auth.getUser();
                if(!this.socketAuthenticated() && this.session) {
                    this.sendAuthSocket(this.session);
                }
            }
        });

        this.socket.on("reconnecting", (msg) => { console.log('on reconnecting'); });
        this.socket.on("reconnect_error", (msg) => { console.log('on reconnect_error'); });
        this.socket.on("reconnect_failed", (msg) => { console.log('on reconnect_failed'); });
        this.socket.on('disconnect', (e) => { console.log('user disconnected',e); });

        this.socket.on('epm:chat:authenticated', (ioSession) => {
            if (ioSession && ioSession.user && ioSession.user.userId){
                this.socket._epmData = ioSession.user;
                console.log('You have been authenticated', ioSession.user.userFullname);
                this.initializeChat(ioSession);
            }
        });

        this.socket.on('epm:chat:presence', (dta) => {
            if (dta && dta.user && this.chatUsersArray){
                console.log('Someone of my entity is authenticated', dta.user.userFullname);
                let found = false;
                for (var i = 0; i < this.chatUsersArray.length; i++) {
                    if (this.chatUsersArray[i].userId == dta.user.userId) {
                        this.chatUsersArray[i].state = dta.state || 'offline';
                        found = true;
                        break;
                    }
                }
                if(found){
                    this.refreshUsers();
                }
            }
        });

    }

    private socketAuthenticated():boolean{
        if ( this.socket._epmData !== undefined && this.socket._epmData !== null ){
            return this.socket._epmData.userId !== undefined && this.socket._epmData.userId !== null;
        }
        return false;
    }

    private sendAuthSocket(epmSession: any): void {
        epmSession._mobile=true;
        this.socket.emit('authenticate', epmSession);
    }

    private initializeChat(ioSession?:any) : void{

        // messages
        this.socket.on(this.EVENT_MESSAGE_SENT, (dta) => { this.newChatMessage(dta,true); });
        this.socket.on(this.EVENT_MESSAGE + ':' + this.session.userId, (dta) => { this.newChatMessage(dta,false); });

        if(ioSession){ 
            this.getChatUsers(ioSession.online);
        }
        
        this.storage.get('epmChatMessages').then((val) => {
            if(val !== undefined && val !== null){
                this.chatMessagesData = val || {};
                this.chatMessages.next(this.chatMessagesData); 
                this.updateAlerts();
            }
        });

        this.notificationsActive = true;
        if(this.session && this.session.options){
            // TODO
            this.notificationsActive = true;
        }
    }

    public disconnect(){
        if(this.socket) {
            //this.socket.removeListener(this.EVENT_MESSAGE + ':' + this.session.userId);
            this.socket.emit('logout');
        }
        this.userProvider.setUser(null);
    }


    /* CHAT - USERS */

    public getUsers(): Observable<any> {
        return this.chatUsers.asObservable();
    }
    private refreshUsers():void{
        var len:number = this.chatUsersArray.length || 0;
        this.chatUsers.next(this.chatUsersArray);    
    }

    private getChatUsers(onlineUsers: Array<number>) {
        return this.storage.get('epmChatUsers').then((val) => {
            if(val !== undefined && val !== null && val.length !== 0){
                this.chatUsersArray = this.getChatUsersStatus(onlineUsers,val);
                this.refreshUsers();
            }else{
                this.confProvider.get('/mobile/user/get').then(res => {
                    console.log(res);
                    this.chatUsersArray = this.getChatUsersStatus(onlineUsers, res || []);
                    this.refreshUsers(); 
                }, err => {
                    console.error(err);
                    this.chatUsers.error(err);
                });
            }
        });
    }

    private getChatUsersStatus(onlineUsers: Array<number>, users: Array<ChatUser>) : Array<ChatUser> {
        let usersArr : Array<ChatUser> = [];
        let defaultDate = (new Date(86400000)).getTime();
        let _getPhoto = this.userProvider.getPhoto;
        let _inArray = this.utilsProvider.isInArray;

        for (var i=0; i < users.length; i++) {
            usersArr.push({
                userId: users[i].userId,
                userName: users[i].userName,
                profName: users[i].profName || null,
                profNum: users[i].profNum || null,
                userBirth: users[i].userBirth || null,
                email: users[i].email || null,
                photo: _getPhoto(users[i].photo),
                state: _inArray(onlineUsers,users[i].userId) ? 'online' : 'offline',
                lastActivity: users[i].lastActivity || defaultDate,
                alerts: users[i].alerts || 0,
                canReceiveCall: users[i].canReceiveCall || null,
            });
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
        //this.storage.set('epmChatMessages',this.chatMessagesData);
        this.refreshAlerts(userId, new Date(), 0);
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

    private notify(user:any, unread: number):void{
        if( this.notificationsActive==true ){
            let title = unread > 1 ? 'Nova mensagem' : unread + ' novas mensagens';
            let m = 'Recebeu uma nova mensagem';
            if(user && user.profName!=null && user.profName!=''){
                m += ' de ' + user.profName + '.';
            }
            else if(user && user.userFullname!=null && user.userFullname!=''){
                m += ' de ' + user.userFullname + '.';
            }else{
                m += '.';
            }
            this.utilsProvider.showNotification(title,m);
        }
    }

    public getAlerts(): Observable<any> {
        return this.chatAlerts.asObservable();
    }

    private newChatMessage(data:any,isMine:boolean){
        if (data && data.sender && data.messages) {
            let senderId  = data.sender.userId + '';
            let senderName  = data.sender.userFullName + '';
            let receiptId = data.receipt + '';

            let userIdx = isMine ? receiptId : senderId;
            console.log('epmChatService: new message',data, isMine);

            // user messages
            if(this.chatMessagesData[userIdx]==undefined || this.chatMessagesData[userIdx]==null){
                this.chatMessagesData[userIdx] = [];
            }

            // check last message time and user
            if (this.chatMessagesData[userIdx].length > 0) {

                var lastIndex       = this.chatMessagesData[userIdx].length - 1;
                var lastTimeStamp   = this.chatMessagesData[userIdx][lastIndex].timestamp;
                var lastUser        = this.chatMessagesData[userIdx][lastIndex].sender.userId;

                if ( this.utilsProvider.isSameTime(lastTimeStamp,data.timestamp) && lastUser == senderId){
                    this.chatMessagesData[userIdx][lastIndex].timestamp = data.timestamp;
                    this.chatMessagesData[userIdx][lastIndex].messages  = this.chatMessagesData[userIdx][lastIndex].messages.concat(data.messages);
                    this.chatMessagesData[userIdx][lastIndex].readed = isMine;
                }else{
                    data.readed = isMine;
                    this.chatMessagesData[userIdx].push(data);
                }

            }else{
                data.readed = isMine;
                this.chatMessagesData[userIdx].push(data);
            }

            if(!isMine){
                this.refreshActivity(userIdx,data.timestamp);
            }else{
                this.refreshAlerts(userIdx,data.timestamp,-1);
            }

            //this.storage.set('epmChatMessages',this.chatMessagesData);
            this.chatMessages.next(this.chatMessagesData);
        }
    }

    private refreshActivity(uId,timestamp) {
        let unread = 0;
        for(let i=0; i<this.chatMessagesData[uId].length; i++){
            if(this.chatMessagesData[uId][i].readed==false){ unread++; }
        }
        this.refreshAlerts(uId,timestamp,unread);
    }

    private refreshAlerts(uId,timestamp,unread) {
        let totalAlerts = 0;
        for (var i=0; i<this.chatUsersArray.length; i++){
            if(this.chatUsersArray[i].userId == uId){
                if(unread >= 0){
                    this.chatUsersArray[i].alerts = unread;
                    if(unread > 0){
                        this.notify(this.chatUsersArray[i],unread);
                    }
                }
                if(unread!==0){
                    this.chatUsersArray[i].lastActivity = (new Date(timestamp)).getTime();
                }
                //break;
            }
            totalAlerts += (this.chatUsersArray[i].alerts || 0);
        }
        this.chatAlerts.next(totalAlerts);
        //localStorageService.set('epmChat',chat);
    }

    public sendMessage(to:any, message:string):void{
        this.socket.emit(this.EVENT_MESSAGE, {to: to, message: message});
    }

}