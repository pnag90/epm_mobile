import { Pipe } from '@angular/core';
import moment from 'moment';
import 'moment/locale/pt-br';

@Pipe({
    name: 'moment'
})
export class MomentPipe {
    transform(value, args) {
        args = args || '';
        return args == 'ago' ? moment(value).fromNow() : moment(value).format(args);
    }
}