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
    ) {
        this.prevPage = this.navParams.get("prevPage");
        this.isClient = localStorage.getItem("isClient");
        this.prevPage == "chat" ? this.topTab = "Compara" : this.isClient == "true" ? this.topTab = "Producto" : this.topTab = "Producto";
        //this.datePickerNames = this.localizationModal.getDatesNames();
    }

    @ViewChild(Content) content: Content;
    //private fileTransfer: FileTransferObject = this.transfer.create();
    color = 'pink';
    size = 16;
    url: string;
    data: string;

    codigoError = '';
    private toast:any;    
    private cotizacion = {aseguradora: '',clave: '',bancos:[],coberturas:[],monto:0, logo: '', responsabilidadCivil: {sumaAsegurada: '', deducible: ''}, roboTotal: {sumaAsegurada: '', deducible: ''}, danosMateriales: {sumaAsegurada: '', deducible: ''}};
    private urlEmisionDocumento;

    private currentStep:number = 1;
    private bancosDeCadaAseguradora:any;
    public step:number = 1;
    private createClient:boolean = false;    
    public datePicked: string;
    public datePickedBirth: string;
    private topTab = 'Cliente';
    private comparaDetailShown: boolean = false;  //Revisar se declara variable apra subir a ionic pro
    private productoContinuarShown: boolean = false; //Revisar se declara variable apra subir a ionic pro
    bottomAlertOptionsList = [];  //Revisar se declara variable apra subir a ionic pro
    private isClient: any;
    private isEnglish = localStorage.getItem("language") == "en";
    private comparaList = [];

    //Step 1

    //Values
    codigoPostal1: string; //DEBE ser string
    edad: number;
    edadTxt: string;
    marca: string;
    modelo: string;
    subMarca: string;
    descripcion: string;
    subDescripcion: string;

    //Inputs
    private inputModelo: any;
    private inputSubMarca: any;
    private inputDescripcion: any;
    private inputSubDescripcion: any;

    //Lists
    private marcaList: any;
    private modeloList: any;
    private subMarcaList: any;
    private descripcionList: any;
    private subDescripcionList: any;
	private PrimaTotalHDI: any;
    private PrimaNetaHDI: any;
    private DerechosHDI: any;
    private ImpuestosHDI: any;
    private RecargoHDI: any;						   

    //Step 2

    //Values
    email: string;
    nombre: string;
    paterno: string;
    materno: string;
    fechaNacimiento: string;
    genero: string;
    telCasa: string;
    telMovil: string;
    rfc: string;
    nacionalidad: string;
    lugarNacimiento: string;
    codigoPostal2: string; //DEBE ser string
    colonia: string;
    estado: string;
    delegacion: string;
    calle: string;
    numExterior: string;
    numInterior: string;
    numMotor: string;
    numSerie: string;
    numPlacas: string;

    //Step 5
    numTarjeta: string; //DEBE ser string
    tipoTarjeta: string;
    titular: string;
    banco: string;
    vigencia: string;
    cvv:string; //DEBE ser string
    aceptoCobros: any;

    //Lists
    private bancoList: any;
    aseguradoraPag: string;

    gender: string;    
    isEnabled: boolean;
    isEnabledTipo3: boolean;
    isEnabledTipo3Dir: boolean;

    aseguradoraCot: string;
    edadCot: string;
    emailCot: string;
    nombreCot: string;
    apellidoPCot: string;
    apellidoMCot: string;
    generoCot: string;
    movilCot: string;    
    noDePlacasCot: string;
    noDeSerieCot: string;
    noDeMotorCot: string;
    lugarDeNacimientoCot: string;
    cpCot: string;
    calleCot: string;
    noExtCot: string;
    noIntCot: string;
    coloniaCot: string;
    delegacionCot: string;
    estadoCot: string;
    telefonoCasaCot: string;
    claveCot: string;
    noTarjetaCot: string;    
    bancoCot: string;
    tipoCot: string;
    cvvCot: string;
    mesCot: string;
    anioCot: string;
    carrierCot: string;
    idCliCot: string;
    idDirCot: string;
    idContCot: string;

    private idContVend: number;   
    
    filterNumeric(elemName:string) {
        
        let elem = document.getElementById(elemName).getElementsByTagName('input')[0];
        let maxLen = elem.maxLength;
        if (elem.value != null) {
            let value = elem.value.trim();        
            let valueLen = value.length;
            if (value[valueLen - 1] == '.') {
                value = value.slice(0, -1); 
            }
            value = value.replace(/\.+/g, '');
            value = value.replace(/\-+/g, '');
            let filtered:string = '';
            try {            
                let arr = value.match(/\d+/g);        
                let len = arr.length;        
                for (let i = 0; i < len; i++) {                
                    filtered += arr[i];                
                }
            } catch(err) {}
            
            elem.value = filtered.substring(0, maxLen);
        } else {
            this[elemName] = null;
        }
    }    

    fillTab1() {
        //this.navCtrl.push(SharePage, null, { animate: false });
        //alert('test');
        this.socialSharing.canShareViaEmail().then(() => {
            alert('si se puede compartir via email');
          }).catch(() => {
            alert('no se puede compartir via email');
          });
        //this.socialSharing.share('orden de Compra', 'subject', 'http://server.anaseguros.com.mx/emision/impresion/temporal-impresion/04011929689000000.php', 'http://server.anaseguros.com.mx/emision/impresion/temporal-impresion/04011929689000000.php');

        //window.open(encodeURI('http://server.anaseguros.com.mx/emision/impresion/temporal-impresion/04011929689000000.php'), '_system', 'location=yes,EnableViewPortScale=yes');

        /*alert('yeah');                

        this.fileTransfer.download('http://server.anaseguros.com.mx/emision/impresion/temporal-impresion/04011929689000000.php', this.file.dataDirectory + 'file.pdf').then((entry) => {
            alert('suxes');
            console.log('download complete: ', entry.toURL());
        }, (error) => {
            alert('error'); 
        });*/

        this.codigoPostal1 = '79050';
        this.processPostalCode(this.codigoPostal1);
        this.edad = 29;
        this.genero = 'FEMENINO';
        this.edadTxt = `${this.edad} años`;
        this.marca = 'CHEVROLET';
        this.modelo = '2016';
        this.subMarca = 'AVEO';
        this.descripcion = 'A';
        this.subDescripcion = 'PAQ A';
        
        /*let that = this;                
        document.getElementById('felicidadesGNP').style.display = 'block';
        document.getElementById('felicidadesGNPButton').style.display = 'block';

        document.getElementById('felicidades').style.display = 'none';
        document.getElementById('felicidadesButton').style.display = 'none';
        that.step = 7;
        that.currentStep = 7;                    */
    }

    fillTab3() {
        console.log('fillTab3');
        this.email = this.getRandString() + '@gamil.com';
        this.nombre = 'NORMA';
        this.paterno = 'MARTINEZ';
        this.materno = 'MORALES';
        this.fechaNacimiento = '1988-09-30';        
        this.telCasa = '4811455422';
        this.telMovil = '4811455546';
        //this.rfc = 'CILL880212P11';        
        this.colonia = 'TIPZEN';
        this.estado = 'SAN LUIS POTOSI';
        this.delegacion = 'CIUDAD VALLES';
        this.calle = 'SAN LUIS';
        this.numExterior = '11';
        //this.numInterior = '';
        this.numMotor = 'A1234522';
        this.numSerie = 'ZHWGE11S84LA00140'; //'ZHWGE11S84LA00152';
        this.numPlacas = '7654321C';
        this.calcRFCYTitular();
    }

    fillPayment() {
        this.numTarjeta = '5562741575870512'; //'5352214717676811'; //'5188999191541287'; //'4169160321185259';
        //this.titular = `${this.nombre} ${this.paterno} ${this.materno}`;
        this.calcRFCYTitular();
        this.cvv = '123';
        //this.vigencia = '03-30';
        document.getElementById('aceptoCobros')['checked'] = true;
        this.getCardInfo(this.numTarjeta);
    }

    private validVars(fields:string[]) {        
        for (let i = 0, len = fields.length; i < len; i++) {
            if (this[fields[i]] === undefined || this[fields[i]] === null) {
                return false;
            }
        }

        return true;
    }

    private getCoberturas(callback) {
        
        let url = `http://services.bunch.guru/WebService.asmx/GetCoberturas?usuario=Bunch&password=BunCH2O18&aseguradora=${this.cotizacion.aseguradora}&paquete=${this.cobertura}`;        
        
        this.http.get(url).map(res => res.json()).subscribe(data => {                                
            callback(data.Coberturas);
        }, err => {
            console.error(url, err);
            callback([]);
        });
    }

    public showStep(stepIndex:number, obj:any = undefined, validate:boolean = true):void {        

        let currentStep = this.currentStep,
            errors = false,
            that = this;

        let loader = this.loadingCtrl.create();
        loader.present();        

        if (currentStep == 1) {
            errors = !this.validVars(['codigoPostal1', 'edad', 'genero', 'marca', 'modelo', 'subMarca', 'descripcion', 'subDescripcion']);
        } else if (currentStep == 2) {
            if (obj.valueInt <= 0) {
                loader.dismiss();
                return;
            }

            that.cotizacion.monto = obj.value;
            that.cotizacion.logo = obj.img;
            that.cotizacion.responsabilidadCivil.sumaAsegurada = obj.RC;
            that.cotizacion.responsabilidadCivil.deducible = obj.RCD;
            that.cotizacion.danosMateriales.sumaAsegurada = obj.danosMateriales;
            that.cotizacion.danosMateriales.deducible = obj.danosMaterialesD;
            that.cotizacion.roboTotal.sumaAsegurada = obj.roboTotal;
            that.cotizacion.roboTotal.deducible = obj.roboTotalD;   
            that.cotizacion.aseguradora = obj.asegur;   
            that.cotizacion.clave = obj.clave;

            for (let i = 0, len = that.bancosDeCadaAseguradora.length; i < len; i++) {
                let row = that.bancosDeCadaAseguradora[i];
                if (row.aseguradora == that.cotizacion.aseguradora) {                    
                    that.cotizacion.bancos = row.bancos;
                    break;
                }
            }

            let bancoList = [];
            for (let i = 0, len = that.cotizacion.bancos.length; i < len; i++) {
                bancoList.push(that.cotizacion.bancos[i].Abreviacion.toUpperCase());
            }

            that.bancoList = bancoList;

            //that.loadInputData('inputBank');
        } else if (currentStep == 4) {

            errors = !this.validVars(['email', 'nombre', 'paterno', 'materno', 'fechaNacimiento', 'telCasa', 'telMovil', 'rfc', 'colonia', 'estado', 'delegacion', 'calle', 'numExterior', 'numMotor', 'numSerie', 'numPlacas']);
        }
        
        if (validate == true && errors == true) {
            loader.dismiss();
            loader.onDidDismiss(() => {
                //that.showAlert('Faltan campos por completar');
                that.showToast('Faltan campos por completar');
            });
        } else {            

            if (this.currentStep == 1) {                            

                //Este dataObj es como un dummy porque no se ocupa que vaya con datos, solamente lo ocupamos para obtener el idCotMaster
                let dataObj = {
                    Aseguradora: '',
                    Cliente: {
                        TipoPersona: null,
                        Nombre: null,
                        ApellidoPat: null,
                        ApellidoMat: null,
                        RFC: this.rfc,
                        FechaNacimiento: `01/01/1988`,
                        Ocupacion: null,
                        CURP: null,
                        Direccion: {
                            Calle: null,
                            NoExt: null,
                            NoInt: null,
                            Colonia: null,
                            CodPostal: this.codigoPostal1,
                            Poblacion: null,
                            Ciudad: null,
                            Pais: null
                        },
                        Edad: this.edad,
                        Genero: this.genero,
                        Telefono: null,
                        Email: null
                    },
                    Vehiculo: {
                        Uso: 'PARTICULAR',
                        Marca: this.marca,
                        Modelo: this.modelo,
                        NoMotor: '',
                        NoSerie: '',
                        NoPlacas: '',
                        Descripcion: 'descripcionAseguradora',
                        CodMarca: '',
                        CodDescripcion: '',
                        CodUso: '',
                        Clave: 'clave',
                        Servicio: 'PARTICULAR'
                    },
                    Coberturas: [],
                    Paquete: this.cobertura, //si, this.cobertura contiene el valor de Paquete
                    Descuento: null,
                    PeriodicidadDePago: this.formaDePagoInt, //0 es Anual, 4 es Mensual
                    Cotizacion: {
                        PrimaTotal: null,
                        PrimaNeta: null,
                        Derechos: null,
                        Impuesto: null,
                        Recargos: null,
                        PrimerPago: null,
                        PagosSubsecuentes: null,
                        IDCotizacion: null,
                        CotID: null,
                        VerID: null,
                        CotIncID: null,
                        VerIncID:null,
                        Resultado: null
                    },
                    Emision: {
                        PrimaTotal: null,
                        PrimaNeta: null,
                        Derechos: null,
                        Impuesto: null,
                        Recargos: null,
                        PrimerPago: null,
                        PagosSubsecuentes: null,
                        IDCotizacion: null,
                        Terminal: null,
                        Documento: null,
                        Poliza: null,
                        Resultado: null
                    },
                    Pago: {
                        MedioPago: null,
                        NombreTarjeta: null,
                        Banco: null,
                        NoTarjeta: null,
                        MesExp: null,
                        AnioExp: null,
                        CodigoSeguridad: null,
                        NoClabe: null,
                        Carrier: 0
                    },
                    CodigoError: null,
                    urlRedireccion: null
                };
                let myJSON = JSON.stringify(dataObj);
                let enStr = btoa(`usuario=Bunch&Password=BunCH2O18&data=${myJSON}&movimiento=cotizacion&idContVend=${this.idContVend}`);
                let url = `http://services.bunch.guru/WebService.asmx/insertacotmaster?param=${enStr}`;
                console.warn('request insertacotmaster', {url});
                this.http.get(url).map(res => res.json()).subscribe(data => {
                    this.idCotMaster = data.Cotizacion.IdCotMaster;
                    console.warn('idCotMaster!', data.Cotizacion.IdCotMaster);
                    this.cotizar(undefined, 0, function() {
                        loader.dismiss();
                        loader.onDidDismiss(() => {
                            that.step = stepIndex;
                            that.currentStep = stepIndex;
                            that.content.scrollToTop();
                        });
                    });            
                });                                
            } else if (this.currentStep == 2) {
                this.getCoberturas(function(coberturas) {
                    loader.dismiss();
                    loader.onDidDismiss(() => {
                        that.step = stepIndex;
                        that.currentStep = stepIndex;
                        console.warn('checate estas coberturas', coberturas);

                        for (let i = 0, len = coberturas.length; i < len; i++) {
                            let e = coberturas[i],
                                sumaAsegurada = e.SumaAsegurada,
                                deducible = parseFloat(e.Deducible);
                            
                            sumaAsegurada = (sumaAsegurada == 'VALOR COMERCIAL' || sumaAsegurada == 'AMPARADA' || sumaAsegurada == 'VALOR CONVENIDO') ? sumaAsegurada : that.stringToFormatedPriceWithString(sumaAsegurada);

                            /*if (sumaAsegurada == 'AMPARADA') {
                                sumaAsegurada = '<ion-icon name="ios-checkmark-outline" class="amparada"></ion-icon><ion-icon name="ios-checkmark-outline" class="amparada"></ion-icon>';
                            }*/
                            
                            e.Deducible = (isNaN(deducible)) ? '' : deducible + '%';
                            e.SumaAsegurada = sumaAsegurada;
                        }

                        that.cotizacion.coberturas = coberturas;
                        that.content.scrollToTop();
                    });
                });            
            } else if (this.currentStep == 4) {
                this.crearCliente(function() {
                    console.log('crearCliente success');
                    //onSuccess
                    loader.dismiss();
                    loader.onDidDismiss(() => {
                        that.step = stepIndex;
                        that.currentStep = stepIndex;
                        that.content.scrollToTop();
                    });
                }, function() {
                    console.error('crearCliente error');
                    //onError, lo deje igual a onSuccess porque considero que un error al crear cliente no deberia ser bloqueante
                    loader.dismiss();
                    loader.onDidDismiss(() => {
                        that.step = stepIndex;
                        that.currentStep = stepIndex;
                        that.content.scrollToTop();
                    });
                });
            } else {
                this.step = stepIndex;
                this.currentStep = stepIndex;
                this.content.scrollToTop();
                loader.dismiss();
            }
        }        
    }        

    getRandString() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 10; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    private resetCarriers() {
        document.getElementById("master").style.opacity = "1";
        document.getElementById("visa").style.opacity = "1";
        document.getElementById("amex").style.opacity = "1";
    }

    master() {
        this.carrierCot = '1';
        document.getElementById("master").style.opacity = "1";
        document.getElementById("visa").style.opacity = ".5";
        document.getElementById("amex").style.opacity = ".5";
    }
    amex() {
        this.carrierCot = '2';
        document.getElementById("master").style.opacity = ".5";
        document.getElementById("visa").style.opacity = ".5";
        document.getElementById("amex").style.opacity = "1";
    }
    visa() {
        this.carrierCot = '0';
        document.getElementById("master").style.opacity = ".5";
        document.getElementById("visa").style.opacity = "1";
        document.getElementById("amex").style.opacity = ".5";
    }    

    ionViewDidLoad() {
        
        document.getElementById('opcionesCotizacion').addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();            
            return false;
        });        

        let loader = this.loadingCtrl.create();

        loader.present();

        this.storage.get('name').then((val) => {
            this.idContVend = val;            
            this.inputModelo = document.getElementById('inputModelo');
            this.inputSubMarca = document.getElementById('inputSubMarca');
            this.inputDescripcion = document.getElementById('inputDescripcion');
            this.inputSubDescripcion = document.getElementById('inputSubDescripcion');
            this.isEnabled = true;
            loader.dismiss();
            this.loadInputData('inputMarca');
        });
    }

    showToast(message) {
        let that = this;
        if (this.toast === undefined) {            
            this.toast = this.toastCtrl.create({
                duration: 3000,
                position: 'bottom',
                showCloseButton: true,
                closeButtonText: 'Ok',
                cssClass: 'toast',
                message: message,
                //dismissOnPageChange: true,
            });
            this.toast.present();
        } else {
            this.toast.dismiss();
            this.toast.onDidDismiss(() => {
                console.warn('Dismissed toast');
                //that.toast = undefined;
                that.toast = that.toastCtrl.create({
                    duration: 3000,
                    position: 'bottom',
                    showCloseButton: true,
                    closeButtonText: 'Ok',
                    cssClass: 'toast',
                    message: message,
                    //dismissOnPageChange: true,
                });
                that.toast.present();
            });
        }
    }

    showAlert(title: string, options: any = undefined, callback:any = undefined) {

        let _options = {};
        if (options != undefined) {
            _options = {
                inputs: options
            };
        }

        let _alert = this.alertCtrl.create(_options);
        _alert.setTitle(title);
        _alert.setCssClass('definidaX');        
        _alert.addButton({
            text: 'Cancelar',
            cssClass: 'alert-cancel-btn',
        });
        _alert.addButton({
            text: 'OK',
            handler: data => {
                if (callback != undefined) {
                    setTimeout(function () {
                        callback(data);
                    }, 100);
                }                
            }
        });
        _alert.present();
        
        if (options != undefined && options.length > 0) {            
            if (options[0]['type'] == 'radio') {                
                setTimeout(function () {
                    let elem = document.querySelector('div.alert-radio-group').querySelector('[aria-checked="true"]');                    
                    if (elem != null) {
                        elem.scrollIntoView();
                    }
                }, 400);
            }
        }

        setTimeout(function () {
            let elem = document.querySelector('input.alert-input[type="text"]');
            if (elem != null) {
                elem.addEventListener('keyup', function () {
                    elem['value'] = elem['value'].toUpperCase();
                });
            }
        }, 400);
    }

    loadInputData(inputId: string) {        

        let url,
            that = this,            
            loader = this.loadingCtrl.create();
        loader.present();

        switch (inputId) {
            case 'inputMarca':
                url = 'http://test.alimx.mx/WebService.asmx/GetMarcasJSON?usuario=AhorraSeguros&password=Ah0rraS3guros2017';
                break;
            case 'inputModelo':
                url = `http://test.alimx.mx/WebService.asmx/GetModelosJSON?usuario=AhorraSeguros&password=Ah0rraS3guros2017&marca=${this.marca}`;
                break;
            case 'inputSubMarca':
                url = `http://test.alimx.mx/WebService.asmx/GetDescripcionJSON?usuario=AhorraSeguros&password=Ah0rraS3guros2017&marca=${this.marca}&modelo=${this.modelo}`;
                break;
            case 'inputDescripcion':
                url = `http://test.alimx.mx/WebService.asmx/GetSubDescripcionJSON?usuario=AhorraSeguros&password=Ah0rraS3guros2017&marca=${this.marca}&modelo=${this.modelo}&descripcion=${this.subMarca}`;
                break;
            case 'inputSubDescripcion':
                url = `http://test.alimx.mx/WebService.asmx/GetDetalleJSON?usuario=AhorraSeguros&password=Ah0rraS3guros2017&marca=${this.marca}&modelo=${this.modelo}&descripcion=${this.subMarca}&subdescripcion=${this.descripcion}`;
                break;
            case 'inputBank':
                url = `http://services.bunch.guru/WebService.asmx/GetBancos?usuario=Bunch&password=BunCH2O18&aseguradora=${this.cotizacion.aseguradora}`;
                break;
        }

        console.log({url});

        this.http.get(url).map(res => res.json()).subscribe(data => {         
            
            console.log({data});

            switch (inputId) {
                case 'inputMarca':
                    this.marcaList = [];
                    for (let i = 0, len = data.ListadoMarcas.length; i < len; i++) {
                        this.marcaList.push(data.ListadoMarcas[i].Marca.trim());
                    }
                    break;
                case 'inputModelo':
                    this.modeloList = [];
                    for (let i = 0, len = data.ListadoDescripciones.length; i < len; i++) {
                        this.modeloList.push(data.ListadoDescripciones[i].Modelo.trim());
                    }
                    
                    this.inputModelo.classList.remove('focus');
                    this.inputSubMarca.classList.remove('focus');
                    this.inputDescripcion.classList.remove('focus');
                    this.inputSubDescripcion.classList.remove('focus');

                    //this.inputModelo.classList.remove('disabled');                    
                    this.enableElement('inputModelo');
                    this.inputModelo.classList.add('focus');
                    break;
                case 'inputSubMarca':
                    this.subMarcaList = [];
                    for (let i = 0, len = data.ListadoDescripciones.length; i < len; i++) {
                        this.subMarcaList.push(data.ListadoDescripciones[i].Descripcion.trim());
                    }

                    this.inputModelo.classList.remove('focus');
                    this.inputSubMarca.classList.remove('focus');
                    this.inputDescripcion.classList.remove('focus');
                    this.inputSubDescripcion.classList.remove('focus');

                    this.enableElement('inputSubMarca');
                    this.inputSubMarca.classList.add('focus');
                    break;
                case 'inputDescripcion':
                    this.descripcionList = [];
                    for (let i = 0, len = data.ListadoSubDescripciones.length; i < len; i++) {
                        this.descripcionList.push(data.ListadoSubDescripciones[i].SubDescripcion.trim());
                    }

                    this.inputModelo.classList.remove('focus');
                    this.inputSubMarca.classList.remove('focus');
                    this.inputDescripcion.classList.remove('focus');
                    this.inputSubDescripcion.classList.remove('focus');

                    this.enableElement('inputDescripcion');
                    this.inputDescripcion.classList.add('focus');
                    break;
                case 'inputSubDescripcion':
                    this.subDescripcionList = [];
                    for (let i = 0, len = data.ListadoDetalles.length; i < len; i++) {
                        this.subDescripcionList.push(data.ListadoDetalles[i].Detalle.trim());
                    }

                    this.inputModelo.classList.remove('focus');
                    this.inputSubMarca.classList.remove('focus');
                    this.inputDescripcion.classList.remove('focus');
                    this.inputSubDescripcion.classList.remove('focus');

                    this.enableElement('inputSubDescripcion');
                    this.inputSubDescripcion.classList.add('focus');
                    break;
                case 'inputBank':                    
                    this.bancoList = [];                    
                    for (let i = 0, len = data.Bancos.length; i < len; i++) {
                        this.bancoList.push(data.Bancos[i].Abreviacion);
                    }                    
                    break;
            }                        
            loader.dismiss();            
        }, err => {
            console.error({ err, url });
            loader.dismiss();
            that.showToast('Error');
        });
    }

    async validatePostalCode(postalCode) {

        let url = `http://services.bunch.guru/WebService.asmx/ConsultaCP?CPostal=${postalCode}`;
        return await new Promise((resolve, reject) => {
            this.http.get(url)
                .map(res => res.json())
                .subscribe(data => {
                    resolve(data);
                }, err => {
                    reject(err);
                });
        });
    }

    scrollToElement(elementId:string):void {
        let x = document.getElementById(elementId);        
        if (x != null) {
            x.scrollIntoView();
        }        
    }

    codigoPostalChanged(that, cp) {                
        if (cp === null) {
            that.codigoPostal1 = null;
            that.codigoPostal2 = null;
            that.userColonyList = [];
            that.showToast('Código postal inválido');            
        } else {            
            that.processPostalCode(cp);
        }
    }

    numTarjetaChanged(that, numTarjeta) {
        if (numTarjeta == null || numTarjeta.length == 0) {
            that.numTarjeta = null;
        } else {
            that.getCardInfo(numTarjeta);
        }        
    }    

    titularChanged(that, titular) {
        if (titular == null || titular.length == 0) {
            that.titular = null;
        } else {
            that.titular = titular.toUpperCase();
        }
    }    

    mInputChange(elementId, callback) {
        let input = document.getElementById(elementId).getElementsByTagName('input')[0],
            value = input.value,
            that = this;
            /*inputType = input.type;
        console.warn({inputType});

        if (inputType == 'number') {
            console.warn({value});
            value = value.replace(/\.+/g, '');
            value = value.replace(/\-+/g, '');
            input.value = value;
        }*/

        if (value.length == 0) {
            that[elementId] = null;            
        } else {
            console.log('!!!--->', value);
            that[elementId] = value;            
            console.log('¡¡¡¡--->', that[elementId]);
        }        
        if (callback != undefined) {            
            console.log('00000--->', that[elementId]);
            callback(that, that[elementId]);         
        }        
    }

    showAlertCP1() {


        let that = this,
            title = this.isEnglish ? 'Input ZIP code' : 'Código Postal',
            options = [{ type: 'number', name: 'codigoPostal1', value: this.codigoPostal1, min: 3, max: 5 }];

        this.showAlert(title, options, function(data) {
            that.scrollToElement('codigoPostal1');
            let cp = data.codigoPostal1.trim();            
            if (cp.length == 0) {
                that.codigoPostal1 = null;                
                that.codigoPostal2 = null;
                that.userColonyList = [];
                that.showToast('Código postal inválido');
                that.showAlertCP1();
            } else {
                that.processPostalCode(cp);
            }            
        });
    }

    processPostalCode(cp:string) {
        let that = this,
            loader = that.loadingCtrl.create({
                content: 'Validando código postal'
            });
        loader.present();
        that.validatePostalCode(cp).then(data => {

            loader.dismiss();

            if (data['Colonias'].length == 0 && data['Estado'] == null && data['Municipio'] == null) {
                that.codigoPostal1 = null;
                that.codigoPostal2 = null;
                that.userColonyList = [];
                that.showToast('Código postal inválido');                                
            } else {
                that.codigoPostal1 = cp;                

                let codigoPostal2 = cp,
                    url = 'http://services.bunch.guru/WebService.asmx/ConsultaCP?CPostal=' + codigoPostal2;

                that.userColonyList = [];
                that.http.get(url).map(res => res.json()).subscribe(data => {
                    that.delegacion = data.Municipio.toUpperCase();
                    that.estado = data.Estado.toUpperCase();
                    for (let i = 0, len = data.Colonias.length; i < len; i++) {
                        that.userColonyList.push(data.Colonias[i].Colonia.toUpperCase());
                    }
                    that.codigoPostal2 = codigoPostal2;
                }, err => {
                    that.codigoPostal1 = null;
                    that.codigoPostal2 = null;
                    that.userColonyList = [];
                    that.showToast('Código postal inválido');                                    
                });
            }
        });
    }            

    private disableElement(id) {
        document.getElementById(id).setAttribute('disabled', 'disabled');
    }

    private disableElements(arrIds) {
        for (let i = 0, len = arrIds.length; i < len; i++) {
            this.disableElement(arrIds[i]);
        }
    }

    private enableElement(id) {
        document.getElementById(id).removeAttribute('disabled');
    }

    showAlertEdad() {        

        let that = this;
        this.bottomAlert('edad', this.edadList, function(edad) {
            if (edad == null) {
                that.edadTxt = null;                
            } else {                
                that.edadTxt = `${edad} años`;
                let year = new Date().getFullYear();
                edad = Number(edad);
                that.minYear  = year - edad - 1;
                that.maxYear  = that.minYear + 2;
            }                                    
        });
    }

    showAlertMarca() {        
        let that = this; 
        this.bottomAlert('marca', this.marcaList, function() {

            //that.scrollToElement('marca');
            that.modelo = undefined;
            that.subMarca = undefined;
            that.descripcion = undefined;
            that.subDescripcion = undefined;

            that.disableElements(['inputModelo', 'inputSubMarca', 'inputDescripcion', 'inputSubDescripcion']);
            that.loadInputData('inputModelo');
        });        
    }

    showAlertTipoTarjeta() {                
        let that = this;
        this.bottomAlert('tipoTarjeta', ['CRÉDITO', 'DÉBITO'], function() {
            if (that.tipoTarjeta === 'CRÉDITO') {
                that.tipoTarjeta = 'CREDITO';
                that.tipoCot = 'CREDITO';
            } else {
                that.tipoTarjeta = 'DEBITO';
                that.tipoCot = 'DEBITO';
            }
        });
    }

    showAlertBancos() {        
        let that = this;        
        this.bottomAlert('banco', that.bancoList);
    }
    
    showAlertModelo() {

        if (document.getElementById('inputModelo').getAttribute('disabled') !== null) { return; }

        let that = this; 
        this.bottomAlert('modelo', this.modeloList, function() {

            that.subMarca = undefined;
            that.descripcion = undefined;
            that.subDescripcion = undefined;

            that.disableElements(['inputSubMarca', 'inputDescripcion', 'inputSubDescripcion']);
            that.loadInputData('inputSubMarca');
        });                
    }

    showAlertSubMarca() {

        if (document.getElementById('inputSubMarca').getAttribute('disabled') !== null) { return; }

        let that = this; 
        this.bottomAlert('subMarca', this.subMarcaList, function() {
            
            that.descripcion = undefined;
            that.subDescripcion = undefined;

            that.disableElements(['inputDescripcion', 'inputSubDescripcion']);
            that.loadInputData('inputDescripcion');
        });                        
    }    

    showAlertDescripcion() {

        if (document.getElementById('inputDescripcion').getAttribute('disabled') !== null) { return; }

        let that = this; 
        this.bottomAlert('descripcion', this.descripcionList, function() {
                        
            that.subDescripcion = undefined;

            that.disableElements(['inputSubDescripcion']);
            that.loadInputData('inputSubDescripcion');
        });                        
    }    

    showAlertSubDescripcion() {

        if (document.getElementById('inputSubDescripcion').getAttribute('disabled') !== null) { return; }        
        this.bottomAlert('subDescripcion', this.subDescripcionList);
    }

    //--------------------------------------

    showAlertColony() {
        if (this.isEnabledTipo3Dir == true) {            
            this.bottomAlert('colonia', this.userColonyList);
        }
    }    

    hasClass(htmlElement: any, clase: string): boolean {

        if (htmlElement['className'].indexOf(clase) === -1) {
            return false;
        } else {
            return true;
        }
    }

    private getBancosDeCadaAseguradora(aseguradoras:any, callback:any, index:number = 0) {
        console.warn('getBancosDeCadaAseguradora');
        let obj = aseguradoras[index];
        if (obj == undefined) {
            callback(aseguradoras);
            return;
        }
        let aseguradora = obj.aseguradora;
        let url = `http://services.bunch.guru/WebService.asmx/GetBancos?usuario=Bunch&password=BunCH2O18&aseguradora=${aseguradora}`;
        this.http.get(url).map(res => res.json()).subscribe(data => {            
            obj.bancos = data.Bancos;
            this.getBancosDeCadaAseguradora(aseguradoras, callback, ++index);
        }, err => {
            callback([]);
        });
    }

    getAseguradoras(success, err) {        

        let url = "",
            aseguradora,
            clave,
            descripcion,
            aseguradoras = [],
            obj,
            that = this;

        url = 'http://services.bunch.guru/WebService.asmx/getAseguradoras';
        this.http.get(url).map(res => res.json()).subscribe(data => {            
            let arr = [];
            for (let i = 0, len = data.Aseguradoras.length; i < len; i++) {
                arr.push(data.Aseguradoras[i].Aseguradora);
            }                            

            url = `http://test.alimx.mx/WebService.asmx/BuscarJSON?usuario=AhorraSeguros&password=Ah0rraS3guros2017&marca=${this.marca}&modelo=${this.modelo}&descripcion=${this.subMarca}&subdescripcion=${this.descripcion}&detalle=${this.subDescripcion}`;        
            this.http.get(url).map(res => res.json()).subscribe(data => {
                for (let i = 0, len = data.Catalogo.length; i < len; i++) {
                    obj = data.Catalogo[i];
                    aseguradora = obj.Aseguradora;
                    if (arr.indexOf(aseguradora) !== -1) {
                        clave = obj.CatDescripciones[0].clave;
                        descripcion = obj.CatDescripciones[0].Descripcion;
                        aseguradoras.push({ aseguradora, clave, descripcion });
                    }                
                }          
                
                that.getBancosDeCadaAseguradora(aseguradoras, function(aseguradoras) {
                    console.warn('getBancoDeCadaAseguradora', aseguradoras);
                    that.bancosDeCadaAseguradora = aseguradoras;
                    success(aseguradoras);
                });                
            }, err => {
                err(err);
            });
        }, err => {
            console.error({url, err});
        });        
    }    

    cotizar(aseguradoras: any = undefined, index: number = 0, callback:any = undefined) {
        
        let that = this;        

        if (aseguradoras === undefined) {            
            this.comparaList = [];
            this.getAseguradoras(function(aseguradoras) {
                that.cotizar(aseguradoras, index, callback);
            }, function(err) {
                that.showAlert('Ha habido un error, intente de nuevo por favor');
            });
        } else {            
            let obj = aseguradoras[index];

            //if (index == 0) {
            //    this.comparaList = [];
            //}            

            if (obj == undefined) {
                
                //Si el valueInt es NaN lo convertimos a cero para poder preparar un ordenamiento en base al valueInt
                this.comparaList.forEach(function (e) {
                    if (isNaN(e.valueInt)) {
                        e.valueInt = 0;
                    }
                });

                //Ordena de menor a mayor precio
                this.comparaList.sort(function (a, b) {
                    if (a.valueInt < b.valueInt)
                        return -1;
                    if (a.valueInt > b.valueInt)
                        return 1;
                    return 0;
                });

                //Para acomodar los que tengan menor o igual a 0 en valueInt hasta el final de la lista
                let tmpArr = [],
                    tmpArr2 = [];
                for (let i = 0, len = this.comparaList.length; i < len; i++) {                    
                    if (this.comparaList[i].valueInt > 0) {
                        tmpArr.push(this.comparaList[i]);
                    } else {
                        tmpArr2.push(this.comparaList[i]);
                    }
                }

                this.comparaList = tmpArr.concat(tmpArr2);
                
                //Muestra los resultados, 
                //los cuales previamente estaban ocultos para esperar a que 
                //los resultados se ordenaran de menor a mayor precio
                //(le deje 2 segundos para que el comparList alcance a desplegarse en html, hay que buscar un event cuando las cosas sean embedidas en html para evitar el esperar 2 segundos fijos)
                setTimeout(function() {
                    let elems = document.getElementsByClassName('resultado-aseguradora');
                    console.log({elems});
                    for (let i = 0, len = elems.length; i < len; i++) {
                        //elems[i]['style'].display = 'block';
                        console.log(i);
                        elems[i].classList.remove('hidden');
                    }
                    
                    if (callback != undefined) {
                        callback();
                    }
                }, 2000);                
            } else {
                this.getCotizacionPorAseguradora(obj, function() {
                    that.cotizar(aseguradoras, ++index, callback);
                });
            }
        }        
    }    

    //Solo funciona para numeros enteros
    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    //La ideas quitar decimales (ceil), formatear con comas y agregar un simbolo de $
    //por ejemplo formatPrice(1212.32) debe regresar $ 1,212
    formatPrice(price: any) {
        if (price == undefined) {
            return 'No disponible';
        }
        if (typeof price == 'string') {
            price = Math.ceil(parseInt(price));
        }
        let n = this.numberWithCommas(price);        
        if (n == 'NaN') {
            return 'No disponible';
        } else {
            return '$ ' + this.numberWithCommas(price);
        }
    }

    //Toma una cadena por ejemplo "500,000.00 POR PERSONA", la limpia, le quita los decimales, le agrega $ y retorna:
    //"$ 500,000 POR PERSONA"
    //PD. Si, ese nombresote, no se me ocurrio otro    
    stringToFormatedPriceWithString(string: string): string {
        string = string.trim();
        let arr = string.split(' '); //separa la frase que viene despues de la cantidad
        let price = arr.shift();
        price = price.split('.')[0]; //quita los decimales
        return '$ ' + price + ' ' + arr.join(' ');
    }

    private idCotMaster;

    getCotizacionPorAseguradora(objAseguradora, callback) {

        console.log('getCotizacionPorAseguradora', {objAseguradora});

        let aseguradora = objAseguradora.aseguradora,
            clave = objAseguradora.clave, 
            descripcionAseguradora = objAseguradora.descripcion;        
        var data2:any = "";        

        var displayPrimaTotal = "";
        var displayPrimaTotalInt = 0;

        var displayDanosMateriales = "";
        var displayRoboTotal = "";
        var displayRCPersonas = "";
        var displayRC = "";
        var displayDefensaJuridica = "";
        var displayGastosMedicosOcupantes = "";

        //Variables para los deducibles
        var displayDanosMaterialesD = "";
        var displayRoboTotalD = "";
        var displayRCPersonasD = "";
        var displayRCD = "";
        var displayDefensaJuridicaD = "";
        var displayGastosMedicosOcupantesD = "";
        var fecha = new Date();
        var ano = fecha.getFullYear();
        var anioFechaNac = ano - this.edad;
        //var myJSON = '{"Aseguradora":"' + aseguradora + '","Cliente":{"TipoPersona":null,"Nombre":null,"ApellidoPat":null,"ApellidoMat":null,"RFC":"' + this.rfc + '","FechaNacimiento":"01/01/' + anioFechaNac + '","Ocupacion":null,"CURP":null,"Direccion":{"Calle":null,"NoExt":null,"NoInt":null,"Colonia":null,"CodPostal":"' + this.codigoPostal1 + '","Poblacion":null,"Ciudad":null,"Pais":null},"Edad":' + this.edad + ',"Genero":"Masculino","Telefono":null,"Email":null},"Vehiculo":{"Uso":"PARTICULAR","Marca":"' + this.marca + '","Modelo":"' + this.modelo + '","NoMotor":"","NoSerie":"","NoPlacas":"","Descripcion":"' + descripcionAseguradora + '","CodMarca":"","CodDescripcion":"","CodUso":"","Clave":"' + clave + '","Servicio":"PARTICULAR"},"Coberturas":[],"Paquete":"'+cobertura+'","Descuento":null,"PeriodicidadDePago":0,"Cotizacion":{"PrimaTotal":null,"PrimaNeta":null,"Derechos":null,"Impuesto":null,"Recargos":null,"PrimerPago":null,"PagosSubsecuentes":null,"IDCotizacion":null,"CotID":null,"VerID":null,"CotIncID":null,"VerIncID":null,"Resultado":null},"Emision":{"PrimaTotal":null,"PrimaNeta":null,"Derechos":null,"Impuesto":null,"Recargos":null,"PrimerPago":null,"PagosSubsecuentes":null,"IDCotizacion":null,"Terminal":null,"Documento":null,"Poliza":null,"Resultado":null},"Pago":{"MedioPago":null,"NombreTarjeta":null,"Banco":null,"NoTarjeta":null,"MesExp":null,"AnioExp":null,"CodigoSeguridad":null,"NoClabe":null,"Carrier":0},"CodigoError":null,"urlRedireccion":null}';
        let dataObj = {
            Aseguradora: aseguradora,
            Cliente: {
                TipoPersona: null,
                Nombre: null,
                ApellidoPat: null,
                ApellidoMat: null,
                RFC: this.rfc,
                FechaNacimiento: `01/01/${anioFechaNac}`,
                Ocupacion: null,
                CURP: null,
                Direccion: {
                    Calle: null,
                    NoExt: null,
                    NoInt: null,
                    Colonia: null,
                    CodPostal: this.codigoPostal1,
                    Poblacion: null,
                    Ciudad: null,
                    Pais: null
                },
                Edad: this.edad,
                Genero: this.genero,
                Telefono: null,
                Email: null
            },
            Vehiculo: {
                Uso: 'PARTICULAR',
                Marca: this.marca,
                Modelo: this.modelo,
                NoMotor: '',
                NoSerie: '',
                NoPlacas: '',
                Descripcion: descripcionAseguradora,
                CodMarca: '',
                CodDescripcion: '',
                CodUso: '',
                Clave: clave,
                Servicio: 'PARTICULAR'
            },
            Coberturas: [],
            Paquete: this.cobertura, //si, this.cobertura contiene el valor de Paquete
            Descuento: null,
            PeriodicidadDePago: this.formaDePagoInt, //0 es Anual, 4 es Mensual
            Cotizacion: {
                PrimaTotal: null,
                PrimaNeta: null,
                Derechos: null,
                Impuesto: null,
                Recargos: null,
                PrimerPago: null,
                PagosSubsecuentes: null,
                IDCotizacion: null,
                CotID: null,
                VerID: null,
                CotIncID: null,
                VerIncID:null,
                Resultado: null
            },
            Emision: {
                PrimaTotal: null,
                PrimaNeta: null,
                Derechos: null,
                Impuesto: null,
                Recargos: null,
                PrimerPago: null,
                PagosSubsecuentes: null,
                IDCotizacion: null,
                Terminal: null,
                Documento: null,
                Poliza: null,
                Resultado: null
            },
            Pago: {
                MedioPago: null,
                NombreTarjeta: null,
                Banco: null,
                NoTarjeta: null,
                MesExp: null,
                AnioExp: null,
                CodigoSeguridad: null,
                NoClabe: null,
                Carrier: 0
            },
            CodigoError: null,
            urlRedireccion: null
        };

        //console.warn({dataObj});                
            
        //console.warn('respuesta de insertacotmaster', {data});
        dataObj.Cotizacion['IdCotMaster'] = this.idCotMaster;
        let myJSON = JSON.stringify(dataObj),
        //myJSON = JSON.stringify(data),
            enStr = btoa(`usuario=Bunch&Password=BunCH2O18&data=${myJSON}&movimiento=cotizacion&idContVend=${this.idContVend}`),
            url = `http://services.bunch.guru/WebService.asmx/CotizacionEmisionJSON?param=${enStr}`;

        console.warn('request cotizacion', {url});

        this.http.get(url).map(res2 => res2.json()).subscribe(data => {

            console.warn('respuesta cotizacion', {data});

            var data3 = '',
                data4 = '',
                data5 = '',
                data6 = '',
                data7 = '',
                data8 = '',
                coberturas = data.Coberturas[0];

            if (coberturas != undefined) {
                data3 = coberturas.DanosMateriales;
                data4 = coberturas.RoboTotal;
                data5 = coberturas.RCPersonas;
                data6 = coberturas.RC;
                data7 = coberturas.DefensaJuridica;
                data8 = coberturas.GastosMedicosOcupantes;
            }

            displayDanosMateriales = (JSON.stringify(data3)).replace(/"|-N|-S|DAÑOS|MATERIALES/g, '');
            displayRoboTotal = (JSON.stringify(data4)).replace(/"|-N|-S|ROBO|TOTAL/g, '');
            displayRCPersonas = (JSON.stringify(data5)).replace(/"|-N|-S|NRC|PERSONAS|RESPONSABILIDAD|CIVIL|PERSONAS|NO|APLICA|RC|-|D|-/g, '');
            displayRC = (JSON.stringify(data6)).replace(/"|-N|-S|-D|RESPONSABILIDAD|CIVIL|NO|APLICA|No|aplica/g, '');
            displayDefensaJuridica = (JSON.stringify(data7)).replace(/"|-N|-S|-D|GASTOS|ES|ASISTENCIA|LEGAL|PROVIAL|LEGALES/g, '');
            displayGastosMedicosOcupantes = data8.replace(/"|-N|-S|-D|GASTOS|MÉDICOS|OCUPANTES/g, '').trim();            

            //seccion para la recepcion de la primaTotal y su conversion a int
            displayPrimaTotal = '';
            data2 = data.Cotizacion.PrimaTotal;

            if (data2 != null && isNaN(data2) == false) {
                displayPrimaTotalInt = Math.ceil(parseInt(data2));
                displayPrimaTotal = this.formatPrice(displayPrimaTotalInt);
            }

            //para los daños materiales
            let displayDanosMaterialesArr = displayDanosMateriales.split('-D');
            displayDanosMaterialesD = this.formatPrice(displayDanosMaterialesArr[1]);
            displayDanosMateriales = this.formatPrice(displayDanosMaterialesArr[0]);

            //para el robo total
            let displayRoboTotalArr = displayRoboTotal.split('-D');
            displayRoboTotalD = this.formatPrice(displayRoboTotalArr[1]);
            displayRoboTotal = this.formatPrice(displayRoboTotalArr[0]);

            //Def juridica
            //displayDefensaJuridicaD=displayDefensaJuridica.split('-D')[1];
            displayDefensaJuridica = this.formatPrice(displayDefensaJuridica.split('-D')[0]);

            //Gastos medicos ocupantes
            displayGastosMedicosOcupantesD = displayGastosMedicosOcupantes.split('-D')[0];
            if (displayGastosMedicosOcupantesD === '  Amparada')
                displayGastosMedicosOcupantes = 'Amparada';
            else {
                //displayGastosMedicosOcupantes = parseInt(displayGastosMedicosOcupantes.split('-D')[0]).toLocaleString();
                //displayGastosMedicosOcupantes = '$ ' + displayGastosMedicosOcupantes;
                displayGastosMedicosOcupantes = this.formatPrice(displayGastosMedicosOcupantes);
            }
            if (displayGastosMedicosOcupantes === '$NaN') {
                displayGastosMedicosOcupantes = 'No disponible';
            }

            //RC Personas         
            if (displayRCPersonasD === '  Amparada -')
                displayRCPersonasD = 'Amparada';
            else
                displayRCPersonasD = '$ ' + displayRCPersonasD;
            if (displayRCPersonasD === '$ ')
                displayRCPersonasD = 'No disponible';

            aseguradora = aseguradora.replace(/"/g, '');
            //document.getElementById("nombreAuto").innerHTML = this.marca + ' ' + this.modelo;
            //document.getElementById("descrAuto").innerHTML = this.descripcion;
            //document.getElementById("subDescrAuto").innerHTML = this.subDescripcion;

            if (aseguradora === 'ABA' && displayPrimaTotal !== "null" && !isNaN(displayPrimaTotalInt) && displayDanosMateriales !== null && displayDanosMateriales !== 'undefined') {

                if (displayPrimaTotal.length == 0) {
                    displayPrimaTotal = 'No disponible';
                }

                this.comparaList.push({
                    clave: clave,
                    asegur: aseguradora,
                    img: "assets/icon/logo/asegurdoras-aba.svg",
                    value: displayPrimaTotal,
                    valueInt: displayPrimaTotalInt,
                    danosMateriales: displayDanosMateriales,
                    danosMaterialesD: displayDanosMaterialesD,
                    roboTotal: displayRoboTotal,
                    roboTotalD: displayRoboTotalD,
                    RCPersonas: displayRCPersonas,
                    RCPersonasD: displayRCPersonasD,
                    RC: displayRC,
                    RCD: displayRCD,
                    DefensaJuridica: displayDefensaJuridica,
                    DefensaJuridicaD: displayDefensaJuridicaD,
                    GastosMedicosOcupantes: displayGastosMedicosOcupantes,
                    GastosMedicosOcupantesD: displayGastosMedicosOcupantesD

                });
                callback();
            } else if (aseguradora === 'ANA') {                
                displayPrimaTotal = '';
                let primaAna = data.Cotizacion.PrimaTotal;
                if (primaAna != null && isNaN(primaAna) == false) {
                    displayPrimaTotalInt = Math.ceil(parseInt(primaAna));
                    displayPrimaTotal = this.formatPrice(displayPrimaTotalInt);
                }

                if (data.Coberturas[0] != undefined) {
                    displayDanosMateriales = (JSON.stringify(data.Coberturas[0].DanosMateriales)).replace(/"|-N|-S|DAÑOS|MATERIALES/g, '');
                    displayRoboTotal = (JSON.stringify(data.Coberturas[0].RoboTotal)).replace(/"|-N|-S|ROBO|TOTAL/g, '');

                    displayRCPersonas = data.Coberturas[0].RCPersonas.replace(/"|-N|-S|NRC|PERSONAS|RESPONSABILIDAD|CIVIL|PERSONAS|NO|APLICA|RC|-|D|-/g, '');
                    displayRCPersonas = this.stringToFormatedPriceWithString(displayRCPersonas);

                    displayRC = data.Coberturas[0].RC.replace(/"|-N|-S|-D|RESPONSABILIDAD|CIVIL|NO|APLICA|No|aplica/g, '');
                    displayRC = this.stringToFormatedPriceWithString(displayRC);

                    displayDefensaJuridica = (JSON.stringify(data.Coberturas[0].DefensaJuridica)).replace(/"|-N|-S|-D|GASTOS|ES|ASISTENCIA|LEGAL|PROVIAL|LEGALES/g, '');
                    displayGastosMedicosOcupantes = (JSON.stringify(data.Coberturas[0].GastosMedicosOcupantes)).replace(/"|-N|-S|-D|GASTOS|MÉDICOS|OCUPANTES/g, '');

                    let displayDanosMaterialesArr = displayDanosMateriales.split('-D');
                    displayDanosMaterialesD = this.formatPrice(displayDanosMaterialesArr[1]);
                    displayDanosMateriales = this.formatPrice(displayDanosMaterialesArr[0]);

                    //para el robo total
                    let displayRoboTotalArr = displayRoboTotal.split('-D');
                    displayRoboTotalD = this.formatPrice(displayRoboTotalArr[1]);
                    displayRoboTotal = this.formatPrice(displayRoboTotalArr[0]);

                    if (displayPrimaTotal.length == 0) {
                        displayPrimaTotal = 'No disponible';
                    }

                    this.comparaList.push({
                        clave: clave,
                        asegur: aseguradora,
                        img: "assets/icon/logo/asegurdoras-ana.svg",
                        value: displayPrimaTotal,
                        valueInt: displayPrimaTotalInt,
                        danosMateriales: displayDanosMateriales,
                        danosMaterialesD: displayDanosMaterialesD,
                        roboTotal: displayRoboTotal,
                        roboTotalD: displayRoboTotalD,
                        RCPersonas: displayRCPersonas,
                        RCPersonasD: displayRCPersonasD,
                        RC: displayRC,
                        RCD: displayRCD,
                        DefensaJuridica: displayDefensaJuridica,
                        DefensaJuridicaD: displayDefensaJuridicaD,
                        GastosMedicosOcupantes: displayGastosMedicosOcupantes,
                        GastosMedicosOcupantesD: displayGastosMedicosOcupantesD
                    });
                }
                //}
                callback();
            } else if (aseguradora === 'AXA' && displayPrimaTotal !== "null" && !isNaN(displayPrimaTotalInt) && displayDanosMateriales !== null && displayDanosMateriales !== 'undefined') {

                if (displayPrimaTotal.length == 0) {
                    displayPrimaTotal = 'No disponible';
                }

                this.comparaList.push({
                    clave: clave,
                    asegur: aseguradora,
                    img: "assets/icon/logo/asegurdoras-axa.svg",
                    value: displayPrimaTotal,
                    valueInt: displayPrimaTotalInt,
                    danosMateriales: displayDanosMateriales,
                    danosMaterialesD: displayDanosMaterialesD,
                    roboTotal: displayRoboTotal,
                    roboTotalD: displayRoboTotalD,
                    RCPersonas: displayRCPersonas,
                    RCPersonasD: displayRCPersonasD,
                    RC: displayRC,
                    RCD: displayRCD,
                    DefensaJuridica: displayDefensaJuridica,
                    DefensaJuridicaD: displayDefensaJuridicaD,
                    GastosMedicosOcupantes: displayGastosMedicosOcupantes,
                    GastosMedicosOcupantesD: displayGastosMedicosOcupantesD
                });
                callback();
            } else if (aseguradora === 'BANORTE' && displayPrimaTotal !== "null" && !isNaN(displayPrimaTotalInt) && displayDanosMateriales !== null && displayDanosMateriales !== 'undefined') {

                if (displayPrimaTotal.length == 0) {
                    displayPrimaTotal = 'No disponible';
                }

                this.comparaList.push({
                    clave: clave,
                    asegur: aseguradora,
                    img: "assets/icon/logo/asegurdoras-banorte.svg",
                    value: displayPrimaTotal,
                    valueInt: displayPrimaTotalInt,
                    danosMateriales: displayDanosMateriales,
                    danosMaterialesD: displayDanosMaterialesD,
                    roboTotal: displayRoboTotal,
                    roboTotalD: displayRoboTotalD,
                    RCPersonas: displayRCPersonas,
                    RCPersonasD: displayRCPersonasD,
                    RC: displayRC,
                    RCD: displayRCD,
                    DefensaJuridica: displayDefensaJuridica,
                    DefensaJuridicaD: displayDefensaJuridicaD,
                    GastosMedicosOcupantes: displayGastosMedicosOcupantes,
                    GastosMedicosOcupantesD: displayGastosMedicosOcupantesD
                });
                callback();
            } else if (aseguradora === 'GMX' && displayPrimaTotal !== "null" && !isNaN(displayPrimaTotalInt) && displayDanosMateriales !== null && displayDanosMateriales !== 'undefined') {

                if (displayPrimaTotal.length == 0) {
                    displayPrimaTotal = 'No disponible';
                }

                this.comparaList.push({
                    clave: clave,
                    asegur: aseguradora,
                    img: "assets/icon/logo/asegurdoras-gmx.svg",
                    value: displayPrimaTotal,
                    valueInt: displayPrimaTotalInt,
                    danosMateriales: displayDanosMateriales,
                    danosMaterialesD: displayDanosMaterialesD,
                    roboTotal: displayRoboTotal,
                    roboTotalD: displayRoboTotalD,
                    RCPersonas: displayRCPersonas,
                    RCPersonasD: displayRCPersonasD,
                    RC: displayRC,
                    RCD: displayRCD,
                    DefensaJuridica: displayDefensaJuridica,
                    DefensaJuridicaD: displayDefensaJuridicaD,
                    GastosMedicosOcupantes: displayGastosMedicosOcupantes,
                    GastosMedicosOcupantesD: displayGastosMedicosOcupantesD
                });
                callback();
            } else if (aseguradora === 'GNP') {

                var primaGNP = '';                                                        
                primaGNP = data.Cotizacion.PrimaTotal;
                displayPrimaTotalInt = Math.ceil(parseInt(primaGNP));
                displayPrimaTotal = this.formatPrice(displayPrimaTotalInt);
                displayDanosMateriales = (JSON.stringify(data.Coberturas[0].DanosMateriales)).replace(/"|-N|-S|DAÑOS|MATERIALES/g, '');
                displayRoboTotal = (JSON.stringify(data.Coberturas[0].RoboTotal)).replace(/"|-N|-S|ROBO|TOTAL/g, '');
                displayRCPersonas = (JSON.stringify(data.Coberturas[0].RCPersonas)).replace(/"|-N|-S|NRC|PERSONAS|RESPONSABILIDAD|CIVIL|PERSONAS|NO|APLICA|RC|-|D|-/g, '');
                displayRC = (JSON.stringify(data.Coberturas[0].RC)).replace(/"|-N|-S|-D|RESPONSABILIDAD|CIVIL|NO|APLICA|No|aplica/g, '');
                displayDefensaJuridica = (JSON.stringify(data.Coberturas[0].DefensaJuridica)).replace(/"|-N|-S|-D|GASTOS|ES|ASISTENCIA|LEGAL|PROVIAL|LEGALES/g, '');
                displayGastosMedicosOcupantes = data.Coberturas[0].GastosMedicosOcupantes.replace(/"|-N|-S|-D|GASTOS|MÉDICOS|OCUPANTES/g, '');
                displayGastosMedicosOcupantes = this.formatPrice(displayGastosMedicosOcupantes);

                let displayDanosMaterialesArr = displayDanosMateriales.split('-D');
                displayDanosMaterialesD = this.formatPrice(displayDanosMaterialesArr[1]);
                displayDanosMateriales = this.formatPrice(displayDanosMaterialesArr[0]);

                //para el robo total
                let displayRoboTotalArr = displayRoboTotal.split('-D');
                displayRoboTotalD = this.formatPrice(displayRoboTotalArr[1]);
                displayRoboTotal = this.formatPrice(displayRoboTotalArr[0]);

                if (displayPrimaTotal.length == 0) {
                    displayPrimaTotal = 'No disponible';
                }                    

                this.comparaList.push({
                    clave: clave,
                    asegur: aseguradora,
                    img: "assets/icon/logo/asegurdoras-gnp.svg",
                    value: displayPrimaTotal,
                    valueInt: displayPrimaTotalInt,
                    danosMateriales: displayDanosMateriales,
                    danosMaterialesD: displayDanosMaterialesD,
                    roboTotal: displayRoboTotal,
                    roboTotalD: displayRoboTotalD,
                    RCPersonas: displayRCPersonas,
                    RCPersonasD: displayRCPersonasD,
                    RC: displayRC,
                    RCD: displayRCD,
                    DefensaJuridica: displayDefensaJuridica,
                    DefensaJuridicaD: displayDefensaJuridicaD,
                    GastosMedicosOcupantes: displayGastosMedicosOcupantes,
                    GastosMedicosOcupantesD: displayGastosMedicosOcupantesD
                });
                //}                        
                callback();
            } else if (aseguradora === 'GREAT' && displayPrimaTotal !== "null" && !isNaN(displayPrimaTotalInt) && displayDanosMateriales !== null && displayDanosMateriales !== 'undefined') {

                if (displayPrimaTotal.length == 0) {
                    displayPrimaTotal = 'No disponible';
                }

                this.comparaList.push({
                    clave: clave,
                    asegur: aseguradora,
                    img: "assets/icon/logo/asegurdoras-great.svg",
                    value: displayPrimaTotal,
                    valueInt: displayPrimaTotalInt,
                    danosMateriales: displayDanosMateriales,
                    danosMaterialesD: displayDanosMaterialesD,
                    roboTotal: displayRoboTotal,
                    roboTotalD: displayRoboTotalD,
                    RCPersonas: displayRCPersonas,
                    RCPersonasD: displayRCPersonasD,
                    RC: displayRC,
                    RCD: displayRCD,
                    DefensaJuridica: displayDefensaJuridica,
                    DefensaJuridicaD: displayDefensaJuridicaD,
                    GastosMedicosOcupantes: displayGastosMedicosOcupantes,
                    GastosMedicosOcupantesD: displayGastosMedicosOcupantesD
                });
                callback();
            } else if (aseguradora === 'HDI') {                                            

                //para la primatotal
                displayPrimaTotal = '';
                let primaHDI = data.Cotizacion.PrimaTotal;
                this.PrimaTotalHDI=data.Cotizacion.PrimaTotal
                this.PrimaNetaHDI=data.Cotizacion.PrimaNeta
                this.DerechosHDI=data.Cotizacion.Derechos
                this.ImpuestosHDI=data.Cotizacion.Impuesto
                this.RecargoHDI=data.Cotizacion.Recargos
                if (primaHDI != null && isNaN(primaHDI) == false) {
                    displayPrimaTotalInt = Math.ceil(parseInt(primaHDI));
                    displayPrimaTotal = this.formatPrice(displayPrimaTotalInt);
                }

                var danosMateriales = '',
                    roboTotal = '',
                    rcPersonas = '',
                    rc = '',
                    defensaJuridica = '',
                    gastosMedicosOcupantes = '';

                if (data.Coberturas != undefined && data.Coberturas.length) {
                    var dataCoberturas = data.Coberturas[0];
                    danosMateriales = dataCoberturas.DanosMateriales;
                    roboTotal = dataCoberturas.RoboTotal;
                    rcPersonas = dataCoberturas.RCPersonas;
                    rc = dataCoberturas.RC;
                    defensaJuridica = dataCoberturas.DefensaJuridica;
                    gastosMedicosOcupantes = dataCoberturas.GastosMedicosOcupantes;
                }

                displayDanosMateriales = (JSON.stringify(danosMateriales)).replace(/"|-N|-S|DAÑOS|MATERIALES/g, '');
                displayRoboTotal = (JSON.stringify(roboTotal)).replace(/"|-N|-S|ROBO|TOTAL/g, '');
                displayRCPersonas = (JSON.stringify(rcPersonas)).replace(/"|-N|-S|NRC|PERSONAS|RESPONSABILIDAD|CIVIL|PERSONAS|NO|APLICA|RC|-|D|-/g, '');
                displayRC = (JSON.stringify(rc)).replace(/"|-N|-S|-D|RESPONSABILIDAD|CIVIL|NO|APLICA|No|aplica/g, '');
                displayDefensaJuridica = (JSON.stringify(defensaJuridica)).replace(/"|-N|-S|-D|GASTOS|ES|ASISTENCIA|LEGAL|PROVIAL|LEGALES/g, '');
                displayGastosMedicosOcupantes = (JSON.stringify(gastosMedicosOcupantes)).replace(/"|-N|-S|-D|GASTOS|MÉDICOS|OCUPANTES/g, '');

                let displayDanosMaterialesArr = displayDanosMateriales.split('-D');
                displayDanosMaterialesD = this.formatPrice(displayDanosMaterialesArr[1]);
                displayDanosMateriales = this.formatPrice(displayDanosMaterialesArr[0]);

                //para el robo total
                let displayRoboTotalArr = displayRoboTotal.split('-D');
                displayRoboTotalD = this.formatPrice(displayRoboTotalArr[1]);
                displayRoboTotal = this.formatPrice(displayRoboTotalArr[0]);

                if (displayPrimaTotal.length == 0) {
                    displayPrimaTotal = 'No disponible';
                }

                this.comparaList.push({
                    clave: clave,
                    asegur: aseguradora,
                    img: "assets/icon/logo/asegurdoras-hdi.svg",
                    value: displayPrimaTotal,
                    valueInt: displayPrimaTotalInt,
                    danosMateriales: displayDanosMateriales,
                    danosMaterialesD: displayDanosMaterialesD,
                    roboTotal: displayRoboTotal,
                    roboTotalD: displayRoboTotalD,
                    RCPersonas: displayRCPersonas,
                    RCPersonasD: displayRCPersonasD,
                    RC: displayRC,
                    RCD: displayRCD,
                    DefensaJuridica: displayDefensaJuridica,
                    DefensaJuridicaD: displayDefensaJuridicaD,
                    GastosMedicosOcupantes: displayGastosMedicosOcupantes,
                    GastosMedicosOcupantesD: displayGastosMedicosOcupantesD
                });
                //}
                callback();
            } else if (aseguradora === 'MAPFRE' && displayPrimaTotal !== "null" && !isNaN(displayPrimaTotalInt) && displayDanosMateriales !== null && displayDanosMateriales !== 'undefined') {

                if (displayPrimaTotal.length == 0) {
                    displayPrimaTotal = 'No disponible';
                }

                this.comparaList.push({
                    clave: clave,
                    asegur: aseguradora,
                    img: "assets/icon/logo/asegurdoras-mapfre.svg",
                    value: displayPrimaTotal,
                    valueInt: displayPrimaTotalInt,
                    danosMateriales: displayDanosMateriales,
                    danosMaterialesD: displayDanosMaterialesD,
                    roboTotal: displayRoboTotal,
                    roboTotalD: displayRoboTotalD,
                    RCPersonas: displayRCPersonas,
                    RCPersonasD: displayRCPersonasD,
                    RC: displayRC,
                    RCD: displayRCD,
                    DefensaJuridica: displayDefensaJuridica,
                    DefensaJuridicaD: displayDefensaJuridicaD,
                    GastosMedicosOcupantes: displayGastosMedicosOcupantes,
                    GastosMedicosOcupantesD: displayGastosMedicosOcupantesD
                });
                callback();
            } else if (aseguradora === 'QUALITAS' && displayPrimaTotal !== "null" && !isNaN(displayPrimaTotalInt) && displayDanosMateriales !== null && displayDanosMateriales !== 'undefined') {

                if (displayPrimaTotal.length == 0) {
                    displayPrimaTotal = 'No disponible';
                }

                this.comparaList.push({
                    clave: clave,
                    asegur: aseguradora,
                    img: "assets/icon/logo/asegurdoras-qualitas.svg",
                    value: displayPrimaTotal,
                    valueInt: displayPrimaTotalInt,
                    danosMateriales: displayDanosMateriales,
                    danosMaterialesD: displayDanosMaterialesD,
                    roboTotal: displayRoboTotal,
                    roboTotalD: displayRoboTotalD,
                    RCPersonas: displayRCPersonas,
                    RCPersonasD: displayRCPersonasD,
                    RC: displayRC,
                    RCD: displayRCD,
                    DefensaJuridica: displayDefensaJuridica,
                    DefensaJuridicaD: displayDefensaJuridicaD,
                    GastosMedicosOcupantes: displayGastosMedicosOcupantes,
                    GastosMedicosOcupantesD: displayGastosMedicosOcupantesD
                });

                callback();
            } else {
                callback();
            }
        }, err => {            
            console.error(err);
            callback();
        });                
    }

    //Step 2

    emailChanged(that, email) {        
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (re.test(String(email).toLowerCase()) !== true) {
            that.showToast('Email no válido');
            that.email = null;
        } else {
            that.email = email;

            that.nombre = undefined;
            that.paterno = undefined;
            that.materno = undefined;
            that.fechaNacimiento = undefined;            
            that.telCasa = undefined;
            that.telMovil = undefined;
            that.rfc = undefined;
            that.colonia = undefined;
            that.calle = undefined;
            that.numExterior = undefined;
            that.numInterior = undefined;

            let encodedString = btoa(that.email),
                url = `http://services.bunch.guru/WebService.asmx/validarCliente?param=${encodedString}`;

            that.http.get(url).map(res => res.json()).subscribe(data => {

                let status = +data.status,
                    id = data.id;

                switch (status) {
                    case 1:
                        that.createClient = true;
                        console.log('email status 1');

                        that.isEnabled = true;
                        that.isEnabledTipo3 = true;
                        that.isEnabledTipo3Dir = true;
                        break;
                    case 2:
                        that.createClient = false;
                        console.log('email status 2');
                        
                        /*that.isEnabled = false;                            
                        that.isEnabledTipo3 = true;
                        that.isEnabledTipo3Dir = true;*/

                        that.isEnabled = true;
                        that.isEnabledTipo3 = true;
                        that.isEnabledTipo3Dir = true;

                        console.log('retrieveData A');
                        that.retrieveData();
                        break;
                    case 3:
                        that.createClient = false;
                        console.log('email status 3');
                        
                        /*that.isEnabled = false;
                        that.isEnabledTipo3 = false;*/

                        that.isEnabled = true;
                        that.isEnabledTipo3 = true;
                        that.isEnabledTipo3Dir = true;

                        encodedString = btoa(`id=${id}`);
                        url = `http://services.bunch.guru/WebService.asmx/ConsultarDirecciones?param=${encodedString}`;
                        that.http.get(url).map(res => res.json()).subscribe(data => {

                            data.direccion.forEach(function (e, i) {
                                Object.keys(e).forEach(function (key) {
                                    if (e[key] == 'undefined') {
                                        data.direccion[i][key] = '';
                                    }
                                });
                            });
                            that.userStateList = data.direccion;
                            that.userStateList.push({
                                Calle: 'Añadir nueva dirección',
                                NoExt: '',
                                NoInt: '',
                                Colonia: '',
                                CodPostal: '',
                                Poblacion: '',
                                Ciudad: '',
                                IdDir: ''
                            });

                            that.tipoTres(that.userStateList);
                        }, err => {
                            console.error({ err });
                        });
                        break;
                }
            }, err => {
                console.error({ err });
            });
        }
    }

    showAlertEmail() {

        let that = this,
            title = this.isEnglish ? 'Input your email' : 'Email',
            options = [{ name: 'email', type: 'email', id: 'email', value: this.email }];

        this.showAlert(title, options, function (data) {

            let email = data.email;
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (re.test(String(email).toLowerCase()) !== true) {
                that.showToast('Email no válido');
                that.email = null;
            } else {
                that.email = data.email;

                that.nombre = undefined;
                that.paterno = undefined;
                that.materno = undefined;
                that.fechaNacimiento = undefined;
                that.telCasa = undefined;
                that.telMovil = undefined;
                that.rfc = undefined;
                that.colonia = undefined;
                that.calle = undefined;
                that.numExterior = undefined;
                that.numInterior = undefined;

                let encodedString = btoa(that.email),
                    url = `http://services.bunch.guru/WebService.asmx/validarCliente?param=${encodedString}`;

                that.http.get(url).map(res => res.json()).subscribe(data => {

                    let status = +data.status,
                        id = data.id;

                    switch (status) {
                        case 1:
                            that.createClient = true;
                            console.log('email status 1');

                            that.isEnabled = true;
                            that.isEnabledTipo3 = true;
                            that.isEnabledTipo3Dir = true;
                            break;
                        case 2:
                            that.createClient = false;
                            console.log('email status 2');
                            
                            /*that.isEnabled = false;                            
                            that.isEnabledTipo3 = true;
                            that.isEnabledTipo3Dir = true;*/

                            that.isEnabled = true;
                            that.isEnabledTipo3 = true;
                            that.isEnabledTipo3Dir = true;

                            console.log('retrieveData A');
                            that.retrieveData();
                            break;
                        case 3:
                            that.createClient = false;
                            console.log('email status 3');
                            
                            /*that.isEnabled = false;
                            that.isEnabledTipo3 = false;*/

                            that.isEnabled = true;
                            that.isEnabledTipo3 = true;
                            that.isEnabledTipo3Dir = true;

                            encodedString = btoa(`id=${id}`);
                            url = `http://services.bunch.guru/WebService.asmx/ConsultarDirecciones?param=${encodedString}`;
                            that.http.get(url).map(res => res.json()).subscribe(data => {

                                data.direccion.forEach(function (e, i) {
                                    Object.keys(e).forEach(function (key) {
                                        if (e[key] == 'undefined') {
                                            data.direccion[i][key] = '';
                                        }
                                    });
                                });
                                that.userStateList = data.direccion;
                                that.userStateList.push({
                                    Calle: 'Añadir nueva dirección',
                                    NoExt: '',
                                    NoInt: '',
                                    Colonia: '',
                                    CodPostal: '',
                                    Poblacion: '',
                                    Ciudad: '',
                                    IdDir: ''
                                });

                                that.tipoTres(that.userStateList);
                            }, err => {
                                console.error({ err });
                            });
                            break;
                    }
                }, err => {
                    console.error({ err });
                });
            }            
        });
    }

    nombreChanged(that, nombre) {    
        if (nombre != null) {
            nombre = nombre.trim().toUpperCase();            
            //nombre = that.quitaAcentos(nombre);            
            //if (nombre.length > 0 && that.validName(nombre)) {
            if (nombre.length > 0) {
                that.nombre = nombre;                    
                //document.getElementById('nombre').getElementsByTagName('input')[0].value = that.nombre;
                that.calcRFCYTitular();
            } else {
                that.nombre = null;
                that.rfc = undefined;
            }
        } else {
            that.rfc = undefined;
        }
    }

    calcRFCYTitular() {
        console.log('calcRFCYTitular');
        let that = this;
        if (that.nombre !== undefined && 
            that.paterno !== undefined && 
            that.materno !== undefined && 
            that.fechaNacimiento !== undefined &&
            that.nombre !== null && 
            that.paterno !== null && 
            that.materno !== null && 
            that.fechaNacimiento !== null) {
            console.log('dentro del IF');
            that.generarRFC();
            that.calcHC();
            document.getElementById('rfc').getElementsByTagName('input')[0].value = that.rfc;            
            that.titular = `${that.nombre} ${that.paterno} ${that.materno}`.toUpperCase();
        }
    }

    paternoChanged(that, paterno) {
        if (paterno != null) {
            paterno = paterno.trim().toUpperCase();
            //paterno = that.quitaAcentos(paterno);
            //if (paterno.length > 0 && that.validLastName(paterno)) {
            if (paterno.length > 0) {
                that.paterno = paterno;    
                document.getElementById('paterno').getElementsByTagName('input')[0].value = that.paterno;
                that.calcRFCYTitular();
            } else {
                that.paterno = null;
                that.rfc = undefined;
            }
        } else {
            that.rfc = undefined;
        }
    }    

    toUpperCase(elem) {
        let input = document.getElementById(elem).getElementsByTagName('input')[0];
        this[elem] = input.value.toUpperCase();
        input.value = this[elem];
    }

    toLowerCase(elem) {
        let input = document.getElementById(elem).getElementsByTagName('input')[0];
        this[elem] = input.value.toLowerCase();
        input.value = this[elem];
    }

    maternoChanged(that, materno) {
        if (materno != null) {
            materno = materno.trim().toUpperCase();
            //materno = that.quitaAcentos(materno);
            //if (materno.length > 0 && that.validLastName(materno)) {
            if (materno.length > 0) {
                that.materno = materno;          
                document.getElementById('materno').getElementsByTagName('input')[0].value = that.materno;          
                that.calcRFCYTitular();
            } else {
                that.materno = null;
                that.rfc = undefined;
            }
        } else {
            that.rfc = undefined;
        }        
    }

    fechaNacimientoChanged() { 
        setTimeout(function() {
            let elem = document.getElementsByClassName('datetime-text')[0];        
            elem.innerHTML = elem.innerHTML.toUpperCase();
        }, 300);               
        this.calcRFCYTitular();
    }

    showAlertGenero() {
        if (this.isEnabled == true) {            
            this.bottomAlert('genero', this.userGenderList);
        }
    }

    showAlertTitular() {

        let title = this.isEnglish ? 'Name of the owner' : 'Titular',
            that = this,
            options = [{ name: 'titular', id: 'titular', value: this.titular }];

        this.showAlert(title, options, function (data) {
            let titular = data.titular.trim().toUpperCase();
            if (titular.length == 0) {
                that.titular = null;
            } else {
                that.titular = titular;
            }
        });
    }

    telCasaChanged(that, telCasa) {
        if (telCasa != null) {
            telCasa = telCasa.trim();
            if (telCasa.length >= 10) {
                that.telCasa = telCasa;
            } else {
                that.telCasa = null;                    
                that.showToast('Teléfono de Casa inválido');
            }
        }
    }

    telMovilChanged(that, telMovil) {
        if (telMovil != null) {
            telMovil = telMovil.trim();
            if (telMovil.length >= 10) {
                that.telMovil = telMovil;
            } else {                
                that.telMovil = null;    
                that.showToast('Teléfono Móvil inválido');
            }
        }        
    }

    rfcChanged(that, rfc) {    
        if (rfc != null) {
            rfc = rfc.trim().toUpperCase();
            if (rfc.length == 0) {
                that.rfc = null;
            } else {

                var date = that.fechaNacimiento;
                var anio = date.substr(2, 2);
                var mes = date.substr(5, 2);
                var dia = date.substr(8, 2);      
                console.warn('A', rfc.substr(4,6), 'B', anio + mes + dia);
                if (rfc.substr(4,6) === anio + mes + dia) {
                    that.rfc = rfc;
                } else {                    
                    console.warn('regenerar rfc y titular');
                    that.rfc = undefined;
                    that.calcRFCYTitular();
                }
            }
        }        
    }

    showAlertRFC(value, mode, modelList = [], massage = "") {
        if (this.isEnabledTipo3 == true) {

            let title = this.isEnglish ? 'Choose your ID' : 'RFC',
                that = this,
                options = [{
                    name: 'rfc',
                    id: 'rfc',
                    value: this.rfc,
                }];

            this.showAlert(title, options, function (data) {
                let rfc = data.rfc.trim().toUpperCase();
                if (rfc.length == 0) {
                    that.rfc = null;
                } else {
                    that.rfc = rfc;
                }
            });
        }
    }

    tipoTres(valor) {
        let that = this;        
        var testRadioResult = "";
        var cont = 0;
        var contFinal = 1;
        let alert = this.alertCtrl.create();
        alert.setTitle('Selecciona la dirección deseada');
        alert.setCssClass('definidaY');
        for (let key of valor) {
            alert.addInput({
                type: 'radio',
                id: 'hola',
                //label: contFinal + ' CALLE:' + valor[cont].Calle + ' NO EXT:' + valor[cont].NoExt + ' NO INT:' + valor[cont].NoInt + ' COLONIA:' + valor[cont].Colonia + ' CÓDIGO POSTAL:' + valor[cont].CodPostal + ' POBLACIÓN:' + valor[cont].Poblacion + ' CIUDAD:' + valor[cont].Ciudad + ' ',
                //value: contFinal + ' CALLE:' + valor[cont].Calle + ' NO EXT:' + valor[cont].NoExt + ' NO INT:' + valor[cont].NoInt + ' COLONIA:' + valor[cont].Colonia + ' CÓDIGO POSTAL:' + valor[cont].CodPostal + ' POBLACIÓN:' + valor[cont].Poblacion + ' CIUDAD:' + valor[cont].Ciudad + ' ',
                label: contFinal + ' CALLE:' + key.Calle + ' NO EXT:' + key.NoExt + ' NO INT:' + key.NoInt + ' COLONIA:' + key.Colonia + ' CÓDIGO POSTAL:' + key.CodPostal + ' POBLACIÓN:' + key.Poblacion + ' CIUDAD:' + key.Ciudad + ' ',
                value: contFinal + ' CALLE:' + key.Calle + ' NO EXT:' + key.NoExt + ' NO INT:' + key.NoInt + ' COLONIA:' + key.Colonia + ' CÓDIGO POSTAL:' + key.CodPostal + ' POBLACIÓN:' + key.Poblacion + ' CIUDAD:' + key.Ciudad + ' ',
            });
            cont++;
            contFinal++;
            if (cont === (valor.length - 1)) {
                alert.addInput({
                    type: 'radio',
                    id: 'hola',
                    label: 'Añadir nueva dirección',
                    value: 'Añadir nueva dirección',
                });
                break;
            }
        }
        alert.addButton('Cancelar');
        alert.addButton({
            text: 'OK',
            handler: data => {                
                testRadioResult = data;
                if (testRadioResult === 'Añadir nueva dirección') {
                    that.createClient = true;                    
                    this.isEnabledTipo3Dir = true;
                    this.isEnabled = false;
                    this.isEnabledTipo3 = false;
                    console.log('retrieveData B');
                    this.retrieveData();
                } else {
                    
                    //this.isEnabledTipo3Dir = false;
                    //this.isEnabledTipo3 = false;
                    
                    var splitStr = testRadioResult.split(/\s+/);
                    var seleccion = splitStr[0];
                    var seleccionNum = (parseInt(seleccion)) - 1;

                    let obj = valor[seleccionNum];                    
                    that.calle = obj.Calle;
                    that.numExterior = obj.NoExt;

                    let numInterior = obj.NoInt.trim();
                    that.numInterior = (numInterior.length == 0) ? undefined : numInterior;

                    that.colonia = obj.Colonia;
                    that.codigoPostal1 = obj.CodPostal;
                    that.delegacion = obj.Poblacion;
                    that.estado = obj.Ciudad;
                    
                    console.log('retrieveData C');
                    that.retrieveData();
                }
            }
        });
        alert.present();
    }    

    //'numInput', userPostalCode, [], 
    /*showAlertCodigoPostal() {
        if (this.isEnabledTipo3Dir == true) {

            let title = this.isEnglish ? 'Input postal code' : 'Código Postal',
                that = this,
                options = [
                    {
                        type: 'number',
                        name: 'codigoPostal2',
                        id: 'codigoPostal2',
                        value: this.codigoPostal2,
                    }
                ];

            this.showAlert(title, options, function(data) {
                let codigoPostal2 = data.codigoPostal2,
                    url = 'http://services.bunch.guru/WebService.asmx/ConsultaCP?CPostal=' + codigoPostal2;
                that.userColonyList = [];
                that.http.get(url).map(res => res.json()).subscribe(data => {
                    that.delegacion = data.Municipio;
                    that.estado = data.Estado;
                    for (let i = 0, len = data.Colonias.length; i < len; i++){
                        that.userColonyList.push(data.Colonias[i].Colonia);
                    }
                    that.codigoPostal2 = codigoPostal2;
                }, err => {                            
                    console.error({err});                            
                });
            });            
        }
    }*/

    showAlertLugarDeNacimiento() {
        if (this.isEnabledTipo3 == true) {

            let title = this.isEnglish ? 'Choose your place of birth' : 'Lugar de nacimiento',
                that = this,
                options = [
                    {
                        name: 'lugarNacimiento',
                        id: 'lugarNacimiento',
                        value: this.lugarNacimiento,
                    }
                ];

            this.showAlert(title, options, function (data) {
                that.lugarNacimiento = data.lugarNacimiento;
            });
        }
    }

    showAlertCvv() {

        let title = this.isEnglish ? 'Input the CVV' : 'CVV',
            that = this,
            options = [
                {
                    type: 'number',
                    name: 'cvv',
                    id: 'cvv',
                    value: this.cvv,
                    min: 3,
                    max: 4 //amex tiene casos de 4 digitos
                }
            ];

        this.showAlert(title, options, function (data) {
            let cvv = data.cvv.trim();
            if (cvv.length == 0) {
                that.cvv = null;
            } else {
                that.cvv = cvv;
            }            
        });
    }

    numSerieChanged(that, numSerie) {
        numSerie = numSerie.trim().toUpperCase();
        that.numSerie = (numSerie.length == 0) ? null : numSerie;        

        if (that.numSerie !== null) {
            let loader = that.loadingCtrl.create();
            loader.present();
            that.http.get(`http://services.bunch.guru/WebService.asmx/validarNoSerie?serie=${that.numSerie}&modelo=${that.modelo}`).map(res => res).subscribe(data => {            
                loader.dismiss();

                if (data['_body'] === 'True') {
                    that.numSerie = numSerie.toUpperCase();
                } else {                    
                    that.numSerie = null;
                    that.showToast('Número de serie inválido');
                }                
            }, err => {
                that.numSerie = null;
                loader.dismiss();                                
            });
        }        
    }

    showAlertNumeroDeSerie() {

        let title = this.isEnglish ? 'Input serial number' : 'Número de serie',
            that = this,
            options = [{ name: 'numSerie', value: this.numSerie, max: 17 }];

        this.showAlert(title, options, function (data) {

            let loader = that.loadingCtrl.create();
            loader.present();

            let numSerie = data.numSerie;
            that.numSerie = numSerie.toUpperCase();

            /*that.http.get(`http://services.bunch.guru/WebService.asmx/validarNoSerie?serie=${numSerie}&modelo=${that.modelo}`).map(res => res).subscribe(data => {

                console.log({ data });
                loader.dismiss();

                if (data['_body'] === 'True') {
                    that.numSerie = numSerie.toUpperCase();
                } else {                    
                    that.showToast('Número de serie inválido');                    
                    that.showAlertNumeroDeSerie();
                }                
            }, err => {
                that.numSerie = undefined;
                loader.dismiss();                
                console.error({ err });
            });*/
            loader.dismiss();                
        });
    }

    numPlacasChanged(that, numPlacas) {        
        if (numPlacas.length >= 6) {
            that.numPlacas = numPlacas.toUpperCase();
        } else {            
            that.showToast('Placas no válidas');
        }
    }

    showAlertNumeroDePlacas() {

        let title = this.isEnglish ? 'Input plate' : 'Número de placa',
            that = this,
            options = [{
                name: 'numPlacas',
                id: 'numPlacas',
                value: this.numPlacas,
                min: 6,
            }];

        this.showAlert(title, options, function (data) {
            let numPlacas = data.numPlacas;
            if (numPlacas.length >= 6) {
                that.numPlacas = data.numPlacas.toUpperCase();
            } else {
                that.showToast('Placas no válidas');                
                that.showAlertNumeroDePlacas();
            }
        });
    }

    numMotorChanged(that, numMotor) {

        if (numMotor.length >= 7) {
            that.numMotor = numMotor.toUpperCase();
        } else {
            that.showToast('Número de motor inválido');
        }
    }

    showAlertNumeroDeMotor() {

        let title = this.isEnglish ? 'Input motor number' : 'Número del motor',
            that = this,
            options = [{
                name: 'numMotor',
                id: 'numMotor',
                value: this.numMotor,
                min: 7,
            }];

        this.showAlert(title, options, function (data) {
            let numMotor = data.numMotor;
            if (numMotor.length >= 7) {
                that.numMotor = numMotor.toUpperCase();
            } else {
                that.showToast('Número de motor inválido');                
                that.showAlertNumeroDeSerie();
            }
        });
    }

    calleChanged(that, calle) {
        calle = calle.trim().toUpperCase();
        if (calle.length == 0) {
            that.calle = null;
        } else {
            that.calle = calle;
        }
    }

    showAlertCalle() {
        if (this.isEnabledTipo3Dir == true) {

            let title = this.isEnglish ? 'Input street name' : 'Calle',
                options = [
                    {
                        //type: 'number',   
                        name: 'calle',
                        id: 'calle',
                        value: this.calle,
                    }
                ],
                that = this;

            this.showAlert(title, options, function (data) {
                that.calle = data.calle.toUpperCase();
            });
        }
    }
    showAlertNoExt() {

        if (this.isEnabledTipo3Dir == true) {

            let title = this.isEnglish ? 'Input exterior number' : 'Número exterior',
                that = this,
                options = [
                    {
                        name: 'numExterior',
                        id: 'numExterior',
                        value: this.numExterior,
                    }
                ];

            this.showAlert(title, options, function (data) {
                that.numExterior = data.numExterior;
            });
        }
    }
    showAlertNoInt() {
        if (this.isEnabledTipo3Dir == true) {

            let title = this.isEnglish ? 'Input interior number' : 'Número interior',
                that = this,
                options = [
                    {
                        name: 'numInterior',
                        id: 'numInterior',
                        value: this.numInterior,
                    }
                ];

            this.showAlert(title, options, function (data) {
                let numInterior = data.numInterior.trim();                
                that.numInterior = (numInterior.length == 0) ? null : numInterior;
            });
        }
    }

    showAlertTarjeta() {

        let title = this.isEnglish ? 'Input your credit card number' : 'Número de tarjeta',
            that = this,
            options = [
                {
                    type: 'number',
                    name: 'numTarjeta',
                    id: 'numTarjeta',
                    value: this.numTarjeta,
                }
            ];

        this.showAlert(title, options, function(data) {
            let numTarjeta = data.numTarjeta.trim();
            if (numTarjeta.length == 0) {
                that.numTarjeta = null;
            } else {
                that.getCardInfo(numTarjeta);
            }            
        });
    }    

    private getCardInfo(numTarjeta:string) {
        let that = this,
            loader = that.loadingCtrl.create();
            loader.present();

        let scheme,
            type,
            bank;

        that.numTarjeta = numTarjeta;            

        that.http.get('https://lookup.binlist.net/' + numTarjeta).map(res => res.json()).subscribe(data => {            

            scheme = data.scheme.toUpperCase();
            type = data.type;
            bank = data.bank.name;
            if (bank == undefined) {                
                that.resetCarriers();
                that.carrierCot = undefined;
                that.tipoCot = undefined;
                that.banco = undefined;
                that.tipoTarjeta = undefined;
                loader.dismiss();
                //that.showToast('No se pudo validar el banco');                    
            } else {

                bank = bank.trim();
                if (bank.length == 0) {
                    loader.dismiss();
                    return;
                }

                //Para quitar caracteres especiales al banco y dejarlo en minus, pero con la primera letra en mayus                
                bank = bank.toLowerCase();
                bank = bank.charAt(0).toUpperCase() + bank.slice(1).toLowerCase();

                let BANK = bank.toUpperCase(),
                    found = false;
                
                for (let i = 0, len = that.bancoList.length; i < len; i++) {
                    if (that.bancoList[i] == BANK) {
                        found = true;
                        break;
                    }
                }

                if (found == true) {
                    if (scheme === 'MASTERCARD') {                        
                        that.master();
                    } else if (scheme === 'AMEX') {                        
                        that.amex();
                    } else if (scheme === 'VISA') {                        
                        that.visa();
                    }
    
                    //conversion a espanol lo que devuelve el ws
                    if (type === 'CREDIT') {
                        type = 'CREDITO';
                        that.tipoCot = 'CREDITO';
                    } else {
                        type = 'DEBITO';
                        that.tipoCot = 'DEBITO';
                    }
    
                    that.tipoTarjeta = type;                
                    that.banco = bank;
                    loader.dismiss();
                } else {                    
                    loader.dismiss();
                    loader.onDidDismiss(() => {
                        that.showAlert(`La aseguradora ${that.cotizacion.aseguradora} no acepta pagos del banco ${bank}`);
                    });                                
                }
            }
        }, err => {
            that.resetCarriers();
            that.carrierCot = undefined;
            that.tipoCot = undefined;
            that.banco = undefined;
            that.tipoTarjeta = undefined;
            loader.dismiss();
            //console.error({ err });
            //that.showToast('No se pudo validar el banco');                
        });
    }

    showAlertPrima(value, valor, mode, modelList = [], massage = "") {
        //this.alertSrv.showAlert(value, mode, modelList, massage);        
        let alert = this.alertCtrl.create();
        alert.setCssClass('definida');

        alert.setTitle('<center>' + valor.asegur + '</center>');
        alert.setMessage(
            '<table class="tablaModal">' +
            '<tr>' +
            '  <td>' +
            '  <img src="' + valor.img + '">' +
            '  </td>' +
            '  <td>' +
            '    <table class="tablaModal">' +
            '   <tr>' +
            '<th class="tabla-modal-title">Cobertura</th>' +
            '<th class="tabla-modal-title">Periodicidad</th>' +
            '</tr>' +
            '<tr>' +
            '<td>Amplia</td>' +
            '<td>Anual</td>' +
            '</tr>' +
            '</table>' +
            '</td>' +
            '</tr>' +
            ' </table>' +

            '<table>' +
            '<tr><th></th><th class="sumaAseguradaHeader"><strong>Suma Asegurada</strong></th>' +
            '<th><strong>Deducible</strong></th></tr>' +
            '<tr><td><strong>Prima total</strong></str><td><center><strong>' + valor.value + '</strong></center></td><td><center><strong>' + '</strong></center></td></tr>' +
            '<tr><td><strong>Daños MATERIALES</strong><td><center><strong>' + valor.danosMateriales + '</strong></center></td><td><center><strong>' + valor.danosMaterialesD + '</strong></center></td></tr>' +
            '<tr><td><strong>Robo Total</strong><td><center><strong>' + valor.roboTotal + '</strong></center></td><td><center><strong>' + valor.roboTotalD + '</strong></center></td></tr>' +
            '<tr><td><strong>RC Personas</strong><td><center><strong>' + valor.RCPersonas + '</strong></center></td><td><center><strong>' + valor.RCPersonasD + '</strong></center></td></tr>' +
            '<tr><td><strong>RC</strong><td><center><strong>' + valor.RC + '</strong></center></td><td><center><strong>' + valor.RCD + '</strong></center></td></tr>' +
            '<tr><td><strong>Def. Jurídica</strong><td><center><strong>' + valor.DefensaJuridica + '</strong></center></td><td><center><strong>'/*+valor.defensaJuridicaD*/ + '-</strong></center></td></tr>' +
            '<tr><td><strong>Gastos Médicos Oc.</strong><td><center><strong>' + valor.GastosMedicosOcupantes + '<strong></center></td><td><center><strong>'/*+valor.GastosMedicosOcupantesD*/ + '-</strong></center></td></tr>' +
            '</table>' +
            '<hr>'
        );

        alert.addButton({
            text: 'Regresar',
            cssClass: 'alert-cancel-btn',
        });
        alert.addButton({
            text: 'Contratar',
            handler: data => {                          

                //this.edad = data;
                document.getElementById("marcaF").innerHTML = valor.asegur;
                document.getElementById("primaF").innerHTML = valor.value;
                this.aseguradoraCot = valor.asegur;
                this.claveCot = valor.clave;
                var myAnchor = document.getElementById("imgF");
                var mySpan = document.createElement("IMG");
                mySpan.setAttribute("src", valor.img);
                mySpan.setAttribute("id", "imgF");
                mySpan.setAttribute("width", "40");
                mySpan.setAttribute("height", "40");
                mySpan.setAttribute("margin-left", "-40");
                myAnchor.parentNode.replaceChild(mySpan, myAnchor);
                this.pagoList[0].subText = (valor.danosMateriales).replace(/"|-N|-S|-D|DAÑOS|MATERIALES/g, '');
                this.pagoList[1].subText = (valor.roboTotal).replace(/"|-N|-S|-D|ROBO|TOTAL/g, '');
                this.pagoList[2].subText = (valor.RCPersonas).replace(/"|-N|-S|-D|NRC|PERSONAS|RC/g, '');
                this.pagoList[3].subText = (valor.RC).replace(/"|-N|-S|-D|RESPONSABILIDAD|CIVIL/g, '');
                this.pagoList[4].subText = (valor.DefensaJuridica).replace(/"|-N|-S|-D|GASTOS|LEGALES/g, '');
                this.pagoList[5].subText = (valor.GastosMedicosOcupantes).replace(/"|GASTOS|MEDICOS/g, '');
                //this.changeTab('Cliente');
            }
        });
        alert.present();
    }

    //datePickerNames: any;
    private pagoList = [
        {
            mainText: localStorage.getItem("language") == "en" ? "Material damage:" : "Daños materiales: ",
            subText: localStorage.getItem("language") == "en" ? "5% V. trade" : "5% V. comercial"
        },
        {
            mainText: localStorage.getItem("language") == "en" ? "Total theft:" : "Robo Total: ",
            subText: localStorage.getItem("language") == "en" ? "10% V. commerce" : "10% V. comercial"
        },
        {
            mainText: localStorage.getItem("language") == "en" ? "RC people:" : "RC personas: ",
            subText: localStorage.getItem("language") == "en" ? "3,000,000.0" : "3,000,000.00"
        },
        {
            mainText: localStorage.getItem("language") == "en" ? "RC:" : "RC: ",
            subText: localStorage.getItem("language") == "en" ? "800,000.0" : "800,000.00"
        },
        {
            mainText: localStorage.getItem("language") == "en" ? "Legal defense:" : "Defensa legal: ",
            subText: localStorage.getItem("language") == "en" ? "AMPARAD" : "AMPARADA"
        },
        {
            mainText: localStorage.getItem("language") == "en" ? "Medical expenses:" : "Gastos médicos OC: ",
            subText: localStorage.getItem("language") == "en" ? "50.000.0" : "50,000.00"
        },
    ];
    private prevPage: any;
          
    private userGenderList = ['MASCULINO', 'FEMENINO'];    
    private userColonyList = [];    
    private userStateList = [];    
    private edadList = [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70];    
    
    minYear = new Date().getFullYear() - 18;
    maxYear = new Date().getFullYear() - 18; 

    retrieveData(callback: any = undefined) {
        let encodedString = btoa(this.email);

        this.http.get(`http://services.bunch.guru/WebService.asmx/ConsultaDatosCli?param=${encodedString}`).map(res => res.json()).subscribe(data => {
            console.log('retrieveData data', data);

            this.nombre = data.Nombre;
            this.paterno = data.ApellidoPat;
            this.materno = data.ApellidoMat;
            this.titular = `${this.nombre} ${this.paterno} ${this.materno}`.toUpperCase();

            //data.FechaNacimiento viene en formato: "9/30/1988 12:00:00 AM" y hay que ponerlo en formato: YYYY-MM-DD
            //por lo que realizamos esto:
            let fechaNacimiento = data.FechaNacimiento.trim();
            if (fechaNacimiento.length > 0) {
                let fechaNacimientoArr = fechaNacimiento.split('/');
                let fechaNacimientoDia = fechaNacimientoArr[1];
                if (+fechaNacimientoDia <= 9) {
                    fechaNacimientoDia = '0' + fechaNacimientoDia;
                }
                let fechaNacimientoMes = fechaNacimientoArr[0];
                if (+fechaNacimientoMes <= 9) {
                    fechaNacimientoMes = '0' + fechaNacimientoMes;
                }
                let fechaNacimientoAnio = fechaNacimientoArr[2].substring(0, 4);
                this.fechaNacimiento = `${fechaNacimientoAnio}-${fechaNacimientoMes}-${fechaNacimientoDia}`;
            }            

            this.genero = data.Genero;
            this.telCasa = data.Telefono.split('|')[1];
            this.telMovil = data.Telefono2.split('|')[1];
            this.idContCot=data.IdCont
            this.idCliCot=data.IdCli
            this.idDirCot=data.IdDir
            if (data.RFC == undefined || data.RFC == null || data.RFC.trim().length == 0) {
                this.calcRFCYTitular();                
            } else {
                this.rfc = data.RFC;
            }            
            //this.colonia = data.Direccion.Colonia;
            //this.calle = data.Direccion.Calle;
            //this.numExterior = data.Direccion.NoExt;
            //this.numInterior = data.Direccion.NoInt;

            if (callback != undefined) {
                callback(data);
            }
        }, err => {
            console.error({ err });
        });
    }    

    crearCliente(success:any, error:any) {        

        if (this.createClient == false) {
            success(); //no necesitaba crearcliente pero llamo a success
            return;
        }        
        
        let numInterior = (this.numInterior === null || this.numInterior === undefined) ? '' : this.numInterior;
        this.genero = this.genero.toUpperCase();
        this.calcRFCYTitular();

        let string = 'nombre=' + this.nombre + '&app=' + this.paterno + '&apm=' + this.materno + '&genero=' + this.genero + '&edad=' + this.edad + '&email=' + this.email + '&telefono=' + this.telMovil + '&RFC=' + this.rfc + '&nacionalidad=MEXICANA&lugNacimiento=' + this.lugarNacimiento + '&cp=' + this.codigoPostal2 + '&calle=' + this.calle + '&noExt=' + this.numExterior + '&noInt=' + numInterior + '&colonia=' + this.colonia + '&delegacion=' + this.delegacion + '&estado=' + this.estado + '&telefono2=' + this.telCasa + '&fechaNac=' + this.fechaNacimiento + '&idContVend=' + this.idContVend,
            encodedString = btoa(string),
            url = `http://services.bunch.guru/WebService.asmx/CrearCliente?param=${encodedString}`;

        this.http.get(url).map(res => res.json()).subscribe(data => {
            this.idCliCot = data.idCli;
            this.idDirCot = data.idDir;
            this.idContCot = data.idCont;            
            //this.loadInputData('inputBank');
            if (success != undefined) {
                success();
            }            
        }, err => {            
            //console.error({ err });
            //alert('Error al crear usuario');
            //this.loadInputData('inputBank');

            if (error != undefined) {
                error();
            }
        });        

    }
    ionViewDidEnter() {

        if (localStorage.getItem("isClient") == "true") {
            setTimeout(() => {
                if (document.getElementById("tab-t0-5") && document.getElementById("tab-t0-4")) {
                    document.getElementById("tab-t0-4").setAttribute("aria-selected", "true");
                    document.getElementById("tab-t0-5").setAttribute("aria-selected", "false");
                }
            }, 50);
        }
        if (localStorage.getItem("isFirstEnterToHomeScreeb") == "true") {
            //this.navCtrl.push(ProductsPage, null, { animate: false });
        }
    }
    ionViewWillLeave() {
        if (document.getElementById("tab-t0-5") && document.getElementById("tab-t0-4")) {
            document.getElementById("tab-t0-4").setAttribute("aria-selected", "false");
            document.getElementById("tab-t0-5").setAttribute("aria-selected", "false");
        }
    }
    validateTab(step: number): boolean {


        if (step == 1) {
            if (this.edad == undefined || this.marca == undefined || this.modelo == undefined || this.subMarca == undefined || this.descripcion == undefined || this.subDescripcion == undefined) {
                return false;
            }
        } else if (step == 3) {

            let data = {
                'email': this.email,
                'nombre': this.nombre,
                'paterno': this.paterno,
                'materno': this.materno,
                'fechaNacimiento': this.fechaNacimiento,
                'genero': this.genero,
                'telCasa': this.telCasa,
                'telMovil': this.telMovil,
                'rfc': this.rfc,
                'nacionalidad': 'MEXICANA', //this.nacionalidad,
                'lugarNacimiento': '', //this.lugarNacimiento,
                'codigoPostal2': this.codigoPostal2,
                'colonia': this.colonia,
                'estado': this.estado,
                'delegacion': this.delegacion,
                'calle': this.calle,
                'numExterior': this.numExterior,
                'numMotor': this.numMotor,
                'numSerie': this.numSerie,
                'numPlacas': this.numPlacas,
            };

            let fieldsWithError = [];
            Object.keys(data).forEach(function (e) {
                if (data[e] == undefined) {
                    fieldsWithError.push(e);
                }
            });

            console.error({ fieldsWithError });

            if (fieldsWithError.length > 0) {
                return false;
            }
        } else if (step == 5) {

            this.aceptoCobros = undefined
            if (document.getElementById('aceptoCobros')['checked']) {
                this.aceptoCobros = true;
            }

            let data = {
                'numTarjeta': this.numTarjeta,
                'tipoTarjeta': this.tipoTarjeta,
                'titular': this.titular,
                'banco': this.banco,
                'vigencia': this.vigencia,
                'cvv': this.cvv,
                'aceptoCobros': this.aceptoCobros,
            };

            let fieldsWithError = [];
            Object.keys(data).forEach(function (e) {
                if (data[e] == undefined) {
                    fieldsWithError.push(e);
                }
            });

            console.error({ fieldsWithError });

            if (fieldsWithError.length > 0) {
                return false;
            }
        } else {
            let form = document.getElementById(`step${step}`);

            if (form == null) {
                return false;
            }

            let inputs = form.getElementsByClassName('input'),
                inputsLen = inputs.length;

            if (inputsLen == 0) {

                return false;
            }

            for (let i = 0; i < inputsLen; i++) {
                let className = inputs[i].className;
                if (className.indexOf('required') !== -1 && className.indexOf('dirty') === -1) {
                    console.log('id con problem', inputs[i].id);
                    return false;
                }
            }
        }

        return true;
    }

    /*//changeTab(tabName, tabFrom = '') {        
    changeTab(tabName, validateTab: boolean = true) {

        let errors = false,
            stepsElem = document.getElementById('steps'),
            _this = this;

        switch (tabName) {
            case 'Producto':
                stepsElem.innerHTML = "Paso 1 de 5";
                break;
            case 'Compara':
                if (validateTab == true) {
                    this.calcRFCYTitular();
                    errors = !_this.validateTab(1);
                    if (errors == false) {
                        //_this.getBuscar();
                    }
                }
                stepsElem.innerHTML = "Paso 2 de 5";
                break;
            case 'Cliente':
                stepsElem.innerHTML = "Paso 3 de 5";
                break;
            case 'Pago':
                if (validateTab == true) {
                    errors = !_this.validateTab(3);
                    if (errors == false) {
                        _this.crearCliente();
                    }
                }
                stepsElem.innerHTML = "Paso 4 de 5";
                break;
            case 'Tarjeta':
                stepsElem.innerHTML = "Paso 5 de 5";
                //_this.crearCliente();
                break;
        }

        if (errors == false) {
            tabName == 'Pago' ? this.underTabsTitile = localStorage.getItem("language") == "en" ? 'Summary' : 'Resumen' : this.underTabsTitile = localStorage.getItem("language") == "en" ? 'Car insurance' : 'Seguro de Auto';
            //tabFrom == 'Cliente' ? this.showProductoContinuarShown() : '';
            this.topTab = tabName;
            this.comparaDetailShown = false;
            this.content.scrollToTop();
            this.currentTab = tabName;
        } else {
            _this.showToast('Faltan campos por completar');            
        }
    }*/

    compartirOrdenDeCompra() {
        if (this.urlEmisionDocumento != undefined) {
            this.socialSharing.share('Órden de Compra', '', undefined, this.urlEmisionDocumento);
        }
    }
    
    /*showProductoContinuarShown() {
        this.productoContinuarShown = true;
    }
    showComparaItemDetail() {
        this.comparaDetailShown = true;
    }*/

    //para mandar el pago
    pay() {

        let loader = this.loadingCtrl.create(),
            that = this;

        loader.present();        

        let checkboxChecked = document.getElementById('aceptoCobros')['checked'];            

        if (this.validVars(['numTarjeta', 'titular', 'cvv', 'vigencia', 'carrierCot', 'tipoCot', 'banco', 'tipoTarjeta']) == false || checkboxChecked == false) {
            loader.dismiss();
            loader.onDidDismiss(() => {
                that.showToast('Falta completar los campos');
            });            
            return;
        }

        //para las fechas de la vigencia            
        let vigencia = this.vigencia.split('-');
        this.anioCot = vigencia[0];
        this.mesCot = vigencia[1];
        localStorage.Aseguradora=this.aseguradoraCot
		let consultaData				
        //checkpoint
        this.aseguradoraCot = this.cotizacion.aseguradora;
        this.claveCot = this.cotizacion.clave;
        let numInterior = (this.numInterior == undefined) ? null : this.numInterior;
        if (this.aseguradoraCot=="HDI"){
            consultaData = {
                Aseguradora: this.aseguradoraCot,
                Cliente: {
                    TipoPersona: 'F',
                    Nombre: this.nombre,
                    ApellidoPat: this.paterno,
                    ApellidoMat: this.materno,
                    RFC: this.rfc,
                    FechaNacimiento: this.fechaNacimiento,
                    Ocupacion: 'EMPLEADO',
                    CURP: null,
                    Direccion: {
                        Calle: this.calle,
                        NoExt: this.numExterior,
                        NoInt: numInterior,
                        Colonia: this.colonia,
                        CodPostal: this.codigoPostal2,
                        Poblacion: this.delegacion,
                        Ciudad: this.estado,
                        Pais: 'MÉXICO'
                    },
                    Edad: this.edad,
                    Genero: this.genero,
                    Telefono: this.telCasa,
                    Email: this.email
                },
                Vehiculo: {
                    Uso: 'PARTICULAR',
                    Marca: this.marca,
                    Modelo: this.modelo,
                    NoMotor: this.numMotor,
                    NoSerie: this.numSerie,
                    NoPlacas: this.numPlacas,
                    Descripcion: this.descripcion,
                    CodMarca: '',
                    CodDescripcion: '',
                    CodUso: '',
                    Clave: this.claveCot,
                    Servicio: 'PARTICULAR'
                },
                Coberturas: [],
                Paquete: this.cobertura, //si, this.cobertura contiene el valor de Paquete
                Descuento: null,
                PeriodicidadDePago: this.formaDePagoInt, //0 es Anual, 4 es Mensual
                Cotizacion: {
                    PrimaTotal: this.PrimaTotalHDI,
                    PrimaNeta: this.PrimaNetaHDI,
                    Derechos: this.DerechosHDI,
                    Impuesto: this.ImpuestosHDI,
                    Recargos: this.RecargoHDI,
                    PrimerPago: null,
                    PagosSubsecuentes: null,
                    IDCotizacion: null,
                    CotID: null,
                    VerID: null,
                    CotIncID: null,
                    VerIncID: null,
                    Resultado: null
                },
                Emision: {
                    PrimaTotal: null,
                    PrimaNeta: null,
                    Derechos: null,
                    Impuesto: null,
                    Recargos: null,
                    PrimerPago: null,
                    PagosSubsecuentes: null,
                    IDCotizacion: null,
                    Terminal: null,
                    Documento: null,
                    Poliza: null,
                    Resultado: null
                },
                Pago: {
                    MedioPago: this.tipoTarjeta,
                    NombreTarjeta: this.titular,
                    Banco: this.banco,
                    NoTarjeta: this.numTarjeta,
                    MesExp: this.mesCot,
                    AnioExp: this.anioCot,
                    CodigoSeguridad: this.cvv,
                    NoClabe: null,
                    Carrier: this.carrierCot,
                },
                CodigoError: null,
                urlRedireccion: null
            };
        }else{
            consultaData = {
                Aseguradora: this.aseguradoraCot,
                Cliente: {
                    TipoPersona: 'F',
                    Nombre: this.nombre,
                    ApellidoPat: this.paterno,
                    ApellidoMat: this.materno,
                    RFC: this.rfc,
                    FechaNacimiento: this.fechaNacimiento,
                    Ocupacion: 'EMPLEADO',
                    CURP: null,
                    Direccion: {
                        Calle: this.calle,
                        NoExt: this.numExterior,
                        NoInt: numInterior,
                        Colonia: this.colonia,
                        CodPostal: this.codigoPostal2,
                        Poblacion: this.delegacion,
                        Ciudad: this.estado,
                        Pais: 'MÉXICO'
                    },
                    Edad: this.edad,
                    Genero: this.genero,
                    Telefono: this.telCasa,
                    Email: this.email
                },
                Vehiculo: {
                    Uso: 'PARTICULAR',
                    Marca: this.marca,
                    Modelo: this.modelo,
                    NoMotor: this.numMotor,
                    NoSerie: this.numSerie,
                    NoPlacas: this.numPlacas,
                    Descripcion: this.descripcion,
                    CodMarca: '',
                    CodDescripcion: '',
                    CodUso: '',
                    Clave: this.claveCot,
                    Servicio: 'PARTICULAR'
                },
                Coberturas: [],
                Paquete: this.cobertura, //si, this.cobertura contiene el valor de Paquete
                Descuento: null,
                PeriodicidadDePago: this.formaDePagoInt, //0 es Anual, 4 es Mensual
                Cotizacion: {
                    PrimaTotal: null,
                    PrimaNeta: null,
                    Derechos: null,
                    Impuesto: null,
                    Recargos: null,
                    PrimerPago: null,
                    PagosSubsecuentes: null,
                    IDCotizacion: null,
                    CotID: null,
                    VerID: null,
                    CotIncID: null,
                    VerIncID: null,
                    Resultado: null
                },
                Emision: {
                    PrimaTotal: null,
                    PrimaNeta: null,
                    Derechos: null,
                    Impuesto: null,
                    Recargos: null,
                    PrimerPago: null,
                    PagosSubsecuentes: null,
                    IDCotizacion: null,
                    Terminal: null,
                    Documento: null,
                    Poliza: null,
                    Resultado: null
                },
                Pago: {
                    MedioPago: this.tipoTarjeta,
                    NombreTarjeta: this.titular,
                    Banco: this.banco,
                    NoTarjeta: this.numTarjeta,
                    MesExp: this.mesCot,
                    AnioExp: this.anioCot,
                    CodigoSeguridad: this.cvv,
                    NoClabe: null,
                    Carrier: this.carrierCot,
                },
                CodigoError: null,
                urlRedireccion: null
            };
        }

        console.log({ consultaData });

        let string = 'usuario=Bunch&Password=BunCH2O18&data=' + JSON.stringify(consultaData) + '&movimiento=emision&idContVend=' + this.idContVend + '&idcont=' + this.idContCot + '&idcli=' + this.idCliCot + '&iddir=' + this.idDirCot,
            encodedString = btoa(string),
            url = 'http://services.bunch.guru/WebService.asmx/CotizacionEmisionJSON?param=' + encodedString;

        console.log({string, encodedString, url});

        this.http.get(url).map(res => res.json()).subscribe(data => {            
            loader.dismiss();
            loader.onDidDismiss(() => {
                console.log({data});

                if (data.CodigoError != null) {
                    console.error(data.CodigoError);
                }

                if (data.Emision.Poliza == null || data.Emision.Poliza == '') {
                    //this.showToast(data.codigoError);                
                    //this.navCtrl.push(errorPage, { prevPage: this.prevPage }, { animate: true });
 //Revisar error en variable                   that.codigoError = data.CodigoError;
                    that.step = 8;
                    that.currentStep = 8;
                } else {
                    localStorage.Poliza = data.Emision.Poliza;
                    that.urlEmisionDocumento = data.Emision.Documento;
                    //this.navCtrl.push(PaymentSubmittedPage2, { prevPage: this.prevPage }, { animate: true });
                    //agregado por arico
                    this.http.get('http://services.bunch.guru/WebService.asmx/envioCorreoCompra?email=' + this.email + '&poliza='+ localStorage.Poliza +'&idvend=' + this.idContVend)
                    .map(res2 => res2.json())
                    .subscribe(data2 => {                
                        console.log("esta es la response " + data2);
                    }, err => {
                        console.log(err);
                    });
                    //agregado por arico
                    if (that.cotizacion.aseguradora.toUpperCase() == 'GNP') {
                        document.getElementById('felicidadesGNP').style.display = 'block';
                        document.getElementById('felicidadesGNPButton').style.display = 'block';

                        document.getElementById('felicidades').style.display = 'none';
                        document.getElementById('felicidadesButton').style.display = 'none';
                    }
                    that.step = 7;
                    that.currentStep = 7;                    
                }
            });                        
        }, err => {
            loader.dismiss();
            loader.onDidDismiss(() => {
                console.log({ err });
                that.step = 8;
                that.currentStep = 8;
            });
            //that.showToast('Error');
            //this.navCtrl.push(errorPage, { prevPage: this.prevPage }, { animate: true });            
        });
    
    }
    goToDocumentDetailPage() {
        //this.navCtrl.push(DocumentDetailPage);
    }

    goToPayPolicyPage() {
        /*let modal = this.modalCtrl.create(PaymentSubmittedPage2);
        modal.onDidDismiss(data => {
            if (data) {
                let tmp = document.getElementById("tab-t0-4").setAttribute("aria-selected", "false");
                tmp = document.getElementById("tab-t0-5").setAttribute("aria-selected", "true");
                this.navCtrl.push(ProductsPage, { prevPage: "AcqureProductsPage" });
            }
        });
        modal.present();*/
    }        

    validName(txtNombre:string):boolean {
                
        txtNombre = txtNombre;
        let flag = false;

        if (txtNombre == null || txtNombre.length == 0 || /^\s+$/.test(txtNombre) || txtNombre == "" || txtNombre == " ") {
                this.showToast('Error: Ingrese un nombre válido');
        } else if (txtNombre.length < 3) {
            this.showToast('Error: Su nombre debe ser de al menos 3 caracteres');            
        } else if ( /^[0-9]/.test(txtNombre) ) {
            this.showToast('Error: El campo nombre no debe contener Números');                        
        } else {            
            flag = true;            
        }

        return flag;
    }

    validPaterno():boolean{            

        let flag = false;
        let txtPaterno:string = this.paterno;
        if( txtPaterno == null || txtPaterno.length == 0 || /^\s+$/.test(txtPaterno) || txtPaterno == "" || txtPaterno == " " ) {
            this.showToast('Error: Ingrese un Apellido Paterno válido');
        } else if (txtPaterno.length < 3) {
            this.showToast('Error: Su Apellido Paterno  debe ser de al menos 3 caracteres');
        } else if ( /^[0-9]/.test(txtPaterno) ) {
            this.showToast('Error: El campo Apellido Paterno no debe contener Números');                
        } else {
            flag = true;            
        }

        return flag;
    }
    
    validMaterno():boolean{    

        let flag = false;
        let txtPaterno:string = this.materno;
        if( txtPaterno == null || txtPaterno.length == 0 || /^\s+$/.test(txtPaterno) || txtPaterno == "" || txtPaterno == " " ) {
            this.showToast('Error: Ingrese un Apellido Materno válido');                                    
        } else if (txtPaterno.length < 3) {
            this.showToast('Error: Su Apellido Materno debe ser de al menos 3 caracteres');
        } else if ( /^[0-9]/.test(txtPaterno) ) {
            this.showToast('Error: El campo Apellido Materno no debe contener Números');                
        } else {
            flag = true;            
        }

        return flag;
    }

    //Generacion de RFC
    flag_fecha = false;
    flag_nombre = true;
    flag_apaterno = false;
    flag_amaterno = false;
    flag_rfc = false;
    rfc_hc = "";

    esVocal(letra) {
        if (letra == 'A' || letra == 'E' || letra == 'I' || letra == 'O'
            || letra == 'U' || letra == 'a' || letra == 'e' || letra == 'i'
            || letra == 'o' || letra == 'u')
            return true;
        else
            return false;
    }
    
    QuitarArticulos(articles) {
        articles = articles.replace("DEL ", "");
        articles = articles.replace("LAS ", "");
        articles = articles.replace("DE ", "");
        articles = articles.replace("LA ", "");
        articles = articles.replace("Y ", "");
        articles = articles.replace("A ", "");
        articles = articles.replace("VON ", "");
        articles = articles.replace("VAN ", "");
        articles = articles.replace("LOS ", "");
        articles = articles.replace("MAC ", "");
        articles = articles.replace("MC ", "");
    
        return articles;
    }
    
    QuitTild(tild) {
        tild = tild.replace("Á", "A");
        tild = tild.replace("É", "E");
        tild = tild.replace("Í", "I");
        tild = tild.replace("Ó", "O");
        tild = tild.replace("Ú", "U");
    
        return tild;
    }
    
    generarRFC() {
        var nombre = this.nombre.trim().toUpperCase();
        var materno = this.materno.trim().toUpperCase();
        var paterno = this.paterno.trim().toUpperCase();
    
        //console.log(nombre + " " + apaterno + " " + amaterno);
    
        var date = this.fechaNacimiento;
        var anio = date.substr(2, 2);
        var mes = date.substr(5, 2);
        var dia = date.substr(8, 2);        
        var rfc = "";
    
        nombre = this.QuitTild(nombre);
        paterno = this.QuitTild(paterno);
        materno = this.QuitTild(materno);
    
        paterno = this.QuitarArticulos(paterno);
        materno = this.QuitarArticulos(materno);
    
        nombre = nombre.substr(0, 1);
        materno = materno.substr(0, 1);
    
        var l = paterno.length;
        rfc += paterno.substring(0, 1);
    
        for (var i = 0; i < l; i++) {
            var a_pat = paterno.substring(1, l);
            var c = a_pat.charAt(i);
    
            if (this.esVocal(c)) {
                rfc += c;
                break;
            }
        }
        rfc += materno;
        rfc += nombre;
        rfc += anio;
        rfc += mes;
        rfc += dia;
    
        this.rfc_hc = rfc;
        this.rfc_hc = this.badWord(rfc);
        console.log('RFC', this.rfc_hc);
    }
    
    calcHC() {
        console.log('calcHC');
        var nombre = this.nombre.trim().toUpperCase();
        //var snombre = document.getElementById("snombre").value.trim().toUpperCase();
        var materno = this.materno.trim().toUpperCase();
        var paterno = this.paterno.trim().toUpperCase();            
    
        paterno = this.QuitarArticulos(paterno);
        materno = this.QuitarArticulos(materno);
    
        paterno = this.QuitTild(paterno);
        materno = this.QuitTild(materno);
        nombre = this.QuitTild(nombre);
        //snombre = QuitTild(snombre);
    
        //var nombreC = paterno + " " + materno + " " + nombre + " " + snombre;
        var nombreC = paterno + " " + materno + " " + nombre;
        console.log("Nombre completo " + nombreC);
    
        for (var k = 0; k < 10; k++)
            nombreC = this.NameToNumber(nombreC);
    
        nombreC = "0" + nombreC;
    
        var tm = nombreC.length - 1;
        var valorSuma = 0;        
    
        for (var j = 0; j < tm; j++)
            valorSuma += Number(nombreC.substring(j, j + 2)) * Number(nombreC.substring(j + 1, j + 2));
    
        var divs:any = valorSuma % 1000;
        var mod:any = Math.trunc(divs / 34);
        divs = divs - mod * 34;
    
        if (divs < 9)
            divs += 1;
        if (divs == 9)
            divs = "A";
        if (mod < 9)
            mod += 1;
        if (mod == 9)
            mod = "A";
    
        var mss_one = mod.toString();
        mss_one = this.NumberToWord(mss_one);
        mss_one = this.NumberToWord(mss_one);
        var mss_two = divs.toString();
        mss_two = this.NumberToWord(mss_two);
        mss_two = this.NumberToWord(mss_two);
        var mss = mss_one + mss_two;
    
        var rfs:any = this.rfc_hc + mss;
        rfs = this.rfcToNumber(rfs);
        rfs = this.rfcToNumber(rfs);
    
        var n = 0;
    
        n += ( rfs.substr(0, 2) ) * 13;
        n += ( rfs.substr(2, 2) ) * 12;
        n += ( rfs.substr(4, 2) ) * 11;
        n += ( rfs.substr(6, 2) ) * 10;
    
        n += ( rfs.substr(8, 1) ) * 9;
        n += ( rfs.substr(9, 1) ) * 8;
        n += ( rfs.substr(10, 1) ) * 7;
        n += ( rfs.substr(11, 1) ) * 6;
        n += ( rfs.substr(12, 1) ) * 5;
        n += ( rfs.substr(13, 1) ) * 4;
    
        n += this.rfcToNumber(mss_one) * 3;
        n += this.rfcToNumber(mss_two) * 2;
    
        n = ( 11000 - n ) % 11;
            
        this.rfc = this.rfc_hc + mss + n;
        console.log('rfc generado', this.rfc);
        //var homoclave = this.rfc_hc + mss + n;
        //console.log("Homoclave: " + homoclave);
    }
    
    NameToNumber(namber) {
        namber = namber.replace(" ", "00");
        namber = namber.replace("&", "10");
        namber = namber.replace("Ã", "10");
        namber = namber.replace("A", "11");
        namber = namber.replace("B", "12");
        namber = namber.replace("C", "13");
        namber = namber.replace("D", "14");
        namber = namber.replace("E", "15");
        namber = namber.replace("F", "16");
        namber = namber.replace("G", "17");
        namber = namber.replace("H", "18");
        namber = namber.replace("I", "19");
        namber = namber.replace("J", "21");
        namber = namber.replace("K", "22");
        namber = namber.replace("L", "23");
        namber = namber.replace("M", "24");
        namber = namber.replace("N", "25");
        namber = namber.replace("O", "26");
        namber = namber.replace("P", "27");
        namber = namber.replace("Q", "28");
        namber = namber.replace("R", "29");
        namber = namber.replace("S", "32");
        namber = namber.replace("T", "33");
        namber = namber.replace("U", "34");
        namber = namber.replace("V", "35");
        namber = namber.replace("W", "36");
        namber = namber.replace("X", "37");
        namber = namber.replace("Y", "38");
        namber = namber.replace("Z", "39");
        namber = namber.replace("Ñ", "40");
    
        return namber;
    }
    
    NumberToWord(wurth) {
        wurth = wurth.replace("10", "B");
        wurth = wurth.replace("11", "C");
        wurth = wurth.replace("12", "D");
        wurth = wurth.replace("13", "E");
        wurth = wurth.replace("14", "F");
        wurth = wurth.replace("15", "G");
        wurth = wurth.replace("16", "H");
        wurth = wurth.replace("17", "I");
        wurth = wurth.replace("18", "J");
        wurth = wurth.replace("19", "K");
        wurth = wurth.replace("20", "L");
        wurth = wurth.replace("21", "M");
        wurth = wurth.replace("22", "N");
        wurth = wurth.replace("23", "P");
        wurth = wurth.replace("24", "Q");
        wurth = wurth.replace("25", "R");
        wurth = wurth.replace("26", "S");
        wurth = wurth.replace("27", "T");
        wurth = wurth.replace("28", "U");
        wurth = wurth.replace("29", "V");
        wurth = wurth.replace("30", "W");
        wurth = wurth.replace("31", "X");
        wurth = wurth.replace("32", "Y");
        wurth = wurth.replace("33", "Z");
    
        return wurth;
    }
    
    rfcToNumber(namber) {
        namber = namber.replace("A", "10");
        namber = namber.replace("B", "11");
        namber = namber.replace("C", "12");
        namber = namber.replace("D", "13");
        namber = namber.replace("E", "14");
        namber = namber.replace("F", "15");
        namber = namber.replace("G", "16");
        namber = namber.replace("H", "17");
        namber = namber.replace("I", "18");
        namber = namber.replace("J", "19");
        namber = namber.replace("K", "20");
        namber = namber.replace("L", "21");
        namber = namber.replace("M", "22");
        namber = namber.replace("N", "23");
        namber = namber.replace("O", "25");
        namber = namber.replace("P", "26");
        namber = namber.replace("Q", "27");
        namber = namber.replace("R", "28");
        namber = namber.replace("S", "29");
        namber = namber.replace("T", "30");
        namber = namber.replace("U", "31");
        namber = namber.replace("V", "32");
        namber = namber.replace("W", "33");
        namber = namber.replace("X", "34");
        namber = namber.replace("Y", "35");
        namber = namber.replace("Z", "36");
        namber = namber.replace("Ã‘", "38");
        namber = namber.replace("0", "0");
        namber = namber.replace("1", "1");
        namber = namber.replace("2", "2");
        namber = namber.replace("3", "3");
        namber = namber.replace("4", "4");
        namber = namber.replace("5", "5");
        namber = namber.replace("6", "6");
        namber = namber.replace("7", "7");
        namber = namber.replace("8", "8");
        namber = namber.replace("9", "9");
    
        return namber;
    }
    
    badWord(bad) {
        bad = bad.replace("BUEI", "BUEX");
        bad = bad.replace("BUEY", "BUEX");
        bad = bad.replace("CACA", "CACX");
        bad = bad.replace("CACO", "CACX");
        bad = bad.replace("CAGA", "CAGX");
        bad = bad.replace("CAGO", "CAGX");
        bad = bad.replace("CAKA", "CAKX");
        bad = bad.replace("COGE", "COGX");
        bad = bad.replace("COJA", "COJX");
        bad = bad.replace("COJE", "COJX");
        bad = bad.replace("COJI", "COJX");
        bad = bad.replace("COJO", "COJX");
        bad = bad.replace("CULO", "CULX");
        bad = bad.replace("FETO", "FETX");
        bad = bad.replace("GUEY", "GUEX");
        bad = bad.replace("JOTO", "JOTX");
        bad = bad.replace("KACA", "KACX");
        bad = bad.replace("KACO", "KACX");
        bad = bad.replace("KAGA", "KAGX");
        bad = bad.replace("KAGO", "KAGX");
        bad = bad.replace("KOGE", "KOGX");
        bad = bad.replace("KOJO", "KOJX");
        bad = bad.replace("KAKA", "KAKX");
        bad = bad.replace("KULO", "KULX");
        bad = bad.replace("MAME", "MAMX");
        bad = bad.replace("MAMO", "MAMX");
        bad = bad.replace("MEAR", "MEAX");
        bad = bad.replace("MEON", "MEOX");
        bad = bad.replace("MION", "MIOX");
        bad = bad.replace("MOCO", "MOCX");
        bad = bad.replace("MULA", "MULX");
        bad = bad.replace("PEDA", "PEDX");
        bad = bad.replace("PEDO", "PEDX");
        bad = bad.replace("PENE", "PENX");
        bad = bad.replace("PUTA", "PUTX");
        bad = bad.replace("PUTO", "PUTX");
        bad = bad.replace("QULO", "QULX");
        bad = bad.replace("RATA", "RATX");
        bad = bad.replace("RUIN", "RUIX");
    
        return bad;
    }    

    private coberturaList = ['Amplia', 'Limitada', 'RC'];
    private cobertura:string = this.coberturaList[0];
    private formaDePagoList = ['Anual', 'Mensual'];
    private formaDePago:string = this.formaDePagoList[0];
    private formaDePagoInt:number = (this.formaDePago == 'Mensual') ? 4 : 0; //0 es Anual, 4 es Mensual
    private opcionesCotizacionChanged:boolean = false;

    showAlertCobertura() {

        let that = this,
            title = 'Cobertura',
            options = [];

        for (let cobertura of this.coberturaList) {
            let checked = this.cobertura == cobertura;
            options.push({
                type: 'radio',
                label: cobertura,
                value: cobertura,
                checked: checked,
            });
        }

        this.showAlert(title, options, function(cobertura) {
            cobertura = cobertura.trim();
            if (cobertura.length == 0) {
                that.cobertura = null;
            } else {
                if (cobertura != that.cobertura) { 
                    that.opcionesCotizacionChanged = true;
                    that.cobertura = cobertura;
                }
            }
        });
    }    

    showAlertFormaDePago() {
        let that = this,
            title = 'Forma de Pago',
            options = [];

        for (let formaDePago of this.formaDePagoList) {
            let checked = this.formaDePago == formaDePago;
            options.push({
                type: 'radio',
                label: formaDePago,
                value: formaDePago,
                checked: checked,
            });
        }

        this.showAlert(title, options, function(formaDePago) {
            formaDePago = formaDePago.trim();
            if (formaDePago.length == 0) {
                that.formaDePago = null;
                that.formaDePagoInt = null;
            } else {
                if (formaDePago != that.formaDePago) {
                    that.opcionesCotizacionChanged = true;
                    that.formaDePago = formaDePago;
                    that.formaDePagoInt = (formaDePago == 'Mensual') ? 4 : 0; //0 es Anual, 4 es Mensual                
                }                
            }
        });        
    }

    goBack() {                

        //let validateTab = true,
        let step = this.currentStep - 1;
        if (step >= 1) {
            this.showStep(step, {}, false);
        } else {
            this.navCtrl.pop();
        }
    }    

    bottomAlert(field, list, callback:any = undefined) {
        this.bottomAlertField = field;        
        let newList = [];
        for (let i = 0, len = list.length; i < len; i++) {
            let isSelected = list[i] == this[field];                        
            newList.push({value: list[i], selected: isSelected});
        }
        this.bottomAlertOptionsList = newList;
        document.getElementById('bottomAlertBackground').style.display = 'block';
        document.getElementById('bottomAlertTile').style.display = 'block';
        document.getElementById('bottomAlertTile').getElementsByClassName('scroll-content')[0].scrollTo(0, 0);        
        //document.getElementById('bottomAlertTile').scrollToTop();
        this.hideFooterMenu();

        
        //scrollIntoView();    

        if (this[field] !== null && this[field] !== undefined) {
            setTimeout(function() {
                let elem = document.getElementById('bottomAlertTile').getElementsByClassName('selected')[0];
                if (elem != null) {
                    elem.scrollIntoView();
                }
            }, 350);
        }        

        if (callback != undefined) {
            let found = false;
            for (let i = 0, len = this.triggers.length; i < len; i++) {
                if (this.triggers[i]['field'] == field) {
                    found = true;
                    break
                }
            }
            if (found == false) {
                this.triggers.push({field: field, fn: callback});
            }            
        }
    }

    private bottomAlertField:string;
    private triggers:any[] = [];

    bottomAlertOptionSelected(optionSelected:any):void {        
        this[this.bottomAlertField] = (optionSelected.value.length == 0) ? null : optionSelected.value;
        for (let i = 0, len = this.triggers.length; i < len; i++) {
            if (this.triggers[i]['field'] == this.bottomAlertField) {
                this.triggers[i]['fn'](optionSelected.value);
            }
        }
        this.closeBottomAlert();
    }

    closeBottomAlert() {
        let that = this;
        document.getElementById('bottomAlertBackground').style.display = 'none';
        document.getElementById('bottomAlertTile').style.display = 'none';        
        setTimeout(function() {
            that.showFooterMenu();  
        }, 100);        
    }    

    hideFooterMenu() {        
        document.getElementById('appFooter').getElementsByClassName('tabbar')[0].removeAttribute('style');
        document.getElementById('appFooter').getElementsByClassName('tabbar')[0].setAttribute('style', 'display:none;');
    }

    showFooterMenu() {        
        document.getElementById('appFooter').getElementsByClassName('tabbar')[0].removeAttribute('style');
    }

    showOpcionesCotizacion() {
        document.getElementById('opcionesCotizacion').style.display = 'block';
        document.getElementById('opcionesCotizacionTile').style.display = 'block';    
        this.hideFooterMenu();
    }

    closeOpcionesCotizacion() {
        
        let that = this;

        document.getElementById('opcionesCotizacion').style.display = 'none';
        document.getElementById('opcionesCotizacionTile').style.display = 'none';        
        this.showFooterMenu();

        if (that.opcionesCotizacionChanged == true) {
            let loader = this.loadingCtrl.create();
            loader.present();            
            this.cotizar(undefined, 0, function() {
                loader.dismiss();
                loader.onDidDismiss(() => {                
                    that.opcionesCotizacionChanged = false;
                    that.content.scrollToTop();
                });
            });
        }
    }

    /*private quitaAcentos(s) {
        var r = s.toLowerCase();
            r = r.replace(new RegExp(/\s/g),"");
            r = r.replace(new RegExp(/[àáâãäå]/g),"a");
            r = r.replace(new RegExp(/[èéêë]/g),"e");
            r = r.replace(new RegExp(/[ìíîï]/g),"i");
            r = r.replace(new RegExp(/ñ/g),"n");                
            r = r.replace(new RegExp(/[òóôõö]/g),"o");
            r = r.replace(new RegExp(/[ùúûü]/g),"u");
                    
        return r.toUpperCase();
    }*/
}