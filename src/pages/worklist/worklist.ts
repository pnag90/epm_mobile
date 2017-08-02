import { NavController } from 'ionic-angular';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EpisodePage } from './episode/episode';
import { UtilService } from '../../providers/utils-service';
import { ConfService } from '../../providers/conf-service';
import { AuthService } from '../../providers/auth-service';
import { User, Episode } from '../../providers/epm-types';

@Component({
    selector: 'page-worklist',
    templateUrl: 'worklist.html'
})
export class WorklistPage implements OnInit {
    private user: User;
    private episodes: any;
    private totalEpisodes: number;
    private worklistUrl: string = '/hiscore/mobilebiz/worklist';
    private defaultPic: string;
    private loading: boolean;

    private searchTxt: string = null;
    private searchKey: string = null;
    private currentDate: string;
    private worklistDate: string = '';

    constructor(public auth: AuthService, 
                public conf: ConfService, 
                public util: UtilService, 
                private translate: TranslateService,
                private navCtrl: NavController) {
        this.defaultPic = this.conf.defaultUserPhoto();
        this.currentDate = this.util.currentDate();
        this.loading = false;
    }

    ngOnInit(): void {
        this.user = this.auth.getUser();
        this.totalEpisodes = 0;
        this.getWorklist();
    }

    search(): void {
        if (this.searchTxt != this.searchKey) {
            this.getWorklist();
        }
    }

    dateChanged(): void {
        if (this.worklistDate != this.currentDate) {
            this.getWorklist();
        }
    }

    getWorklist(): void {
        if (this.currentDate !== null) {
            this.loading = true;
            let url: string = this.worklistUrl + '?d=' + this.util.dateToString(this.currentDate,"DDMMYYYY");
            if (this.searchTxt != null && this.searchTxt.length > 1) {
                this.searchKey = this.searchTxt;
                url = url + '&s=' + this.searchKey;
            }
            /*this.http.get(url, { withCredentials: true }).map(res => res.json()).subscribe(res => {
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
            });*/
            this.conf.request(url).then(data => {
                console.log(data);
                this.episodes = this.conf.getEpisodes(data.result || []);
                this.totalEpisodes = this.episodes.length || 0;
                this.worklistDate = this.currentDate;
                this.loading = false;
            }, err => {
                this.loading = false;
            });
        }
    }

    openEpisode(episode: Episode) {
        if (episode) {
            this.navCtrl.push(EpisodePage, { episode: episode });
        }
    }


}