import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileEditPage } from './profile-edit';
import { PipesModule } from '../../../pipes/pipes.module';
import { ImageCropperModule } from 'ng2-img-cropper';
@NgModule({
    declarations: [ProfileEditPage],
    imports: [IonicPageModule.forChild(ProfileEditPage), TranslateModule, PipesModule, ImageCropperModule],
    exports: [ProfileEditPage]
})
export class ProfilePageModule { }