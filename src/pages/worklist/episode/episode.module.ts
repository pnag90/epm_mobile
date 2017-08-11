import { PipesModule } from '../../../pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EpisodePage } from './episode';

@NgModule({
    declarations: [EpisodePage],
    imports: [IonicPageModule.forChild(EpisodePage), TranslateModule, PipesModule],
    exports: [EpisodePage]
})
export class EpisodePageModule { }