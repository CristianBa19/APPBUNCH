import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { DatePicker } from '@ionic-native/date-picker';
import { Keyboard } from '@ionic-native/keyboard';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';
import { Splash } from '../pages/splash/splash';
import { IntroductionPage } from '../pages/introduction/introduction';
import { RegistrerPage } from '../pages/registrer/registrer';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';

import { SocialSharing } from '@ionic-native/social-sharing';
import { MInputComponent } from '../components/m-input/m-input';

@NgModule({
  declarations: [
    MyApp,    
    Splash,
    IntroductionPage,
    RegistrerPage,
    LoginPage,
    HomePage,
    MInputComponent,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),    
    IonicStorageModule.forRoot(),
    HttpModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,    
    Splash,
    IntroductionPage,
    RegistrerPage,
    LoginPage,
    HomePage,
  ],
  providers: [
    SocialSharing,
    StatusBar,
    SplashScreen,
    DatePicker,
    Keyboard,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
