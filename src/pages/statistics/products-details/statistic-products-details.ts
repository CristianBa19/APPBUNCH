import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
//import { NgClass } from '@angular/common';
// import { AcquireProductPage } from '../acquire-product/acquire-product';

@Component({
    selector: 'statistic-products-details-page',
    templateUrl: 'statistic-products-details.html',
})
export class StatisticProductsDetailsPage {

    isClient: any;
    productDetail:any = {};    
    optionList:any =[];
    containerTexts = [
        {
            mainText: "DAÑOS MATERIALES: ",
            subText: "5% V. COMERCIAL"
        },
        {
            mainText: "ROBO TOTAL: ",
            subText: "10% V. COMERCIAL"
        },
        {
            mainText: "RC PERSONAS: ",
            subText: "3,000,000.00"
        },
        {
            mainText: "RC: ",
            subText: "800,000.00"
        },
        {
            mainText: "DEFENSA LEGAL: ",
            subText: "AMPARADA"
        },
        {
            mainText: "GASTOS MÉDICOS: ",
            subText: "50,000.00"
        },
        {
            mainText: "ASISTENCIA VIAL: ",
            subText: "AMPARADA"
        },
    ];

    constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http) {

        this.isClient = localStorage.getItem("isClient");
        //let data = this.navParams.data;
        this.optionList = [
            {nameOfProduct:"Chevrolet Aveo 2010", subNameOfProduct:"Seguro de Auto", companyLogo:"assets/icon/logo/logo-axa.png", companyName:"Amplia", companySubName:"Covertura", itemValue:"$6,050", itemSubValue:"Anual", conteinerTexts:[
                {
                    mainText: "DAÑOS MATERIALES: ",
                    subText: "5% V. COMERCIAL"
                },
                {
                    mainText: "ROBO TOTAL: ",
                    subText: "10% V. COMERCIAL"
                },
                {
                    mainText: "RC PERSONAS: ",
                    subText: "3,000,000.00"
                },
                {
                    mainText: "RC: ",
                    subText: "800,000.00"
                },
                {
                    mainText: "DEFENSA LEGAL: ",
                    subText: "AMPARADA"
                },
                {
                    mainText: "GASTOS MÉDICOS: ",
                    subText: "50,000.00"
                },
                {
                    mainText: "ASISTENCIA VIAL: ",
                    subText: "AMPARADA"
                },
            ]},
            {nameOfProduct:"Nissan Tsuru 2010", subNameOfProduct:"Seguro de Auto", companyLogo:"assets/icon/logo/logo-axa.png", companyName:"Amplia", companySubName:"Covertura", itemValue:"$8,940", itemSubValue:"Anual", conteinerTexts:[
                {
                    mainText: "DAÑOS MATERIALES: ",
                    subText: "5% V. COMERCIAL"
                },
                {
                    mainText: "ROBO TOTAL: ",
                    subText: "10% V. COMERCIAL"
                },
                {
                    mainText: "RC PERSONAS: ",
                    subText: "3,000,000.00"
                },
                {
                    mainText: "RC: ",
                    subText: "800,000.00"
                },
                {
                    mainText: "DEFENSA LEGAL: ",
                    subText: "AMPARADA"
                },
                {
                    mainText: "GASTOS MÉDICOS: ",
                    subText: "50,000.00"
                },
                {
                    mainText: "ASISTENCIA VIAL: ",
                    subText: "AMPARADA"
                },
            ]}
        ];
    }

    goToAcquireProduct(){
        // this.navCtrl.push(AcquireProductPage, {prevPage:"chat"}, {animate: true});
    }

    ionViewDidLoad(){              
        var t = this;
        var encodedString = btoa("IdVend=1&fecIni=01/01/2017&fecFin=01/01/2019");      
        this.http.get('http://services.bunch.guru/WebService.asmx/ConsultaEstadisticas?param=' + encodedString)
        .map(res=> res.json())
        .subscribe(data=>{                  
            data.Productos.forEach(function(e) {
                console.log(e);

                e.aseguradora = 'ABA'; //for test purposes                

                t.productDetail.seguro = e.ramo;
                t.productDetail.aseguradora = e.aseguradora;
                t.productDetail.policy = e.poliza;
                t.productDetail.description = e.descripcion;
                t.productDetail.fInicio = t.formatDate(e.fInicio);
                t.productDetail.fFin = t.formatDate(e.fFin);
                t.productDetail.primaTotal = e.total;
                t.productDetail.periodicidad = e.Periodicidad;
                t.productDetail.pago = e.pago;
                t.productDetail.isInsuranceActive = t.isInsuranceActive(t.productDetail.fInicio, t.productDetail.fFin);
                t.productDetail.circleIcon = (t.productDetail.isInsuranceActive.substr(0, 2) == 'No') ? 'red' : 'green';
            });
        },err =>{
          console.log('error');
        });    
    }

    formatDate(date:string) {
        let arr = date.split('/');
        arr[0] = (arr[0].length == 1) ? '0' + arr[0] : arr[0];
        arr[1] = (arr[1].length == 1) ? '0' + arr[1] : arr[1];
        return `${arr[0]}-${arr[1]}-${arr[2]}`;
    }

    isInsuranceActive(inicio:string, fin:string):string { //inicio and fin must be in dd-mm-yyyy format
        
        let start = this.strDateToTimestamp(inicio),
            end = this.strDateToTimestamp(fin),
            now = +new Date(); //timestamp
        
        if (start <= now && now <= end) {
            return 'Vigente';
        } else {
            return 'No vigente';
        }
    }

    strDateToTimestamp(date:string):number { //date must be in dd-mm-yyyy format
        let arr = date.split('-');        
        return +new Date(+arr[2], +arr[1] - 1, +arr[0]); //timestamp        
    }

    public goBack = () => {
        this.navCtrl.pop();
    }
}
