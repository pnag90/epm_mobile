import { Storage } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import moment from 'moment';
import 'moment-timezone';
import 'moment/locale/pt-br';

@Injectable()
export class UtilsProvider {

    constructor(private storage: Storage, private localNotifications: LocalNotifications) {
        this.localNotifications.on('click', (notification, state) => {
            let json = JSON.parse(notification.data);
            console.log(notification.title, json);
        });
    }

    // local storage
    getData(key:string) {
        return this.storage.get(key);
    }
    setData(key:string, data) {
        let newData = JSON.stringify(data);
        return this.storage.set(key, newData);
    }
    clearData():void{
        this.storage.clear();
        window.localStorage.clear();
    }

    // dates
    dateToStringDate(date?: string): string {
        return this.dateToString(date,"DD-MM-YYYY");
    }

    dateToStringHour(date?: string): string {
        return this.dateToString(date,"HH:mm");
    }

    dateToString(date: string, format: string): string {
        if (!date) { return ''; }
        return moment(date).format(format);
    }

    currentDate(): string {
        return moment().toISOString();
    }

    isSameTime(date1, date2): boolean {
        return moment(date1).format('YYYYMMDD_HHmm') === moment(date2).format('YYYYMMDD_HHmm');
    }

    getAge(date): object{
        var age = {value: null, unitLocale: ''};
        if(date){
            var years = moment().diff(date, 'years');
            if ( years >= 1 ){
                age.value = years;
                age.unitLocale = years===1 ? 'AGE_YEAR' : 'AGE_YEARS';
            }else {
                age.value = moment().diff(date, 'years');
                age.unitLocale = age.value===1 ? 'AGE_MONTH' : 'AGE_MONTHS';
            }
        }
        return age;
    }



    // AUX

    isInArray(arr, id): boolean {
        if (arr == null || arr.length == 0) {
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
        return null; //this.tabChangeEvent;
    }

    public showToast(message, duration?) {
        /*let toast = this.toastCtrl.create({
            message: message,
            duration: duration || 3000
        });
        toast.present();*/
    }

    public showNotification(title: string, message: string) {
        /*let notification = {
            id: day.dayCode,
            title: title,
            text: message,
            at: firstNotificationTime,
            every: 'week'
        };

        this.notifications.push(notification);*/
        console.log('localNotifications.schedule:' + new Date(new Date().getTime() + 800), title, message);
        let notification = {
            id: 999,
            title: title,
            text: message,
            at: new Date(new Date().getTime() + 500),
            data: {}
        };
        this.localNotifications.schedule([notification]);
    }

    public cancelNotifications() {
        this.localNotifications.cancelAll();
    }

}