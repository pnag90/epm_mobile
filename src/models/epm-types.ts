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
    patientProcessNum:string;
    patientSex:string;
    scheduledEndDate:string;
    scheduledStartDate:string;
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