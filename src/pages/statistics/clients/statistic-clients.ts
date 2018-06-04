import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
    selector: 'statistic-clients',
    templateUrl: 'statistic-clients.html',
})
export class StatisticClientsPage {

    constructor(public navCtrl: NavController) {}    

    public goBack = () => this.navCtrl.pop();    
    
    ionViewDidLoad() {}
}
