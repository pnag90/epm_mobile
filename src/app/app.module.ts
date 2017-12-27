import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule, Http } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserTab } from '@ionic-native/browser-tab';
import { Camera } from '@ionic-native/camera';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { TranslateLoader, TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { IonicStorageModule } from '@ionic/storage';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { HttpProvider } from '../providers/http-provider';
import { UtilsProvider } from '../providers/utils-provider';
import { UserProvider } from '../providers/user-provider';
import { ConfProvider } from '../providers/conf-provider';
import { AuthProvider } from '../providers/auth-provider';
import { SocketProvider } from '../providers/socket-provider';

import { MyApp } from './app.component';


export function createTranslateLoader(http: Http) {
    return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
    declarations: [
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
        IonicModule.forRoot(MyApp, {
            preloadModules: true
        }),
        IonicStorageModule.forRoot()
    ],
    exports: [
        MyApp
    ],
    entryComponents: [
        MyApp
    ],
    providers: [
        //BackgroundMode,
        BrowserTab,
        Camera,
        StatusBar,
        SplashScreen,
        LocalNotifications,
        UtilsProvider,
        HttpProvider,
        ConfProvider,
        UserProvider,
        AuthProvider,
        SocketProvider,
        {provide: ErrorHandler, useClass: IonicErrorHandler}
    ],
    bootstrap: [IonicApp],
    
   /* providers: [
        //BackgroundMode,
        BrowserTab,
        StatusBar,
        SplashScreen,
        LocalNotifications,
        UtilsProvider,
        HttpProvider,
        ConfProvider,
        UserProvider,
        AuthProvider,
        SocketProvider,
        {provide: ErrorHandler, useClass: IonicErrorHandler}]*/
})
export class AppModule {}
