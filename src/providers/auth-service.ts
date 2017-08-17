import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Storage  } from '@ionic/storage';
import { Md5 } from 'ts-md5/dist/md5';
import { HttpService } from './http-service';
import { ConfService } from './conf-service';
import { UtilService } from './utils-service';
import { User } from './epm-types';
import 'rxjs/add/operator/map';


@Injectable()
export class AuthService {
    private currentUser: User;
    private requestUrl: string;
    private sessionAlias;

    constructor(private http: HttpService, private storage: Storage, private conf:ConfService, private util:UtilService) {
        this.requestUrl = conf.rest();
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
        //sessionStorage.setItem(fSessionService.getSessionAlias() + ':userMenuExtraOptions', JSON.stringify(_userMenuExtraOptions));
        this.storage.set('epmUserCredentials', credentials).then(
            function()  {
                console.log('User credentials stored!')
            },
            function(error){
                console.error('Error storing item', error)
            });
    }

    public hasPreviousAuthorization() {
        return new Promise(resolve => {
            this.storage.get('epmUserCredentials').then((val) => {
                console.log("epmUserCredentials",val);
                if(val !== undefined && val !== null){
                    this.login(val, true).then((data) => {
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

    public login(credentials, cached:boolean=false): any {
        if (credentials.username === null || credentials.password === null || credentials.institution === null) {
            return {isError: true, error: "Credênciais inválidas"};
        } else {
            let cred = JSON.parse(JSON.stringify(credentials))
            if(!cached){
                cred.password = Md5.hashStr(cred.password);
            }
            return this.authenticate(cred.username,cred.password,cred.institution).then(
                (data) => {
                    console.log("authenticate",data);
                    let error = "Acesso negado. Verifique os seus dados de acesso.";
                    if (data) {
                        let info = data["authenticationInfo"];
                        //fSecurityService.setAuthenticated(true);
                        //sessionStorage.setItem('authenticated', 'true');
                        if ( info && (info.appCustomInfo) && (info.appCustomInfo.session) ) {
                            this.setUser(info);
                            this.setCredentials(cred);
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
        let authBody    = `?username=${username}&password=${password}&appId=181&institutionCode=${institution}`;
        let accountPath = this.requestUrl + "/fdf/security/account";

        return new Promise((resolve, reject) => {
            this.http.post(authUrl + authBody, '').then(
                success => {
                    console.log("authOK",authUrl);
                    this.http.get(accountPath).then(
                        data => {
                            console.log(accountPath,data);
                            resolve(data);
                        },
                        err => {
                            if (err.status === 401) {
                                console.error('Invalid user credentials');
                                reject('Credênciais inválidas.');
                            } else if (err.status !== 200) {
                                console.error('HTTP Error',err);
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
                        console.error('HTTP Error',error);
                        reject('Falha no pedido.');
                    }
                }

            );
        });

    }

    public logout() {
        return Observable.create(observer => {
            this.currentUser = null;
            this.storage.clear();
            this.util.cancelNotifications();
            window.localStorage.clear();
            observer.next(true);
            observer.complete();
        });
    }

    public isFIRST():boolean {
        return this.currentUser.entityCode.toLocaleLowerCase() == 'first';
    }

}