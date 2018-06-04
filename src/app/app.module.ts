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
import { NewAdvertisementPage2 } from '../pages/new-advertisement-2/new-advertisement';
import { AdvertisementPage } from '../pages/advertisement/advertisement';
import { AcquireProductPage2 } from '../pages/acquire-product-2/acquire-product';
import { NotificationPage } from '../pages/notification/notification';
import { NotificationDetailPage } from '../pages/notification-detail/notification-detail';

import { StatisticsPage } from '../pages/statistics/statistics';
import { StatisticProductsPage } from './../pages/statistics/products/statistic-products';
import { StatisticClientsPage } from './../pages/statistics/clients/statistic-clients';
import { StatisticWeekPage } from './../pages/statistics/week/statistic-week';
import { StatisticWeeksPage } from './../pages/statistics/weeks/statistic-weeks';

import { ProfilePage } from './../pages/profile/profile';
import { HelpCenterPage } from './../pages/help-center/help-center';

//import { SocialSharing } from '@ionic-native/social-sharing';
import { MInputComponent } from '../components/m-input/m-input';

@NgModule({
  declarations: [
    MyApp,    
    Splash,
    IntroductionPage,
    RegistrerPage,
    LoginPage,
    HomePage,
    NewAdvertisementPage2,
    AdvertisementPage,
    AcquireProductPage2,
    NotificationPage,
    NotificationDetailPage,
    StatisticsPage,
    StatisticProductsPage,
    StatisticClientsPage,
    StatisticWeekPage,
    StatisticWeeksPage,
    ProfilePage,
    HelpCenterPage,
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
    NewAdvertisementPage2,
    AdvertisementPage,
    AcquireProductPage2,
    NotificationPage,
    NotificationDetailPage,
    StatisticsPage,
    StatisticProductsPage,
    StatisticClientsPage,
    StatisticWeekPage,
    StatisticWeeksPage,
    ProfilePage,
    HelpCenterPage,
  ],
  providers: [
    //SocialSharing,
    StatusBar,
    SplashScreen,
    DatePicker,
    Keyboard,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
