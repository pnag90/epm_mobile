import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Episode } from '../../../providers/epm-types';
import { ConfService } from '../../../providers/conf-service';

@IonicPage()
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

    constructor(private navCtrl: NavController, public params: NavParams, private conf:ConfService) {
        this.loading = false;
        this.segment = 'episode';
        this.episode = this.params.get('episode');
        this.defaultPic = this.conf.defaultUserPhoto();
        this.getPatientHistory(this.episode.patientFk);
    }

    getPatientHistory(patientId:string){
        this.loading = true;
        let url = '/hiscore/mobilebiz/patienthistory/' + patientId + "?start=" + this.start + "&size=" + this.size;
        this.conf.request(url).then(data => {
            console.log(data);
            this.history = this.conf.getEpisodes(data.RETURN || []);
            this.loading = false;
        }, err => {
            console.error(err);
            this.history = [];
            this.loading = false;
        });
    }

    goBack() {
        this.navCtrl.pop();
    } 
        
}
