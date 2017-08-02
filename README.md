# ePM Mobile
A mobile application for ePM
- Website - https://epm.first-global.com/m/
- iOS - https://itunes.apple.com/us/app/epmmobile
- Android - https://play.google.com/store/apps/details?id=epm.mobile

## Prerequisites
- Download nodejs from https://nodejs.org/en/download/current/ It will install `node` and `npm`
```bash
node -v
 - should be >= 6.0.0
npm -v
 - should be >= 3.0.0
```
- For iOS, update XCode version to 8.0 or higher


## Getting Started

* Clone this repository

* Install Ionic, cordova and node_modules

    ```bash
    $ npm uninstall -g ionic cordova
    $ npm install -g ionic cordova
    $ npm install
    $ npm install --only=dev  
    ```

## Run

#### Browser
```bash
    # iOS 
    ionic serve --platform ios
    # Android
    ionic serve --platform android
    # All Platforms(iOS, Android and Windows)
    ionic serve --lab
```

### Android

```bash
    $ ionic cordova platform add android
    $ ionic cordova build android --prod
    $ ionic cordova run android --prod
```

### iOS
```bash
    $ ionic cordova platform add ios
    $ ionic cordova build ios --prod
```    
    Run using XCode
    
### icon resources
Run post_install script
```bash
    $ ./post_install.sh
```    
    
### Screenshots

* Phone

  <img src="screenshots/android-ios-phone.jpg" alt="android-ios-phone" width="500"/>
  
* Tablet
  
  <img src="screenshots/android-tablet.png" alt="android-tablet" width="350"/>
  <img src="screenshots/ios-tablet.png" alt="ios-tablet" width="350"/>    


## Contribution
:)


## License
ionic-mosum is available under the MIT license. See the LICENSE file for more info.  