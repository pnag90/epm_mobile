import { PipesModule } from '../../pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePage } from './profile';

@NgModule({
    declarations: [ProfilePage],
    imports: [IonicPageModule.forChild(ProfilePage), TranslateModule, PipesModule],
    exports: [ProfilePage]
})
export class ProfilePageModule { }