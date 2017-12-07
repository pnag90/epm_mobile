import { SocketProvider } from './socket-provider';
import { UserProvider } from './user-provider';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Md5 } from 'ts-md5/dist/md5';
import { HttpProvider } from './http-provider';
import { UtilsProvider } from './utils-provider';
import { User } from './epm-types';

@Injectable()
export class AuthProvider {

    constructor(private http: HttpProvider,
        private userProvider: UserProvider,
        private utilsProvider: UtilsProvider) {

    }

    public getUser(): User {
        return this.userProvider.getUser();
    }

    private setCredentials(credentials: any): void {
        this.utilsProvider.setData('epmUserCredentials', credentials).then(
            (val) => { console.log('User credentials stored!') },
            (error) => { console.log('Error storing item', error) });
    }

    public login(credentials, cached: boolean = false): any {
        if (credentials.username === null || credentials.password === null || credentials.institution === null) {
            return { isError: true, error: "Credênciais inválidas" };
        } else {
            let cred:any = JSON.parse(JSON.stringify(credentials))
            if (!cached) {
                cred.password = Md5.hashStr(cred.password);
            }
            return this.authenticate(cred.username, cred.password, cred.institution).then(
                (data) => {
                    console.log("authenticate", data);
                    if (data) {
                        this.userProvider.setUser(data);
                        this.setCredentials(cred);
                        return { isError: false, error: null };
                    } else {
                        let error = "Acesso negado. Verifique os seus dados de acesso.";
                        return { isError: true, error: error };
                    }
                },
                (err) => {
                    return { isError: true, error: err };
                }
            );
        }
    }

    private authenticate(username: string, password: string, institution: string) {
        let accountPath = '/security/account?options';
        let authUrl = "/login/auth";
        console.log("auth:", username, password, institution);
        authUrl += '?username=' + username.trim();
        authUrl += '&password=' + password.trim();
        authUrl += '&institutionCode=' + institution.trim();

        return new Promise((resolve, reject) => {
            this.http.auth(authUrl).then(
                success => {
                    this.http.auth(accountPath).then(
                        data => { resolve(data); },
                        err => {
                            if (err.status === 401) {
                                console.error('Invalid user credentials');
                                reject('Credênciais inválidas.');
                            } else if (err.status !== 200) {
                                console.error('HTTP Error', err);
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
                        console.error('HTTP Error', error);
                        reject('Falha no pedido.');
                    }
                }

            );
        });

    }

    public hasPreviousAuthorization() {
        return new Promise(resolve => {
            this.utilsProvider.getData('epmUserCredentials').then((val) => {
                if (val !== undefined && val !== null) {
                    this.login(JSON.parse(val), true).then((data) => {
                        console.log("hasPreviousAuthorization : login", data);
                        if (data.isError) {
                            console.error(data.error);
                            resolve(false);
                        } else {
                            resolve(this.isLogged());
                        }
                    });
                }
                else {
                    resolve(false);
                }
            });
        });
    }

    public isLogged(): boolean {
        let u = this.userProvider.getUser();
        if(u === undefined || u === null) {
            return false;
        }
        return u.userId !== undefined && u.userId !== null;
    }


    public logout() {
        return new Promise((resolve, reject) => {
            this.http.logout().then((data) => {
                this.utilsProvider.clearData();
                this.utilsProvider.cancelNotifications();
                resolve(true);
            },(err) => {
                console.log(err);
                reject(err);
            });
        });
    }

    public isFIRST(): boolean {
        return this.userProvider.getUser().entityCode.toLocaleLowerCase() == 'first';
    }

    public isBoss(): boolean {
        return this.userProvider.getUser().userId == 2284 || this.userProvider.getUser().userId == 12081 || this.userProvider.getUser().userId == 1;
    }

}