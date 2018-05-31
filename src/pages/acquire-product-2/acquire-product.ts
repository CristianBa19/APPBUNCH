import { Storage } from '@ionic/storage';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
//import { PaymentSubmittedPage } from "../payment-submited/payment-submited";
//import { DocumentDetailPage } from '../acquire-product/document-details/document-detail';
//import { PayPolicyPage } from '../acquire-product/pay-policy/pay-policy';
//import { ProductsPage } from '../products/products';
//import { SharePage } from '../share/share';
//import { ClienteProductDetailPage } from '../client-mode/cliente-product-detail/cliente-product-detail';
//import { AlertService } from '../../_helpers/alert.service'
//import { LocalizationModel } from '../../_helpers/localizationModel'
//import { IonicPage, Events, LoadingController, ToastController, Content } from 'ionic-angular';
import { LoadingController, ToastController, Content } from 'ionic-angular';
//import { Http, Headers } from '@angular/http';
import { Http } from '@angular/http';
//import { PaymentSubmittedPage2 } from '../payment-submited2/payment-submited2';
//import { errorPage } from '../error/error';
//import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
//import { File } from '@ionic-native/file';
import { SocialSharing } from '@ionic-native/social-sharing';
//import { MInputComponent } from '../../components/m-input/m-input';

import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';
//import { GESTURE_PRIORITY_MENU_SWIPE } from 'ionic-angular/gestures/gesture-controller';

@Component({
    selector: 'acquire-product-page-2',
    templateUrl: 'acquire-product.html',
})
export class AcquireProductPage2 {    

    constructor(public navCtrl: NavController, public http: Http, public navParams: NavParams, public modalCtrl: ModalController, 
        //public alertSrv: AlertService, 
        //public localizationModal: LocalizationModel, 
        public alertCtrl: AlertController, private storage: Storage, public loadingCtrl: LoadingController, public toastCtrl: ToastController, 
        private socialSharing: SocialSharing
        /*private transfer: FileTransfer, private file: File*/
    ) {}        
}