import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
    selector: 'help-center-page',
    templateUrl: 'help-center.html',
})
export class HelpCenterPage {

    constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {}

    public goBack = () => {
        this.viewCtrl.dismiss();
    }
}
