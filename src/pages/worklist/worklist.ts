import { NavController } from 'ionic-angular';
import { EpisodePage } from './episode/episode';
import { ConfService } from '../../providers/conf-service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../providers/auth-service';
import { Http } from '@angular/http';
import { User, Episode } from '../../models/epm-types';
import * as moment from 'moment';
import 'moment/locale/pt-br';

@Component({
    selector: 'page-worklist',
    templateUrl: 'worklist.html'
})
export class WorklistPage implements OnInit{
    private user : User;
    private episodes : any;
    private totalEpisodes : number;
    private worklistUrl : string = "/epm/mobile/biz/worklist";
    private defaultPic:string;
    private loading:boolean;

    private searchTxt : string = null;
    private searchKey : string = null;
    private currentDate :string = moment().toISOString();
    private worklistDate :string = '';

    constructor(private auth: AuthService, private http:Http, private conf:ConfService, private navCtrl:NavController) {
        this.defaultPic = this.conf.defaultUserPhoto();
        this.loading = false;
    }

    ngOnInit():void {
        this.user = this.auth.getUser();
        this.totalEpisodes = 0;
        this.getWorklist();
    }

    search():void{
        if(this.searchTxt != this.searchKey){
            this.getWorklist();
        }
    }

    dateChanged():void{
        if(this.worklistDate != this.currentDate){
            this.getWorklist();
        }
    }

    getWorklist():void{
        if(this.currentDate!==null){
            this.loading = true;
            let url : string = this.conf.mvc() + this.worklistUrl + '?d=' + moment(this.currentDate).format("DDMMYYYY");          
            if (this.searchTxt != null && this.searchTxt.length > 1) {
                this.searchKey = this.searchTxt;
                url = url + '&s=' + this.searchKey;
            }
            this.http.get(url, { withCredentials: true }).map(res => res.json()).subscribe(res => {
                if(res && !res.isError && res.result){
                    this.episodes = this.getEpisodes(res.result.returnvalue || []);
                    this.totalEpisodes = this.episodes.length || 0;
                    this.worklistDate = this.currentDate;
                    console.log(this.episodes);
                    this.loading = false;
                } else  {
                    console.error("erro pedido episodios");
                    this.loading = false;
                }                
            });
        }
    }

    getEpisodes(arr:any):any{
        let items: Array<Episode> = [];
        if(arr !== null){
            for(let a of arr){
                items.push({
                    areaCode: a.areaCode,
                    areaFk: a.areaFk,
                    episodeFk: a.episodeFk,
                    episodeState: a.episodeState,
                    episodeStatus: a.episodeStatus,
                    colorState: this.getColor(a.episodeState,a.episodeStatus),
                    insuranceDesc: a.insuranceDesc,
                    insuranceFk: a.insuranceFk,
                    observations: a.observations,
                    patientAge: a.patientAge,
                    patientBirthDate: a.patientBirthdateUTC ? moment(a.patientBirthdateUTC).format("DD-MM-YYYY") : null,
                    patientFk: a.patientFk,
                    patientName: a.patientName,
                    patientPhoto: a.patientPhoto || null,
                    patientProcessNum: a.patientProcessNum,
                    patientSex: a.patientSex,
                    scheduledEndDate: a.scheduledEndDateUTC ?  moment(a.scheduledEndDateUTC).format("HH:mm") : null,
                    scheduledStartDate: a.scheduledStartDateUTC ?  moment(a.scheduledStartDateUTC).format("HH:mm") : null,
                    serviceFk: a.serviceFk,
                    serviceName: a.serviceName,
                    teamFk: a.teamFk,
                    teamName: a.teamName,
                });
            }
        }
        return items;
    }

    getColor(state:string,status:string):string {
        var stateColor:string = "";
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

     openEpisode(episode:Episode){
        if(episode){
            this.navCtrl.push(EpisodePage, {episode:episode});
        }
    }


}