import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { LoadingController, ToastController } from 'ionic-angular';
import { Http } from '@angular/http';

@Component({
  selector: 'page-new-advertisement-2',
  templateUrl: 'new-advertisement.html',
})
export class NewAdvertisementPage2 {

  private step:number = 1;
  private tituloAnuncio:string;
  private mensajePersonalizado:string;
  private selectedImageId:number;

  constructor(public navCtrl: NavController, public navParams: NavParams,private socialSharing: SocialSharing, private loadingCtrl: LoadingController, private toastCtrl: ToastController, private http: Http) {    } 

  public showStep(stepIndex:number):void {        

    if (stepIndex == 2) { 
      if (this.tituloAnuncio == undefined || this.mensajePersonalizado == undefined) {
        let toast = this.toastCtrl.create({
            duration: 3000,
            position: 'bottom',
            showCloseButton: true,
            closeButtonText: 'Ok',
            cssClass: 'toast',
            message: 'Complete los campos',
            //dismissOnPageChange: true,
        });
        toast.present();
        return;
      }
    } else  if (stepIndex == 3) {
      if (this.selectedImageId == undefined) {
        let toast = this.toastCtrl.create({
            duration: 3000,
            position: 'bottom',
            showCloseButton: true,
            closeButtonText: 'Ok',
            cssClass: 'toast',
            message: 'Debe seleccionar una imágen',
            //dismissOnPageChange: true,
        });
        toast.present();
        return;
      }
    }

    this.step = stepIndex;      
  }

  private selectImage(id:number) {
    this.selectedImageId = id;
    let images = document.getElementsByClassName('image');
    for (let i = 0, len = images.length; i < len; i++) {
      images[i].classList.remove('selected');
    }    
    document.getElementById('image' + id).classList.add('selected');
    let imgIcons = document.getElementsByClassName('img-icon');
    for (let i = 0, len = imgIcons.length; i < len; i++) {
      imgIcons[i].classList.remove('selected');
    }
    document.getElementById('image' + id).parentElement.getElementsByClassName('img-icon')[0].classList.add('selected');
    document.getElementById('demo').style.backgroundImage = "url('../../assets/img/car" + id + ".jpg')";
  }

  public share() {
    this.socialSharing.share('Message','subject', undefined, 'http://xataka.com');
  }

  private publicarAnuncio() {
    console.log('publicarAnuncio');
    let loader = this.loadingCtrl.create();
        loader.present();        
        
    let url = `http://services.bunch.guru/WebService.asmx/crearAnuncio?usuario=Bunch&password=BunCH2O18&idVend=${localStorage.idContVend}&titulo=${this.tituloAnuncio}&mensaje=${this.mensajePersonalizado}&imagen=${this.selectedImageId}`;
    
    this.http.get(url).map(res => res).subscribe(data => {                                
        console.log({data});        
        loader.dismiss();        
    }, err => {
        console.error(url, err);          
        loader.dismiss();        
    });
  }

  private goBack() {
    if (this.step -1 >= 1) {
      --this.step;
    } else {
      this.navCtrl.pop();
    }
  }
}
