import { IonicPage, NavController } from 'ionic-angular';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from '../../providers/utils-service';
import { ConfService } from '../../providers/conf-service';
import { AuthService } from '../../providers/auth-service';
import { User, Episode } from '../../providers/epm-types';

@IonicPage()
@Component({
    selector: 'page-worklist',
    templateUrl: 'worklist.html'
})
export class WorklistPage implements OnInit {
    private user: User;
    private episodes: any;
    private totalEpisodes: number;
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
            let url: string = '/hiscore/mobilebiz/worklist?d=' + this.util.dateToString(this.currentDate,"DDMMYYYY");
            if (this.searchTxt != null && this.searchTxt.length > 1) {
                this.searchKey = this.searchTxt;
                url = url + '&s=' + this.searchKey;
            }
            this.conf.request(url).then(data => {
                console.log(data);
                this.episodes = this.conf.getEpisodes(data.RETURN || []);
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
            this.navCtrl.push('EpisodePage', { episode: episode });
        }
    }

}