import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Storage } from '@ionic/storage';

@Injectable()
export class HttpProvider {

    private requestHeader: Headers;
    private sessionAlias;
    private EPM_URL: string;
    private EPM_SOCKET_URL: string;
    /*
       D:  http://192.168.19.112:8080/EPMJ2EE      http://192.168.20.71:3001
       P:  https://epm.first-global.com            https://epm.first-global.com:8886

       LOCAL : http://192.168.19.112:8090
       DEV   : http://192.168.20.73:8080/fcmobile       C: http://192.168.20.71:3001

       PROD  : https://epm.first-global.com:8543/fcmobile    C: https://epm.first-global.com:8886
    */

    constructor(public http: Http, private storage: Storage) {
        this.EPM_URL = "http://192.168.19.112:8090"; //"http://192.168.20.73:8080/fcmobile";
        this.EPM_SOCKET_URL = "http://192.168.20.73:3001";
        this.requestHeader = new Headers();
        this.requestHeader.append('Accept', 'application/json');
        this.requestHeader.append('Content-Type', 'application/json');
    }

    auth(url: string) {
        return new Promise((resolve, reject) => {
            this.http.get(this.EPM_URL + url, { headers: this.requestHeader, withCredentials: true })
                .map(this.extractData)
                .subscribe(res => {
                    resolve(res);
                }, (err) => {
                    console.error(this.EPM_URL + url, err);
                    reject({ err: err });
                });
        });

    }

    logout() {
        return new Promise((resolve, reject) => {
            this.http.get(this.EPM_URL + '/logout').subscribe(res => {
                    resolve(res);
                }, (err) => {
                    console.error(this.EPM_URL + '/logout', err);
                    reject({ err: err });
                });
        });

    }

    get(url: string) {
        let http_ = this.http;
        let header_ = this.requestHeader;
        return new Promise((resolve, reject) => {
            http_.get(this.EPM_URL + url, { headers: header_, withCredentials: true }).map(this.extractData).subscribe(
                res => {
                    resolve(res);
                }, (err) => {
                    console.error(url, err);
                    reject({ err: err });
                });
        });

    }

    post(url: string, data) {
        let http_ = this.http;
        let header_ = this.requestHeader;
        return new Promise((resolve, reject) => {
            http_.post(this.EPM_URL + url, data, { headers: header_, withCredentials: true }).map(this.extractData).subscribe(
                res => {
                    resolve(res);
                }, (err) => {
                    console.error(url, err);
                    reject({ err: err });
                });
        });
    }

    private extractData(res: Response) {
        if (res === undefined || res === null) {
            return res;
        }
        return res.text() ? res.json() : {};;
    }

    epmUrl(): string {
        return this.EPM_URL;
    }

    socketUrl(): string {
        return this.EPM_SOCKET_URL;
    }

}
