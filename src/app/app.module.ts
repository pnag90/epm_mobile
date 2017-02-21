import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule, Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate';

import { ConfService } from '../providers/conf-service';
import { AuthService } from '../providers/auth-service';
import { SocketService } from '../providers/socket-service';
import { MomentPipe } from '../pipes/moment.pipe';
import { SafePipe } from '../pipes/safe.pipe';
import { MessageComponent } from '../pages/chat/messages/message-component';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { EpisodePage } from '../pages/worklist/episode/episode';
import { WorklistPage } from '../pages/worklist/worklist';
import { OptionsPage } from '../pages/options/options';
import { ChatPage } from '../pages/chat/chat';
import { MessagesPage } from '../pages/chat/messages/messages';

export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, './assets/i18n', '.json');
}

@NgModule({
    declarations: [
        MomentPipe,
        SafePipe,
        MyApp,
        HomePage,
        LoginPage,
        ProfilePage,
        WorklistPage,
        EpisodePage,
        OptionsPage,
        ChatPage,
        MessagesPage,
        MessageComponent
    ],
    imports: [
        HttpModule,
        TranslateModule.forRoot({
            provide: TranslateLoader,
            useFactory: (createTranslateLoader),
            deps: [Http]
        }),
        IonicModule.forRoot(MyApp)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        LoginPage,
        ProfilePage,
        WorklistPage,
        EpisodePage,
        OptionsPage,
        ChatPage,
        MessagesPage
    ],
    providers: [
        Storage,
        ConfService,
        AuthService,
        SocketService,
        {provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
