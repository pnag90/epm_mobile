import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileEditPage } from './profile-edit';

@NgModule({
    declarations: [ProfileEditPage],
    imports: [IonicPageModule.forChild(ProfileEditPage), TranslateModule],
    exports: [ProfileEditPage]
})
export class ProfilePageModule { }