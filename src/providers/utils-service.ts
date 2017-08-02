import { EventEmitter, Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
import * as _ from 'lodash';
import moment from 'moment';
import 'moment-timezone';
import 'moment/locale/pt-br';

@Injectable()
export class UtilService {
    tabChangeEvent;

    constructor(public toastCtrl: ToastController) {
        this.tabChangeEvent = new EventEmitter<string>();
    }

    dateToStringDate(date?: string): string {
        if(!date){ return null; }
        return moment(date).format("DD-MM-YYYY");
    }

    dateToStringHour(date?: string): string {
        if(!date){ return null; }
        return moment(date).format("HH:mm");
    }

    dateToString(date: string, format: string): string {
        return moment(date).format(format);
    }

    currentDate(): string {
        return moment().toISOString();
    }

    isSameTime(date1, date2) : boolean {
        return moment(date1).format('YYYYMMDD_HHmm') === moment(date2).format('YYYYMMDD_HHmm');
    }

    isInArray(arr,id) : boolean{
        if(arr==null || arr.length==0){
            return true;
        }
        var str_ = id + '';
        var num_ = parseInt(id);
        return arr.includes(str_) || arr.includes(num_);
    }

    uppercase(text: string): string {
        return _.upperCase(text);
    }

    startCase(text: string): string {
        return _.startCase(text);
    }

    getTabChangeEvent() {
        return this.tabChangeEvent;
    }

    showToast(message, duration?) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: duration || 3000
        });
        toast.present();
    }

}