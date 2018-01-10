import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ToastController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImageCropperComponent, CropperSettings, Bounds } from 'ng2-img-cropper';
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

    @ViewChild('cropper', undefined) ImageCropper : ImageCropperComponent;
    public cropperSettings;
    public croppedWidth: Number;
    public croppedHeight: Number;

    constructor(private nav: NavController,
        private toastCtrl: ToastController,
        public actionSheetCtrl: ActionSheetController,
        private conf: ConfProvider,
        private params: NavParams,
        public camera: Camera) {

        this.defaultPic = this.conf.defaultUserPhoto();
        this.user = this.params.get('user');

        // Here we set up the Image Cropper component settings
        this.cropperSettings = new CropperSettings();
        this.cropperSettings.width = 200;
        this.cropperSettings.height = 200;
        this.cropperSettings.canvasWidth = 300;
        this.cropperSettings.canvasHeight = 300;
  
        this.cropperSettings.croppedWidth = 200;
        this.cropperSettings.croppedHeight = 200;
        this.cropperSettings.noFileInput = true;
    
        this.cropperSettings.cropOnResize = true;
        this.cropperSettings.fileType = 'image/jpeg';
        this.cropperSettings.keepAspect = true;
        this.cropperSettings.rounded = false;
        this.cropperSettings.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
        this.cropperSettings.cropperDrawSettings.strokeWidth = 2;

        this.newPhoto = {};
    }

    chooseUserPhoto() {
        this.presentActionSheet();
    }
    private presentActionSheet() {
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
            sourceType          : this.camera.PictureSourceType.CAMERA,
            destinationType     : this.camera.DestinationType.DATA_URL,     //this.camera.DestinationType.FILE_URI
            encodingType        : this.camera.EncodingType.JPEG,
            mediaType           : this.camera.MediaType.PICTURE,
            quality             : 100,
            targetWidth         : 320,
            targetHeight        : 240,
            correctOrientation  : true,   //Corrects Android orientation quirks
            allowEdit           : false,
            cameraDirection     : this.camera.Direction.FRONT,
            saveToPhotoAlbum        : false
        };
        this.camera.getPicture(cameraOptions).then((imageData) => {
            this.setCropper(imageData);
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
            this.setCropper(imageData);
        }, (err) => {
            // Handle error
            console.log('CAMERA ERROR', err);
        });
    }

    setCropper(data) {
        console.log('new img', data);
        let imageData = 'data:image/png;base64,' + data; 


        let image: any = new Image();
        image.src = imageData;

        // Assign the Image object to the ImageCropper component
        this.ImageCropper.setImage(image);

        

        //this.user.photo = 'data:image/png;base64,' + imageData;
    }

    save() {
        console.dir(this.newPhoto.image);
        // set image on bd
        if (this.user != null && this.user.userId != null) {
            if(this.newPhoto && this.newPhoto.image){
                this.user.photo = this.newPhoto.image;
            }

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

   handleCropping(bounds : Bounds){
      this.croppedHeight 		= bounds.bottom  -  bounds.top;
      this.croppedWidth 		= bounds.right   -  bounds.left;
   }

    ionViewDidLoad() {

    }

    goBack() {
        this.nav.pop();
    }

}