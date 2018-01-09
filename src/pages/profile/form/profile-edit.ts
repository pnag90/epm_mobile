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
                        this.takePicture();
                    }
                }, {
                    text: 'Escolha do album',
                    handler: () => {
                        let toast = this.toastCtrl.create({
                            message: 'Abrir album',
                            duration: 2000,
                            position: 'bottom'
                        });
                        
                        this.uploadPicture();
                        toast.present();
                    }
                }
            ]
        });
        actionSheet.present();
    }

    private takePicture() {
        //setup camera options
        const cameraOptions: CameraOptions = {
            quality: 50,
            destinationType: this.camera.DestinationType.DATA_URL,     //this.camera.DestinationType.FILE_URI
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            sourceType: this.camera.PictureSourceType.CAMERA,
            correctOrientation: true,   //Corrects Android orientation quirks
            allowEdit: false,
            targetWidth: 150,
            targetHeight: 150,
            cameraDirection: this.camera.Direction.FRONT,
            saveToPhotoAlbum: false
        };
        this.camera.getPicture(cameraOptions).then((imageData) => {
            console.log('new img', imageData);
            this.user.photo = 'data:image/png;base64,' + imageData;
        }, (err) => {
            // Handle error
            console.log('CAMERA ERROR', err);
        });
    }

    private uploadPicture() {
        let toast = this.toastCtrl.create({
            message: 'Abrir album',
            duration: 2000,
            position: 'bottom'
        });
        toast.present();

        let options = {
            maximumImagesCount: 1,
            width: 400,
            height: 400,
            quality: 80
        };
        //setup camera options

        const cameraOptions: CameraOptions = {
            quality: 70,
            destinationType: this.camera.DestinationType.DATA_URL,     //    FILE_URI    DATA_URL
            encodingType: this.camera.EncodingType.PNG,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: false, 
            correctOrientation: true,
            targetWidth: 200,
            targetHeight: 200,
        };
        this.camera.getPicture(cameraOptions).then((imageData) => {
            console.log('new img', imageData);
            this.user.photo = 'data:image/png;base64,' + imageData;
        }, (err) => {
            // Handle error
            console.log('CAMERA ERROR', err);
        });
    }

    capture(imageData) {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64:
        console.log('new img', imageData);
        // this.newPhoto = 
        this.user.photo = 'data:image/png;base64,' + imageData;
    }

    save() {
        // set image on bd
        if (this.user != null && this.user.userId != null) {

            // reload user
            let toast = this.toastCtrl.create({
                message: 'Perfil atualizado',
                duration: 2000,
                position: 'bottom'
            });
            toast.present();

            this.goBack();
        }
    }

    ionViewDidLoad() {

    }

    goBack() {
        this.nav.pop();
    }

}