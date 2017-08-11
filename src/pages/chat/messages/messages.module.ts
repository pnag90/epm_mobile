import { PipesModule } from '../../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { MessagesPage } from './messages';

@NgModule({
    declarations: [MessagesPage],
    imports: [IonicPageModule.forChild(MessagesPage), TranslateModule, PipesModule],
    exports: [MessagesPage]
})
export class MessagesPageModule { }