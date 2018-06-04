import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { StatisticProductsDetailsPage } from '../products-details/statistic-products-details';
import { Http, Headers } from '@angular/http';

@Component({
    selector: 'statistic-products-page',
    templateUrl: 'statistic-products.html',
})
export class StatisticProductsPage {

    private optionList:any =[];
    private containerTexts = [
        {
            mainText: localStorage.getItem("language") == "en"?"MATERIAL DAMAGE: ":"DAÑOS MATERIALES: ",
            subText: "5% V. COMERCIAL"
        },
        {
            mainText: localStorage.getItem("language") == "en"?"TOTAL THEFT: ":"ROBO TOTAL: ",
            subText: "10% V. COMERCIAL"
        },
        {
            mainText: localStorage.getItem("language") == "en"?"RC PEOPLE: ":"RC PERSONAS: ",
            subText: "3,000,000.00"
        },
        {
            mainText: localStorage.getItem("language") == "en"?"RC: ":"RC: ",
            subText: "800,000.00"
        },
        {
            mainText: localStorage.getItem("language") == "en"?"LEGAL DEFENSE: ":"DEFENSA LEGAL: ",
            subText: "AMPARADA"
        },
        {
            mainText: localStorage.getItem("language") == "en"?"MEDICAL EXPENSES: ":"GASTOS MÉDICOS: ",
            subText: "50,000.00"
        },
        {
            mainText: localStorage.getItem("language") == "en"?"ROAD OF ASSISTANCE: ":"ASISTENCIA VIAL: ",
            subText: "AMPARADA"
        },
    ];

    constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http) {

        let data = this.navParams.data;

        /*this.optionList = [
            {nameOfProduct:localStorage.getItem("language") == "en"?"Car insurance":"Seguro de Auto", subNameOfProduct:"Miguel Ivan Hernandez", companyLogo:"assets/icon/logo/logo-axa.png", companyName:"$12,500", companySubName:localStorage.getItem("language") == "en"?"Full payment":"Pago total", itemValue:"$2,500", itemSubValue: localStorage.getItem("language") == "en"?"Won":"Ganado", 
                productDetails: {
                    mainText: "GNP - Volkswagen Jetta", 
                    subText: localStorage.getItem("language") == "en"? "Posted on 15/04/2017": "Vigencia 15/04/2017 al 15/05/2017",
                    policyNumber: localStorage.getItem("language") == "en" ? "Policy 55555":"No. de  Póliza 55555"
                }
            },
            {nameOfProduct:localStorage.getItem("language") == "en"?"Credit card":"Tarjeta de crédito", subNameOfProduct:"Miguel Ivan Hernandez", companyLogo:"assets/icon/logo/logo-axa.png", companyName:"$12,500", companySubName:localStorage.getItem("language") == "en"?"Full payment":"Pago total", itemValue:"$2,500", itemSubValue: localStorage.getItem("language") == "en"?"Won":"Ganado", 
                productDetails: {
                    mainText: "BBVA Bancomer - Premium Blac", 
                    subText: localStorage.getItem("language") == "en"? "Posted on 15/04/2017": "Vigencia 15/04/2017 al 15/05/2017",
                    policyNumber: localStorage.getItem("language") == "en" ? "Policy 55555":"No. de  Póliza 55555"
                }
            },
            {nameOfProduct:localStorage.getItem("language") == "en"?"Credit card":"Tarjeta de crédito", subNameOfProduct:"Miguel Ivan Hernandez", companyLogo:"assets/icon/logo/logo-gnp.png", companyName:"$12,500", companySubName: localStorage.getItem("language") == "en"?"Full payment":"Pago total", itemValue:"$2,500", itemSubValue: localStorage.getItem("language") == "en"?"Won":"Ganado", 
                productDetails: {
                    mainText: "BBVA Bancomer - Premium Black", 
                    subText: localStorage.getItem("language") == "en"? "Posted on 15/04/2017": "Vigencia 15/04/2017 al 15/05/2017",
                    policyNumber: localStorage.getItem("language") == "en" ? "Policy 55555":"No. de  Póliza 55555"
                }
            }
        ];*/        
    }

    ionViewDidLoad(){              
        var t = this;
        var encodedString = btoa("IdVend=1&fecIni=01/01/2017&fecFin=01/01/2019");      
        this.http.get('http://services.bunch.guru/WebService.asmx/ConsultaEstadisticas?param=' + encodedString)
        .map(res=> res.json())
        .subscribe(data=>{                  
            data.Productos.forEach(function(e) {
                console.log(e);

                e.aseguradora = 'ABA'.toLowerCase(); //for test purposes                

                t.optionList.push({
                    nameOfProduct: e.ramo, 
                    subNameOfProduct: e.cliente, 
                    companyLogo: "assets/icon/logo/logo-" + e.aseguradora + ".png", 
                    companyName: +e.ganancia, 
                    companySubName: e.Periodicidad, 
                    itemValue: +e.total, 
                    itemSubValue: e.Periodicidad, 
                    productDetails: {
                        mainText: e.descripcion, 
                        subText: `Vigencia ${t.formatDate(e.fInicio)} al ${t.formatDate(e.fFin)}`,
                        policyNumber: "No. de  Póliza " + e.poliza
                    }
                });
            });
        },err =>{
          console.log('error');
        });    
    }

    goToStatisticsProductsDetailsPage(){
        this.navCtrl.push(StatisticProductsDetailsPage, {prevPage:"chat"}, {animate: true});
    }

    formatDate(date:string) {
        let arr = date.split('/');
        arr[0] = (arr[0].length == 1) ? '0' + arr[0] : arr[0];
        arr[1] = (arr[1].length == 1) ? '0' + arr[1] : arr[1];
        return `${arr[0]}/${arr[1]}/${arr[2]}`;
    }

    public search = () => {
    }

    public goBack = () => {
        this.navCtrl.pop();
    }
}
