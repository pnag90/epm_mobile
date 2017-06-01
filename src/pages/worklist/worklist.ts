import { NavController } from 'ionic-angular';
import { Component, OnInit } from '@angular/core';
import { EpisodePage } from './episode/episode';
import { ConfService } from '../../providers/conf-service';
import { AuthService } from '../../providers/auth-service';
import { User, Episode } from '../../models/epm-types';
import { Http } from '@angular/http';
import { TranslateService } from 'ng2-translate';
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
    private worklistUrl : string =  '/hiscore/mobilebiz/worklist'; // "/epm/mobile/biz/worklist";
    private defaultPic:string;
    private loading:boolean;

    private searchTxt : string = null;
    private searchKey : string = null;
    private currentDate :string = moment().toISOString();
    private worklistDate :string = '';
    private translate;

    constructor(translate: TranslateService, private auth: AuthService, private http:Http, private conf:ConfService, private navCtrl:NavController) {
        this.defaultPic = this.conf.defaultUserPhoto();
        this.loading = false;
        this.translate = translate;
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
                    this.episodes = this.conf.getEpisodes(res.result.returnvalue || []);
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

    openEpisode(episode:Episode){
        if(episode){
            this.navCtrl.push(EpisodePage, {episode:episode});
        }
    }


}