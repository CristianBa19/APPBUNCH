import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { Http } from '@angular/http';
import { AlertController } from 'ionic-angular';

@Component({
    selector: 'page-recovery',
    templateUrl: 'recovery.html'
})
export class RecoveryPage {    

    email:string;

    constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public toastCtrl: ToastController) { }

    sendRequest() {

        var loader = this.loadingCtrl.create();
        loader.present();
        let email = this.email.trim();
        console.log('1');
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (re.test(String(email).toLowerCase()) !== true) {
            console.log('2');
            this.email = null;
            loader.dismiss();
            let toast = this.toastCtrl.create({
                duration: 3000,
                position: 'bottom',
                showCloseButton: true,
                closeButtonText: 'Ok',
                cssClass: 'toast',
                message: 'Email inválido',
            });
            toast.present();
        } else {
            console.log('3');
            let that = this,
                url = `http://services.bunch.guru/WebService.asmx/envioCorreo?email=${email}`;
            console.log({ url });
            this.http.get(url).map(res => res).subscribe(data => {
                loader.dismiss();
                console.log({ data });                
                if (data['_body'] === 'True') {
                    that.showAlert(`Hemos enviado un enlace a ${email} para restablecer tu contraseña.`, function () {
                        that.navCtrl.setRoot(LoginPage, false, { animate: true });
                    });
                } else if (data['_body'] === 'No existe usuario') {
                    that.showAlert('Email no registrado', function () {
                    });
                } else {
                    that.showAlert('Hubo un error, intente de nuevo por favor', function () {
                    });
                }
            }, err => {
                loader.dismiss();
                console.error({ err });                
                that.showAlert('Hubo un error, intente de nuevo por favor', function () {
                });
            });
        }
    }    

    showAlert(message: string, callback) {

        let _alert = this.alertCtrl.create({
            title: message,
            enableBackdropDismiss: false,
        });
        _alert.setCssClass('definidaX');
        _alert.addButton({
            text: 'OK',
            handler: data => {
                setTimeout(function () {
                    callback(data);
                }, 100);
            }
        });
        _alert.present();
    }    

    public doneRecovery = () => {
        this.navCtrl.setRoot(LoginPage, false, { animate: true });
    }

    goBack() {
        this.navCtrl.pop();     
    }
}
