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

    constructor(private navCtrl: NavController, public params: NavParams, private conf:ConfService) {
        this.episode = this.params.get('episode');
        this.defaultPic = this.conf.defaultUserPhoto();
    }

    goBack() {
        this.navCtrl.pop();
    } 
        
}
