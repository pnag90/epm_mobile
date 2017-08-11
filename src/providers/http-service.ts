import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Storage } from '@ionic/storage';
import { ConfService } from './conf-service';


@Injectable()
export class HttpService {

    private requestHeader: Headers;
    private sessionAlias;
    private EPM_URL: string;
    private EPM_SOCKET_URL: string;
     /*
        D:  http://192.168.19.112:8080/EPMJ2EE      http://192.168.20.71:3001
        P:  https://epm.first-global.com            https://epm.first-global.com:8886
    */

    constructor(public http: Http, private storage: Storage) {
        this.EPM_URL = "https://epm.first-global.com:8543/epm/";
        this.EPM_SOCKET_URL = "https://epm.first-global.com:8886";
        this.requestHeader = new Headers();
        this.requestHeader.append('Content-Type', 'application/json');
    }

    buildUrl(url: string) {
        return new Promise(resolve => {
            let url_ = url;
            if (url_.substring(0, this.EPM_URL.length) === this.EPM_URL) {
                this.getSessionAlias().then(alias => {
                    if (url_.indexOf('?') > 0) {
                        url_ += '&_s=' + alias;
                    } else {
                        url_ += '?_s=' + alias;
                    }
                    resolve(url_);
                });
            } else {
                resolve(url_);
            }
        });
    }

    getSessionAlias() {
        return new Promise(resolve => {
            if (this.sessionAlias === undefined || this.sessionAlias == null) {
                this.storage.get('sessionAlias').then((val) => {
                    if (val === undefined || val == null) {
                        this.sessionAlias = this.generateUuid();
                        this.storage.set('sessionAlias', this.sessionAlias);
                    } else {
                        this.sessionAlias = val;
                    }
                    resolve(this.sessionAlias);
                });
            } else {
                resolve(this.sessionAlias);
            }
        });

    }

    get(url: string) {
        let http_ = this.http;
        let header_ = this.requestHeader;
        return new Promise((resolve, reject) => {
            this.buildUrl(url).then((requestUrl: string) => {
                http_.get(requestUrl, { headers: header_, withCredentials: true }).map(this.extractData).subscribe(
                    res => {
                        resolve(res);
                    }, (err) => {
                        console.error(url, err);
                        reject({ err: err });
                    });
            });
        });

    }

    post(url: string, data) {
        let http_ = this.http;
        //let auth_ = url.indexOf('security/fdfAuthenticate') > 0;
        let header_ = this.requestHeader;
        return new Promise((resolve, reject) => {
            this.buildUrl(url).then((requestUrl: string) => {
                http_.post(requestUrl, data, { headers: header_, withCredentials: true }).map(this.extractData).subscribe(
                    res => {
                        resolve(res);
                    }, (err) => {
                        console.error(url, err);
                        reject({ err: err });
                    });
            });
        });
    }

    private extractData(res: Response) {     
        if (res===undefined || res===null){
            return res;
        }
        return res.text() ? res.json() : {}; ;
    }

    epmUrl(): string{
        return this.EPM_URL;
    }

    socketUrl(): string{
        return this.EPM_SOCKET_URL;
    }

    // session utils
    _p8(s?: boolean) {
        let p = (Math.random().toString(16) + '000000000').substr(2, 8);
        return s ? '-' + p.substr(0, 4) + '-' + p.substr(4, 4) : p;
    }
    public generateUuid() {
        return (this._p8() + this._p8(true) + this._p8(true) + this._p8() + '-m').toLowerCase();
    }
}
