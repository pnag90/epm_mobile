import { SafePipe } from './safe.pipe';
import { MomentPipe } from './moment.pipe';
import { NgModule } from '@angular/core';

@NgModule({
    declarations: [MomentPipe, SafePipe],
    imports: [],
    exports: [MomentPipe, SafePipe]
})
export class PipesModule { }