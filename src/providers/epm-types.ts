'use strict';

export class UserOption {
    id: string;
    userid: number;
    code: string;
    value: string;

    constructor(code:string, val:string, uid: number) {
        this.code = code;
        this.value = val;
        this.userid = uid;
        this.id = this.userid + '_' + this.code;
    }
}

export class User {
    entityId: number;
    entityFdfId: number;
    entityCode: string;
    entityName: string;
    coworkerId: number;
    userId: number;
    username: string;
    userFullname: string;
    userEmail: string;
    languageCode: string;
    photo: string;
    permissions: Array<UserOption>;
    options: Array<UserOption>;

    constructor(entityId: number, entityFdfId: number, entityCode: string, entityName: string, 
        coworkerId: number, userId: number, username: string, userFullname: string, userEmail: string, 
        languageCode: string, photo: string, permissions: Array<UserOption>, options: Array<UserOption>) {
            
            this.entityId = entityId;
            this.entityFdfId = entityFdfId;
            this.entityCode = entityCode;
            this.entityName = entityName;
            this.coworkerId = coworkerId;
            this.userId = userId;
            this.username = username;
            this.userFullname = userFullname;
            this.userEmail = userEmail;
            this.languageCode = languageCode;
            this.photo = photo;
            this.permissions = new Array<UserOption>();
            this.options = options;
        }
}

// Epm GenericEpisodeType.java
export class Episode {
    id: number;
    areaFk:string;
    areaCode:string;
    entityFk:number;
    insuranceFk:number;
    insuranceDesc:string;
    insuranceNumber:string;
    patientFk:string;
    patientName:string;
    patientBirthdate:string;
    patientAge:object;
    patientSex:string;
    patientProcessNum:string;
    patientAddress:string;
    patientMail:string;
    patientPhone:string;
    patientPhoto:any;
    teamFk:number;
    teamName:string;
    teamMembers:Array<number>;
    serviceFk:number;
    serviceName:string;
    scheduleFk:number;
    scheduledStartDate:string;
    scheduledStartTime:string;
    scheduledEndDate:string;
    scheduledEndTime:string;
    state:string;
    status:string;
    color: string;
    comingTime:string;
    callTime:string;
    outgoingTime:string;
    startDate:string;
    cancelledDate:string;
    cancelledFk:number;
    startedByCoworkerFk:number;
    observations:string;
    confirmation:string;

    constructor(){}
}

export class ChatUser {
    userId: number;
    userName: string;
    profName: string;
    profNum: string;
    userBirth: string;
    email: string;
    photo: string;
    state: string = 'offline';  
    lastActivity: number;
    alerts: number = 0;
    canReceiveCall: null;
}

export class ChatMessage {
    sender: any;
    receipt: string;
    timestamp: string;
    messages: Array<string> = [];
    readed: boolean = false;
}