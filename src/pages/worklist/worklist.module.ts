import { PipesModule } from '../../pipes/pipes.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WorklistPage } from './worklist';

@NgModule({
    declarations: [WorklistPage],
    imports: [IonicPageModule.forChild(WorklistPage), TranslateModule, PipesModule],
    exports: [WorklistPage]
})
export class WorklistPageModule { }