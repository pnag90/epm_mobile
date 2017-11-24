import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Episode } from '../../../providers/epm-types';
import { ConfProvider } from '../../../providers/conf-provider';

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
    
    private pageNumber: number = 0;
    private pageSize: number = 30;
    private loading: boolean;
    
    private birthString: string;

    constructor(private navCtrl: NavController, public params: NavParams, private conf:ConfProvider) {
        this.loading = false;
        this.segment = 'episode';
        this.episode = this.params.get('episode');
        this.birthString = "";

        if(this.episode){
            let str = this.episode.patientBirthdate;
            if(this.episode.patientAge){
                let ageValue = this.episode.patientAge['value'] + "";
                let ageUnit = this.episode.patientAge['unitLocale'] + "";
                str += ' (' + ageValue + ' anos)';
            }
            this.birthString = str;
        }

        this.defaultPic = this.conf.defaultUserPhoto();
        this.getPatientHistory(this.episode.patientFk);
    }

    getPatientHistory(patientId:string){
        this.loading = true;
        let url = '/mobile/appointment/episodes?u=' + patientId + "&ps=" + this.pageSize + "&pn=" + this.pageNumber;
        this.conf.get(url).then(result => {
            this.history = this.conf.getEpisodes(result || []);
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
