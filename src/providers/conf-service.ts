import { Injectable } from '@angular/core';

@Injectable()
export class ConfService {
    
    private EPM_URL: string;   
    private EPM_SOCKET_URL: string; 
    private EPM_DEFAULT_USER_PIC: string;

    constructor() {
        this.EPM_URL        = "http://192.168.19.112:8080/EPMJ2EE";
        this.EPM_SOCKET_URL = "http://epmteste.first.pt:3001"; 
        this.EPM_DEFAULT_USER_PIC = "assets/img/avatar.png";
    }


    public defaultUserPhoto() : string{
        return this.EPM_DEFAULT_USER_PIC;
    }

    public mvc(){
        return this.EPM_URL + "/mvc";
    }
    
    public socket(){
        return this.EPM_SOCKET_URL;
    }

}