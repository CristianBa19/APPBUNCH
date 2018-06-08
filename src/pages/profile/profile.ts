//import { LoginPage } from './../login/login';
import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular'; //ModalController
//import { HelpCenterPage} from '../help-center/help-center';
//import { LocalizationModel } from '../../_helpers/localizationModel'
//import { AlertService } from '../../_helpers/alert.service'

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  // public clienteChangeEmitter: EventEmitter<any> = new EventEmitter();
  public isClient: boolean;
  public isEnglish: boolean = false;
  public enableNotif: boolean;
  public inteligenFollow: boolean;
  public geoLocalization: boolean;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public _event: Events,
              //private modalCtrl: ModalController,
              //private localizationModel: LocalizationModel,
              //private alertService: AlertService
  ) {
      //this.isEnglish = localStorage.getItem("language") == "en"? true: false;
}



  /*private changeLanguage(){
    //this.isEnglish? this.localizationModel.changeLanguage("en"):this.localizationModel.changeLanguage("sp");
    //this.isEnglish?this.localizationModel.showModalInfo("Language is changed to English", 1500):this.localizationModel.showModalInfo("El idioma se cambia a español", 1500)
  }*/

  /*private openHelpCenterPage(){
    let modal = this.modalCtrl.create(HelpCenterPage);
    modal.present();
  }*/

  public logout = () => {
    localStorage.clear();    
    this._event.publish('user:logout');    
  }
  public UIupdate = (isClient) => {
    /*localStorage.setItem("isFirstEnterToHomeScreeb", "true");
    this.alertService.showLoading();
    setTimeout(()=>{
      this._event.publish('user:client', isClient);
    }, 500)*/
  } 
}