import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Episode } from '../../../models/epm-types';

@Component({
    selector: 'page-episode',
    templateUrl: 'episode.html'
})
export class EpisodePage {
    public episode : Episode;

    constructor(private navCtrl: NavController, public params: NavParams) {
        this.episode = this.params.get('episode');
    }

    goBack() {
        this.navCtrl.pop();
    } 
        
}
