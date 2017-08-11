import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatPage } from './chat';

@NgModule({
    declarations: [ChatPage],
    imports: [IonicPageModule.forChild(ChatPage), TranslateModule, PipesModule],
    exports: [ChatPage]
})
export class ChatPageModule { }