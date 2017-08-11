import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, Http } from '@angular/http';
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { IonicStorageModule } from '@ionic/storage';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { HttpService } from '../providers/http-service';
import { UtilService } from '../providers/utils-service';
import { ConfService } from '../providers/conf-service';
import { AuthService } from '../providers/auth-service';
import { SocketService } from '../providers/socket-service';
import { MomentPipe } from '../pipes/moment.pipe';
import { SafePipe } from '../pipes/safe.pipe';
import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LocalNotifications } from '@ionic-native/local-notifications';

export function createTranslateLoader(http: Http) {
    return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
    declarations: [
        MomentPipe,
        SafePipe,
        MyApp
    ],
    imports: [
        BrowserModule,
        HttpModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [Http]
            }
        }),
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot()
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp
    ],
    providers: [
        StatusBar,
        SplashScreen,
        LocalNotifications,
        UtilService,
        HttpService,
        ConfService,
        AuthService,
        SocketService,
        {provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
