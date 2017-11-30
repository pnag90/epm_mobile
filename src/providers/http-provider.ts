import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Storage } from '@ionic/storage';
import { PATH } from './constants';

@Injectable()
export class HttpProvider {

    private requestHeader: Headers;
    private sessionAlias;

    constructor(public http: Http, private storage: Storage) {
        this.requestHeader = new Headers();
        this.requestHeader.append('Accept', 'application/json');
        this.requestHeader.append('Content-Type', 'application/json');
    }

    auth(url: string) {
        return new Promise((resolve, reject) => {
            this.http.get(PATH.REST + url, { headers: this.requestHeader, withCredentials: true })
                .map(this.extractData)
                .subscribe(res => {
                    resolve(res);
                }, (err) => {
                    console.error(PATH.REST + url, err);
                    reject({ err: err });
                });
        });

    }

    logout() {
        return new Promise((resolve, reject) => {
            this.http.get(PATH.REST + '/logout').subscribe(res => {
                    resolve(res);
                }, (err) => {
                    console.error(PATH.REST + '/logout', err);
                    reject({ err: err });
                });
        });

    }

    get(url: string) {
        let http_ = this.http;
        let header_ = this.requestHeader;
        return new Promise((resolve, reject) => {
            http_.get(PATH.REST + url, { headers: header_, withCredentials: true }).map(this.extractData).subscribe(
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
            http_.post(PATH.REST + url, data, { headers: header_, withCredentials: true }).map(this.extractData).subscribe(
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

}
