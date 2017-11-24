import { Injectable } from '@angular/core';
import { User } from './epm-types';

@Injectable()
export class UserProvider {
    private currentUser: User;

    public getUser() : User {
        return this.currentUser;
    }

    public setUser(session : any) : void {
        let user = null;
        if(session!=null){
            user = <User>({
                entityId: session.entityId,
                entityFdfId: session.entityFdfId,
                entityCode: session.entityCode,
                entityName: session.entityName,
                coworkerId: session.coworkerId,
                userId: session.userId,
                username: session.username,
                userFullname: session.userFullname,
                userEmail: session.userEmail,
                languageCode: session.languageCode,
                photo: this.getPhoto(session.photo),
                permissions: session.permissions,
                options: session.options,
            });
        }
        console.log('setUser', user);
        this.currentUser = user;
    }

    public setOption(options: any):void {
        this.currentUser.options = options || [];
    }

    public getPhoto(img: any):string {
        if(!img || img==''){
            return null;
        }
        if(img.indexOf('data:image/jpeg;base64') > -1){
            return img;
        }
        return 'data:image/jpeg;base64,' + img;
    }

    public isLogged() : boolean {
        return this.currentUser!==null;
    }

    public isFIRST():boolean {
        return this.currentUser.entityCode.toLocaleLowerCase() == 'first';
    }

}