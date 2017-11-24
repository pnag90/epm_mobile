import { IonicPage, List, NavController, Refresher } from 'ionic-angular';
import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UtilsProvider } from '../../providers/utils-provider';
import { ConfProvider } from '../../providers/conf-provider';
import { AuthProvider } from '../../providers/auth-provider';
import { User, Episode } from '../../providers/epm-types';
import * as _ from 'lodash';

@IonicPage()
@Component({
    selector: 'page-worklist',
    templateUrl: 'worklist.html'
})
export class WorklistPage {
    // the list is a child of the schedule page
    // @ViewChild('appointmentList') gets a reference to the list
    // with the variable #appointmentList, `read: List` tells it to return
    // the List and not a reference to the element
    // not used by now @ViewChild('appointmentList', { read: List }) appointmentList: List;

    private episodes: Array<Episode> = [];
    private episodesDP: any;
    private totalEpisodes: number;
    private defaultPic: string;

    private loading: boolean;
    private pageNumber: number = 0;
    private pageSize: number = 99;

    private searchTxt: string = null;
    private searchKey: string = null;
    private currentDate: string;
    private worklistDate: string = '';
    private worklistFilter: string = 'all';

    constructor(public auth: AuthProvider,
        public conf: ConfProvider,
        public util: UtilsProvider,
        private translate: TranslateService,
        private navCtrl: NavController) {
        this.defaultPic = this.conf.defaultUserPhoto();
        this.currentDate = this.util.currentDate();
        this.loading = false;
    }

    ionViewDidLoad() {
        this.totalEpisodes = 0;
        this.getWorklist();
    }

    search(): void {
        if (this.searchTxt != this.searchKey) {
            this.getWorklist();
        }
    }

    filterChanged(): void {
        this.setDataProvider();
    }

    dateChanged(): void {
        if (this.worklistDate != this.currentDate) {
            this.getWorklist();
        }
    }

    getWorklist(callback?: Function): void {
        if (this.currentDate !== null) {
            this.loading = true;
            /* ViewChild Reference
                // Close any open sliding items when the schedule updates
                this.appointmentList && this.appointmentList.closeSlidingItems();
            */
            let url: string = '/mobile/appointment/episodes?d=' + this.util.dateToString(this.currentDate, "YYYY-MM-DD") + "&ps=" + this.pageSize + "&pn=" + this.pageNumber;
            if (this.searchTxt != null && this.searchTxt.length > 1) {
                this.searchKey = this.searchTxt;
                url = url + '&s=' + this.searchKey;
            }
            this.conf.get(url).then(data => {
                console.log(data);
                this.episodesDP = this.conf.getEpisodes(data || []);
                this.totalEpisodes = this.episodesDP.length || 0;
                this.worklistDate = this.currentDate;
                this.setDataProvider();
                if (callback) {
                    callback();
                }
            }, err => {
                this.loading = false;
                if (callback) {
                    callback();
                }
            });
        }
    }

    setDataProvider(): void {
        this.loading = true;
        let filterEpisodes: Array<Episode> = [];
        let filterSelected: string = this.worklistFilter;
        _.each(this.episodesDP, function (e) {
            if (filterSelected === 'all' || (parseInt(e.status) < 3)) {
                filterEpisodes.push(e);
            }
        });
        this.episodes = filterEpisodes;
        this.loading = false;
    }

    doRefresh(refresher: Refresher) {
        this.getWorklist(function () {
            refresher.complete();
        });
    }

    openEpisode(episode: Episode) {
        if (episode) {
            this.navCtrl.push('EpisodePage', { episode: episode });
        }
    }

}