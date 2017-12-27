
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ToastController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
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
        private conf: ConfProvider, 
        private params: NavParams,
        public camera: Camera) {

        this.defaultPic = this.conf.defaultUserPhoto();
        this.user = this.params.get('user');

        
    }

    save() {
        if (this.user != null && this.user.userId!=null){
            this.goBack();
        }
    }

    choseUserHeadImg() {
        this.presentActionSheet();
    }
    presentActionSheet() {
        let camera = this.camera;
        let cameraCallback = this.capture;

        let actionSheet = this.actionSheetCtrl.create({
            title: "Imagem Utilizador",
            buttons: [
                {
                    text: 'Tirar uma foto',
                    role: 'destructive',
                    handler: () => {
                         //setup camera options
                         const cameraOptions: CameraOptions = {
                            quality: 100,
                            destinationType: camera.DestinationType.DATA_URL,     //this.camera.DestinationType.FILE_URI
                            encodingType: camera.EncodingType.PNG,
                            mediaType: camera.MediaType.PICTURE,
                            sourceType: camera.PictureSourceType.CAMERA,
                            correctOrientation: true
                        };
                        camera.getPicture(cameraOptions).then((imageData) => {
                            cameraCallback(imageData);
                          }, (err) => {
                            // Handle error
                            console.log('CAMERA ERROR',err);
                          });
                    }
                }, {
                    text: 'Escolha do album',
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
                         //setup camera options
                        
                        const cameraOptions: CameraOptions = {
                            quality: 100,
                            destinationType: camera.DestinationType.DATA_URL,     //this.camera.DestinationType.FILE_URI
                            encodingType: camera.EncodingType.PNG,
                            sourceType: camera.PictureSourceType.PHOTOLIBRARY,
                            correctOrientation: true,
                            targetWidth: 500,
                            targetHeight: 500,
                        };
                        camera.getPicture(cameraOptions).then((imageData) => {
                            cameraCallback(imageData);
                          }, (err) => {
                            // Handle error
                            console.log('CAMERA ERROR',err);
                          });
                    }
                }
            ]
        });
        actionSheet.present();
    }

    capture(imageData) {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64:
        this.newPhoto = 'data:image/jpeg;base64,' + imageData;
        this.user.photo = imageData;
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