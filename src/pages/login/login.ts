import { Component, OnInit } from '@angular/core';
import { IntroductionPage } from './../introduction/introduction';
import { NavController, NavParams, IonicPage, LoadingController, ToastController } from 'ionic-angular';
//import { RecoveryPage } from '../recovery/recovery';
import { RegistrerPage } from '../registrer/registrer';
import { HomePage } from '../home/home';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
//import { AuthProvider } from '../../providers/auth/auth';
//import { usercreds } from '../../models/interfaces/usercreds';
import { FormGroup, FormControl, Validators, EmailValidator } from '@angular/forms';
//import { ValidateEmail } from '../../app/validators/email.validator';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage implements OnInit {    
    
    //credentials = {} as usercreds;
    
    constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, private storage: Storage, 
        //public authservice: AuthProvider, 
        public loadingCtrl: LoadingController, public toastCtrl: ToastController) { }
    
    email:string;
    password:string;

    message: string;
    isEnabled: boolean;
    myForm: FormGroup;
    password_type: string = 'password';
    validEmail;
    validPass;
    showPass = false;

    private viewPass(show:boolean) {
        this.showPass = show;
    }
    
    ngOnInit() {
        /*this.myForm = new FormGroup({
            user: new FormControl('', [Validators.required, ValidateEmail]),
            pass: new FormControl('', [Validators.required, Validators.minLength(7)]),
        });*/
    }    

    onSubmit(form: FormGroup) {
        let toaster;
        toaster = this.toastCtrl.create({
            duration: 3000,
            position: 'bottom'
        });
        toaster.dismiss();        
        // if (form.valid === true) {
            this.goIntro();
            // toaster.present();
        // } else {
        //     toaster.setMessage('E-mail o password incorrecto');
        //     toaster.present();
        // }
    }

    ionViewDidLoad() {        
        if (localStorage.idContVend != undefined) {
            this.storage.set('name', localStorage.idContVend);
            this.navCtrl.push(HomePage, { animate: true });
        }
    }

    createAccount = () => {
        this.navCtrl.push(RegistrerPage, { animate: true });
    }

    forgotPass = () => {
        //this.navCtrl.push(RecoveryPage, { animate: true });
    }

    goCarList = () => {
        //this.navCtrl.push(CarListPage, { animate: true });
    }
    goCarList2 = () => {
        //this.navCtrl.push(Login2Page, { animate: true });
    }

    private emailChange(a) {
        if (a.length == 0) {
            this.validEmail = undefined;
        } else { 
            this.validateEmail();
        }        
        
    }

    private passChange(pass) {
        if (pass.length == 0) {
            this.validPass = undefined;
        } else { 
            this.validatePass();
        }
    }

    private validateEmail(): boolean {
        let email = this.email;
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let result = re.test(String(email).toLowerCase());
        if (result === true) {            
            this.validEmail = true;
            return true;
        } else {            
            this.validEmail = false;
            return  false;
        }
    }

    private validatePass() {
        let pass = this.password;
        if (pass.length >= 6) {
            this.validPass = true;
            return true;
        } else {
            this.validPass = false;
            return false;
        }
    }    

    goIntro = () => {
        let toaster;
        toaster = this.toastCtrl.create({
            duration: 3000,
            position: 'bottom'
        });
        let loader = this.loadingCtrl.create({
            dismissOnPageChange: true,
        });
        loader.present();        

        if (this.validatePass() === false) {
            loader.dismiss();
            toaster.setMessage('Indique un password válido');
            toaster.present();	  
            return;
        } else if (this.validateEmail() === false) {
            loader.dismiss();
            toaster.setMessage('Indique un email válido');
            toaster.present();	  
            return;
        }

        this.message = '';
        this.isEnabled = false;

        let email = this.email,
            pass = this.password;        

        if (email != undefined && pass != undefined) {
            email = email.trim();
            pass = pass.trim();            

            let string = `usuario=${email}&password=${pass}`,
                encodedString = btoa(string),
                url = `http://services.bunch.guru/WebService.asmx/Login?param=${encodedString}`;            

            this.http.get(url).map(res => res.json()).subscribe(data => {                

                switch (data.respuesta) {
                    case 'true':
                        localStorage.idContVend = data.idContVend;
                        this.storage.set('name', data.idContVend);
                        this.signin();
                        break;
                    case 'false':
                        this.isEnabled = true;
                        loader.dismiss();
                        toaster.setMessage('Verifica tu contraseña');
                        toaster.present();  
                        break;
                    case 'No existe usuario':
                        this.isEnabled = true;
                        loader.dismiss();
                        toaster.setMessage('El usuario no existe');
                        toaster.present();  
                        break;
                    default:
                        this.isEnabled = true;
                        loader.dismiss();
                        toaster.setMessage('Hubo un error, intenta de nuevo');
                        toaster.present();
                }
            }, err => {
                console.log("el usuario no existe");
            });            
        } else {
            this.isEnabled = true;
            if (email == undefined) {
                toaster.setMessage('El campo usuario no puede estar vacío');
                toaster.present();
            } else {
                toaster.setMessage('El password no puede estar vacío');
                toaster.present();
            }
        }
    }

    signin() {
        /*let credentials = {email: this.email, password: this.password};
        this.authservice.login(credentials).then((res: any) => {
            if (!res.code) {
                this.navCtrl.push(HomePage, { animate: true });
            } else {
                localStorage.idContVend = undefined;                
            }
        });*/
        this.navCtrl.push(HomePage, { animate: true });
    }

    togglePasswordMode() {
        this.password_type = this.password_type === 'text' ? 'password' : 'text';
    }
}