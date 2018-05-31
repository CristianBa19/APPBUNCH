import { Component } from '@angular/core';
import { Platform, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Splash } from '../pages/splash/splash';
import { IntroductionPage } from './../pages/introduction/introduction';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = IntroductionPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, modalCtrl:ModalController) {
    let splash = modalCtrl.create(Splash);
    splash.present();
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

