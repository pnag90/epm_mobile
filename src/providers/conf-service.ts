import { Injectable } from '@angular/core';
import { HttpService } from './http-service'; // import { Http } from '@angular/http';
import { UtilService } from './utils-service';
import { Episode } from './epm-types';

@Injectable()
export class ConfService {

    private EPM_URL: string;
    private EPM_SOCKET_URL: string;
    private EPM_DEFAULT_USER_PIC: string;

    constructor(public util: UtilService, public http: HttpService) {
        this.EPM_URL = http.epmUrl();
        this.EPM_SOCKET_URL = http.socketUrl();

        this.EPM_DEFAULT_USER_PIC = "assets/img/avatar.png";
    }

    public defaultUserPhoto(): string {
        return this.EPM_DEFAULT_USER_PIC;
    }

    public rest() {
        return this.EPM_URL + 'app/rest';
    }

    public socket() {
        return this.EPM_SOCKET_URL;
    }

    public request(path: string, params: object = {}): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                let postParams = JSON.stringify(params);
                this.http.post(this.rest() + path, postParams).then(res => {
                    console.log(path, res);
                    if (res && !res['isError'] && res['result']) {
                        resolve(res['result']);
                    } else {
                        console.error(path, res);
                        reject({ err: res });
                    }
                }, (err) => {
                    console.error(path, err);
                    reject({ err: err });
                });
            } catch (err) {
                console.error(path, err);
                reject({ err: err });
            }
        });
    }

    public get(path: string): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                this.http.get(this.rest() + path).then(function(res){
                    console.log(path, res);
                    if (res && !res['isError'] && res['result']) {
                        resolve(res['result']);
                    } else {
                        console.error(path, res);
                        reject({ err: res });
                    }
                }, (err) => {
                    console.error(path, err);
                    reject({ err: err });
                });                    
            } catch (err) {
                console.error(path, err);
                reject({ err: err });
            }
        });
    }

    // mapper
    public getEpisodes(arr: any): any {
        let items: Array<Episode> = [];
        if (arr !== null) {
            for (let a of arr) {
                items.push({
                    areaCode: a.areaCode,
                    areaFk: a.areaFk,
                    episodeFk: a.episodeFk,
                    episodeState: a.episodeState,
                    episodeStatus: a.episodeStatus,
                    colorState: a.episodeState && a.episodeStatus ? this.getColor(a.episodeState, a.episodeStatus) : null,
                    insuranceDesc: a.insuranceDesc,
                    insuranceFk: a.insuranceFk,
                    observations: a.observations,
                    patientAge: a.patientAge,
                    patientBirthDate: this.util.dateToStringDate(a.patientBirthdate),
                    patientFk: a.patientFk,
                    patientName: a.patientName,
                    patientPhoto: a.patientPhoto || null,
                    patientAddress: a.patientAddress,
                    patientMail: a.patientMail,
                    patientPhone: a.patientPhone,
                    patientProcessNum: a.patientProcessNum,
                    patientSex: a.patientSex,
                    scheduledEndDate: this.util.dateToStringDate(a.scheduledEndDate),
                    scheduledEndDateTime: this.util.dateToStringHour(a.scheduledEndDate),
                    scheduledStartDate: this.util.dateToStringDate(a.scheduledStartDate),
                    scheduledStartDateTime: this.util.dateToStringHour(a.scheduledStartDate),
                    serviceFk: a.serviceFk,
                    serviceName: a.serviceName,
                    teamFk: a.teamFk,
                    teamName: a.teamName,
                });
            }
        }
        return items;
    }

    private getColor(state: string, status: string): string {
        let stateColor: string = "";
        if (state == 'A' || state == 'D') {
            stateColor = 'app-state-ANU';
        }
        else if (status == '0' || status == null) {
            stateColor = '';
        }
        else if (state == 'M' || state == 'R') {
            // CHEGOU
            if (status == '1') {
                stateColor = 'app-state-CHE';
            }
            // CHAMADO
            else if (status == '2') {
                stateColor = 'app-state-CHA';
            }
            // SAIU
            else if (status == '3') {
                stateColor = 'app-state-SAI';
            }
        }
        // FALTA
        else if (state == 'F') {
            stateColor = 'app-state-FAL';
        }
        return stateColor;
    }

    


}