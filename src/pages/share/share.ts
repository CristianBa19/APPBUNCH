import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
//import { SocialSharing } from '@ionic-native/social-sharing';

/**
 * Generated class for the SharePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-share',
  templateUrl: 'share.html',
})
export class SharePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    //private socialSharing: SocialSharing
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad SharePage');
  }

  nada() {
    /*this.socialSharing.canShareViaEmail().then(() => {
      alert('hi');
    }).catch(() => {
      alert('no hi');
    });*/
  }
}
