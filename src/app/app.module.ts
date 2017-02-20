import { NgModule, ErrorHandler } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { AuthService } from '../providers/auth-service';
import { SocketService } from '../providers/socket-service';
import { MomentPipe } from '../pipes/moment.pipe';
import { SafePipe } from '../pipes/safe.pipe';
import { MessageComponent } from '../pages/chat/messages/message-component';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { WorklistPage } from '../pages/worklist/worklist';
import { ChatPage } from '../pages/chat/chat';
import { MessagesPage } from '../pages/chat/messages/messages';


@NgModule({
    declarations: [
        MomentPipe,
        SafePipe,
        MyApp,
        HomePage,
        LoginPage,
        ProfilePage,
        WorklistPage,
        ChatPage,
        MessagesPage,
        MessageComponent
    ],
    imports: [
        IonicModule.forRoot(MyApp)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        LoginPage,
        ProfilePage,
        WorklistPage,
        ChatPage,
        MessagesPage
    ],
    providers: [
        Storage,
        AuthService,
        SocketService,
        {provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
