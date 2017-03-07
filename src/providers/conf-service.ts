import { Injectable } from '@angular/core';
import { Episode } from '../models/epm-types';
import * as moment from 'moment';
import 'moment/locale/pt-br';

@Injectable()
export class ConfService {
    
    private EPM_URL: string;   
    private EPM_SOCKET_URL: string; 
    private EPM_DEFAULT_USER_PIC: string;

    constructor() {
        this.EPM_URL        = "https://epm.first-global.com"; // "http://192.168.19.112:8080/EPMJ2EE";
        this.EPM_SOCKET_URL = "https://epm.first-global.com:8886"; // "http://192.168.20.71:3001";
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

    // mapper
    public getEpisodes(arr:any):any{
        let items: Array<Episode> = [];
        if(arr !== null){
            for(let a of arr){
                items.push({
                    areaCode: a.areaCode,
                    areaFk: a.areaFk,
                    episodeFk: a.episodeFk,
                    episodeState: a.episodeState,
                    episodeStatus: a.episodeStatus,
                    colorState: a.episodeState && a.episodeStatus ? this.getColor(a.episodeState,a.episodeStatus) : null,
                    insuranceDesc: a.insuranceDesc,
                    insuranceFk: a.insuranceFk,
                    observations: a.observations,
                    patientAge: a.patientAge,
                    patientBirthDate: a.patientBirthdateUTC ? moment(a.patientBirthdateUTC).format("DD-MM-YYYY") : null,
                    patientFk: a.patientFk,
                    patientName: a.patientName,
                    patientPhoto: a.patientPhoto || null,
                    patientAddress: a.patientAddress,
                    patientMail: a.patientMail,
                    patientPhone: a.patientPhone,
                    patientProcessNum: a.patientProcessNum,
                    patientSex: a.patientSex,
                    scheduledEndDate: a.scheduledEndDateUTC ?  moment(a.scheduledEndDateUTC).format("DD-MM-YYYY") : null,
                    scheduledEndDateTime: a.scheduledEndDateUTC ?  moment(a.scheduledEndDateUTC).format("HH:mm") : null,
                    scheduledStartDate: a.scheduledStartDateUTC ?  moment(a.scheduledStartDateUTC).format("DD-MM-YYYY") : null,
                    scheduledStartDateTime: a.scheduledStartDateUTC ?  moment(a.scheduledStartDateUTC).format("HH:mm") : null,
                    serviceFk: a.serviceFk,
                    serviceName: a.serviceName,
                    teamFk: a.teamFk,
                    teamName: a.teamName,
                });
            }
        }
        return items;
    }

    private getColor(state:string,status:string):string {
        let stateColor:string = "";
        if( state == 'A' || state == 'D' ){
            stateColor   = 'app-state-ANU';
        }
        else if(status == '0' || status == null){
            stateColor   = '';
        }
        else if( state == 'M' || state == 'R' ){
            // CHEGOU
            if(status == '1'){
                stateColor   = 'app-state-CHE';
            }
            // CHAMADO
            else if(status == '2'){
                stateColor   = 'app-state-CHA';
            }
            // SAIU
            else if(status == '3'){
                stateColor   = 'app-state-SAI';
            }
        }
        // FALTA
        else if( state == 'F' ){
            stateColor   = 'app-state-FAL';
        }
        return stateColor;
    }


}