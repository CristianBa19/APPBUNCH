import { Component } from '@angular/core';
import { Platform, Events, ModalController, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Splash } from '../pages/splash/splash';
import { IntroductionPage } from './../pages/introduction/introduction';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = IntroductionPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, modalCtrl:ModalController, private app: App, private events: Events) {
    let splash = modalCtrl.create(Splash);
    splash.present();
    platform.ready().then(() => {
      /*// Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();*/

      this.events.subscribe('user:logout', () => {
        this.app.getRootNav().setRoot(LoginPage, null, { animate: true });
      });

      this.events.subscribe('user:homePage', ()=> { this.app.getRootNav().setRoot(HomePage, {openProduct:true}, {animate:true})});
      //this.localizationModel.setDefaultLanguage();

      statusBar.styleDefault();
    });
  }
}

