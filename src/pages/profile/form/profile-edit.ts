
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ToastController } from 'ionic-angular';
import { ConfProvider } from '../../../providers/conf-provider';
import { User } from '../../../providers/epm-types';

@IonicPage()
@Component({
    selector: 'page-profile-edit',
    templateUrl: 'profile-edit.html'
})
export class ProfileEditPage {
    private user: User;
    private defaultPic: string;
    private newPhoto;

    constructor(private nav: NavController, 
        private toastCtrl: ToastController,
        public actionSheetCtrl: ActionSheetController, 
        private conf: ConfProvider, private params: NavParams) {

        this.defaultPic = this.conf.defaultUserPhoto();
        this.user = this.params.get('user');
    }

    choseUserHeadImg() {
        this.presentActionSheet();
    }
    presentActionSheet() {
        let actionSheet = this.actionSheetCtrl.create({
            title: "Imagem Utilizador",
            buttons: [
                {
                    text: 'Tirar uma foto',
                    role: 'destructive',
                    handler: () => {
                        /*var options = {
                            quality: 50,
                            destinationType: Camera.DestinationType.FILE_URI,
                            sourceType: Camera.PictureSourceType.CAMERA,
                            encodingType: Camera.EncodingType.JPEG,
                            mediaType: Camera.MediaType.PICTURE,
                            allowEdit: true,
                            correctOrientation: true
                        }
                        Camera.getPicture(options).then((imageData) => {
                            this.newPhoto = imageData;
                            this.transferUpLoad();
                        }, (err) => {

                        });*/
                    }
                }, {
                    text: 'Escolha do albun',
                    handler: () => {
                        let toast = this.toastCtrl.create({
                            message: 'Abrir album',
                            duration: 2000,
                            position: 'bottom'
                        });
                        toast.present();

                        let options = {
                            maximumImagesCount: 1,
                            width: 800,
                            height: 800,
                            quality: 80
                        };
                        /*ImagePicker.getPictures(options)
                            .then((results) => {
                                for (var i = 0; i < results.length; i++) {
                                    this.newPhoto = results[i];
                                }
                                this.transferUpLoad();
                            }, (err) => {

                        });*/
                    }
                }
            ]
        });
        actionSheet.present();
    }

    transferUpLoad() {
        // set image on bd

        // reload user
        let toast = this.toastCtrl.create({
            message: 'Foto atualizada',
            duration: 2000,
            position: 'bottom'
        });
        toast.present();

    }

    ionViewDidLoad() {

    }

    goBack() {
        this.nav.pop();
    }

}