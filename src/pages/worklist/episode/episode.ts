import { Http } from '@angular/http';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Episode } from '../../../models/epm-types';
import { ConfService } from '../../../providers/conf-service';

@Component({
    selector: 'page-episode',
    templateUrl: 'episode.html'
})
export class EpisodePage {
    public episode : Episode;
    private defaultPic: string;
    private segment: string;
    private history: Array<Episode>;
    private start: string = "0";
    private size: string = "12";
    private loading: boolean;
    private historyUrl: string = '/hiscore/mobilebiz/patienthistory';

    constructor(private navCtrl: NavController, public params: NavParams, private conf:ConfService, private http:Http) {
        this.loading = false;
        this.segment = 'episode';
        this.episode = this.params.get('episode');
        this.defaultPic = this.conf.defaultUserPhoto();
        this.getPatientHistory(this.episode.patientFk);
    }

    getPatientHistory(patientId:string){
        this.loading = true;
        let url:string = this.conf.mvc() + this.historyUrl + '/' + patientId + "?start=" + this.start + "&size=" + this.size;
        this.http.get(url, { withCredentials: true }).map(res => res.json()).subscribe(
            res => {
                this.history = this.conf.getEpisodes(res.result.returnvalue || []);
                this.loading = false;
            },
            err => {
                console.error(err);
                this.history = [];
                this.loading = false;
            }
        ); 
    }

    goBack() {
        this.navCtrl.pop();
    } 
        
}
