'use strict';

export class User {
    userId: string;
    coworkerId: string;
    username: string;
    userFullName: string;
    email: string;
    entityId: string;
    entityCode: string;
    languageCode: string;
    photo: string;
    options: Array<any>;


    constructor(userId:string, coworkerId:string, uname: string, fullname:string, email: string, entityId:string, entityCode:string, lang:string, pic:string) {
        this.userId = userId;
        this.coworkerId = coworkerId;
        this.username = uname;
        this.userFullName = fullname;
        this.email = email;
        this.entityId = entityId;
        this.entityCode = entityCode;
        this.languageCode = lang;
        this.photo = pic;
        this.options = [];
    }
}

// Epm GenericEpisodeType.java
export class Episode {
    areaCode:string;
    areaFk:string;
    episodeFk:string;
    episodeState:string;
    episodeStatus:string;
    insuranceDesc:string;
    insuranceFk:string;
    observations:string;
    patientAge:number;
    patientBirthDate:string;
    patientFk:string;
    patientName:string;
    patientPhoto:string;
    patientAddress:string;
    patientMail:string;
    patientPhone:string;
    patientProcessNum:string;
    patientSex:string;
    scheduledEndDate:string;
    scheduledEndDateTime:string;
    scheduledStartDate:string;
    scheduledStartDateTime:string;
    serviceFk:number;
    serviceName:string;
    teamFk:number;
    teamName:string;
    colorState:string;

    constructor(){}
}

export class ChatUser {
    userId: string;
    userName: string;
    state: string = 'offline';
    shortDescription: string;
    photo: string;
    canReceiveCall: null;
}

export class ChatMessage {
    sender: any;
    receipt: string;
    timestamp: string;
    messages: Array<string> = [];
    readed: boolean = false;
}