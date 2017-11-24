import { Injectable } from '@angular/core';
import { HttpProvider } from './http-provider'; // import { Http } from '@angular/http';
import { UtilsProvider } from './utils-provider';
import { Episode } from './epm-types';

@Injectable()
export class ConfProvider {

    private EPM_DEFAULT_USER_PIC: string;

    constructor(public util: UtilsProvider, public http: HttpProvider) {
        this.EPM_DEFAULT_USER_PIC = "assets/img/avatar.png";
    }

    public defaultUserPhoto(): string {
        return this.EPM_DEFAULT_USER_PIC;
    }

    public rest() {
        return this.http.epmUrl();
    }

    public socket() {
        return this.http.socketUrl();
    }

    public request(path: string, params: object = {}): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                let postParams = JSON.stringify(params);
                this.http.post(path, postParams).then(res => {
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
                this.http.get(path).then(function(res){
                    console.log(path, res);
                    if (res && !res['isError'] && res['result']) {
                        resolve(res['result']);
                    } else {
                        console.error(path, res);
                        reject({ err: res['error'] });
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
                var item:Episode = new Episode();
                item.id = a.id;
                item.areaCode = a.areaCode;
                item.areaFk = a.areaFk;
                item.entityFk = a.entityFk;
                item.insuranceFk = a.insuranceFk;
                item.insuranceDesc = a.insuranceDesc;
                item.insuranceNumber = a.insuranceNumber;
                item.patientFk = a.patientFk;
                item.patientName = a.patientName;
                item.patientBirthdate = a.patientBirthdate;
                item.patientAge = this.util.getAge(a.patientBirthdate);
                item.patientSex = a.patientSex;
                item.patientProcessNum = a.patientProcessNum;
                item.patientAddress = a.patientAddress;
                item.patientAddress = a.patientAddress;
                item.patientMail = a.patientMail;
                item.patientPhone = a.patientPhone;
                item.patientPhoto = a.patientPhoto;
                item.teamFk = a.teamFk;
                item.teamName = a.teamName;
                item.teamMembers = a.teamMembers || [];
                item.serviceFk = a.serviceFk;
                item.serviceName = a.serviceName;
                item.scheduleFk = a.scheduleFk;
                item.scheduledStartDate = a.scheduledStartDate;
                item.scheduledStartTime = this.util.dateToStringHour(a.scheduledStartDate);
                item.scheduledEndDate = a.scheduledEndDate;
                item.scheduledEndTime = this.util.dateToStringHour(a.scheduledEndDate);
                item.state = a.state;
                item.status = a.status;
                item.comingTime = a.comingTime;
                item.callTime = a.callTime;
                item.outgoingTime = a.outgoingTime;
                item.startDate = a.startDate;
                item.cancelledDate = a.cancelledDate;
                item.cancelledFk = a.cancelledFk;
                item.startedByCoworkerFk = a.startedByCoworkerFk;
                item.observations = a.observations;
                item.confirmation = a.confirmation;

                item.color = this.getColor(item.state, a.status, a.startedByCoworkerFk);

                items.push(item);
            }
        }
        return items;
    }

    private getColor(state: string, status: string,startedBy: any ): string {
        let stateColor: string = "";
        if (state == 'A' || state == 'D') {
            stateColor = 'ANU';
        }
        else if (status == '0' || status == null) {
            stateColor = 'M';
        }
        else if (state == 'M' || state == 'R') {
            // CHEGOU
            if (status == '1') {
                stateColor = 'CHE';
            }
            // CHAMADO
            else if (status == '2') {
                stateColor = startedBy ? 'CON' : 'CHA';
            }
            // SAIU
            else if (status == '3') {
                stateColor = 'SAI';
            }
        }
        // FALTA
        else if (state == 'F') {
            stateColor = 'FAL';
        }
        return stateColor;
    }
    
   
}