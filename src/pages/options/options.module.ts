import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OptionsPage } from './options';

@NgModule({
    declarations: [OptionsPage],
    imports: [IonicPageModule.forChild(OptionsPage), TranslateModule],
    exports: [OptionsPage]
})
export class OptionsPageModule { }