import { Component, ViewChild, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormControl, FormBuilder } from '@angular/forms';
import { IonicPage, Content, LoadingController, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../../providers/auth-service';
import { SocketService } from '../../../providers/socket-service';
import { User, ChatUser, ChatMessage } from '../../../providers/epm-types';
import { Subscription } from 'rxjs/Subscription';

@IonicPage()
@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html'
})
export class MessagesPage implements OnDestroy {
  subscription: Subscription;
  @ViewChild(Content) content: Content;
  @Output() chatNotification = new EventEmitter();

  private user: User;
  private userPic: string = 'assets/img/avatar.png';

  private loading = true;
  public messageForm: any;

  private chatMessages: any = {};
  private userMessages: Array<ChatMessage> = [];
  
  private chatBox: string;
  private chatUser: ChatUser = null;

  constructor(public navCtrl: NavController, public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController, public params: NavParams,
    public messageService: SocketService, private auth: AuthService) {

    this.user = this.auth.getUser();
    this.chatUser = this.params.get('chatUser');
    this.loading = true;
    this.messageForm = formBuilder.group({
      message: new FormControl('')
    });
    this.chatBox = "";
    this.loadMessages();
  }

  loadMessages() {
    this.subscription = this.messageService.messages().subscribe(data => {
      this.chatMessages = data;
      this.loadUserMessages();
    });
  }

  loadUserMessages() {
    if(this.chatMessages && this.chatUser!=null){
      console.log("loadUserMessages : chatMessages", this.chatUser, this.chatMessages);
      // user messages
      let user_:string = this.chatUser.userId + "";
      if(this.chatMessages[user_]==undefined || this.chatMessages[user_]==null){
          this.chatMessages[user_] = [];
      }
      // user photo
      if(!this.chatUser.photo){

      }
      this.userMessages = this.chatMessages[user_];
      this.messageService.readMessages(user_);
    }else{
      this.userMessages = [];
    }
    setTimeout(() => {
      console.log("userMessages",this.userMessages);
      this.loading = false;

      setTimeout(() => {
        this.content.scrollToBottom();
      }, 0);
    }, 500);
  }

  send(message) {
    if (message && message != "" && this.chatUser!=null) {
      this.messageService.sendMessage(this.chatUser.userId, message);
      //this.scrollToBottom();
    }
    this.chatBox = "";
  }

  scrollToBottom() {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 100);
  }


  ngOnInit() {
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
  

  viewProfile(profile) {
    console.log('oi');
  }

  goBack() {
    this.navCtrl.pop();
  } 
}