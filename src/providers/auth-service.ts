import { ConfService } from './conf-service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Md5 } from 'ts-md5/dist/md5';
import { User } from '../models/epm-types';
import 'rxjs/add/operator/map';


@Injectable()
export class AuthService {
    private currentUser: User;
    private requestUrl: string;

    constructor(private http: Http, private storage: Storage, private conf:ConfService) {
        this.requestUrl = conf.mvc();
    }

    public getUser() : User {
        return this.currentUser;
    }

    private setUser(authenticationInfo : any) : void {
        let epmSession = authenticationInfo.appCustomInfo.session;
        let authUser = authenticationInfo.authenticatedUser;
        let user = <User>({
            userId: epmSession.userId,
            coworkerId: epmSession.coworkerId,
            username: authUser.username,
            userFullName: authUser.fullName,
            email: authUser.email,
            entityId: epmSession.entityId,
            entityCode: authenticationInfo.institutionCode,
            languageCode: epmSession.languageCode,
            photo: authUser.photo || null
        });
        this.currentUser = user;
    }

    private setCredentials(credentials:any):void{
        this.storage.set('epmUserCredentials', credentials);
    }

    public hasPreviousAuthorization() {
        return new Promise(resolve => {
            this.storage.get('epmUserCredentials').then((val) => {
                //console.log("epmUserCredentials",val);
                if(val !== undefined && val !== null){
                    this.login(val).then((data) => {
                        if (data.isError) {
                            console.error(data.error);
                            resolve(false);
                        } else {
                            resolve(this.isLogged());
                        }
                    });
                }
                else{
                   resolve(false);
                }
            });
        });
    }

    public isLogged() : boolean {
        return this.currentUser!==null;
    }

    public login(credentials): any {
        console.log("login",credentials);
        if (credentials.username === null || credentials.password === null || credentials.institution === null) {
            return {isError: true, error: "Credênciais inválidas"};
        } else {
            return this.authenticate(credentials.username,credentials.password,credentials.institution).then(
                (data) => {
                    console.log("authenticate",data);
                    let error = "Acesso negado. Verifique os seus dados de acesso.";
                    if (data) {
                        let info = data["authenticationInfo"];
                        if ( info && (info.appCustomInfo) && (info.appCustomInfo.session) ) {
                            this.setUser(info);
                            this.setCredentials(credentials);
                            return {isError: false, error: null};
                        } else {
                            return {isError: true, error: error};
                        }
                    } else {
                        return {isError: true, error: error};
                    }
                },
                (err) => {
                    return {isError: true, error: err};
                }
            );
        }
    }

    private authenticate(username,password,institution) {

        let authUrl     = this.requestUrl + "/security/fdfAuthenticate";
        let authBody    = `?username=${username}&password=${Md5.hashStr(password)}&appId=181&institutionCode=${institution}`;
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        let accountPath = this.requestUrl + "/fdf/security/account";

        return new Promise((resolve, reject) => {
            this.http.post(authUrl + authBody, null, { withCredentials: true }).subscribe(
                success => {
                    this.http.get(accountPath, { withCredentials: true }).map(res => res.json()).subscribe(
                        data => {
                            //console.log(accountPath,data);
                            resolve(data);
                        },
                        err => {
                            if (err.status === 401) {
                                console.error('Invalid user credentials');
                                reject('Credênciais inválidas.');
                            } else if (err.status !== 200) {
                                console.error('HTTP Error');
                                reject('Falha no pedido.');
                            }
                        }
                    ); 
                },
                error => {
                    if (error.status === 401) {
                        console.error('Invalid user credentials');
                        reject('Credênciais inválidas.');
                    } else if (error.status !== 200) {
                        console.error('HTTP Error');
                        reject('Falha no pedido.');
                    }
                }

            );
        });

    }

    public logout() {
        return Observable.create(observer => {
            this.currentUser = null;
            this.storage.remove('epmUser');
            this.storage.remove('epmUserCredentials'); 
            this.storage.remove('epmChatUsers'); 
            this.storage.remove('epmChatMessages'); 
            window.localStorage.clear();      
            observer.next(true);
            observer.complete();
        });
    }
}