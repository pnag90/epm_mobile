import { Pipe } from '@angular/core';
import * as moment from 'moment';
import 'moment/locale/pt';

// under systemjs, moment is actually exported as the default export, so we account for that
//-const momentConstructor: (value?: any) => moment.Moment = (<any>moment).default || moment;

@Pipe({
    name: 'moment'
})
export class MomentPipe {

    transform(value, args) {
        args = args || '';
        return args === 'ago' ? moment(value).fromNow() : moment(value).format(args);
      }

    /*transform(value: Date | moment.Moment, args?: any): any {
        let formats: any = null;
        let referenceTime: any = null;

        if (typeof args === 'object' && !moment.isMoment(args)) {
            formats = args;
         } else {
            referenceTime = momentConstructor(args);
        }

        return momentConstructor(value).calendar(referenceTime, formats);
    }*/
}