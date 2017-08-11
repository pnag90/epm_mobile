import { PipesModule } from '../../pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginPage } from './login';

@NgModule({
    declarations: [LoginPage],
    imports: [IonicPageModule.forChild(LoginPage), TranslateModule, PipesModule],
    exports: [LoginPage]
})
export class LoginPageModule { }