import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { StatisticProductsPage } from '../statistics/products/statistic-products';
import { StatisticWeekPage } from '../statistics/week/statistic-week';
import { StatisticClientsPage } from '../statistics/clients/statistic-clients';
import { Http, Headers } from '@angular/http';

@Component({
    selector: 'page-statistics',
    templateUrl: 'statistics.html',
})
export class StatisticsPage {

    private ganancias:number;
    private cotizaciones:number;
    private polizas:number;
    private polizasCompare:string = 'equal';
    private cotizacionesCompare:string = 'equal';
    private gananciasCompare:string = 'equal';
    
    constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http) {}

    ionViewDidLoad() {
        var _this = this;
        let actualWeek = _this.getWeek();       
        let encodedString = btoa(`IdVend=1&${actualWeek}`);      
        _this.http.get('http://services.bunch.guru/WebService.asmx/ConsultaEstadisticas?param=' + encodedString)
        .map(res=> res.json())
        .subscribe(data=>{        
            _this.ganancias = +data.Ganancias.total;
            _this.cotizaciones = +data.Cotizaciones.total;
            _this.polizas = data.Productos.length;

            let pastWeek = _this.getWeek(-1);            
            encodedString = btoa(`IdVend=1&${pastWeek}`);
            _this.http.get('http://services.bunch.guru/WebService.asmx/ConsultaEstadisticas?param=' + encodedString)
            .map(res=> res.json())
            .subscribe(pastWeekData=> {
                let pastWeekPolizas = pastWeekData.Productos.length,
                    pastWeekCotizaciones = Number(pastWeekData.Cotizaciones.total),
                    pastWeekGanancias = Number(pastWeekData.Ganancias.total);

                    if (_this.polizas > pastWeekPolizas) {
                        _this.polizasCompare = 'arrow-up';
                    } else if (_this.polizas < pastWeekPolizas) {
                        _this.polizasCompare = 'arrow-down';
                    }

                    if (_this.cotizaciones > pastWeekCotizaciones) {
                        _this.cotizacionesCompare = 'arrow-up';
                    } else if (_this.cotizaciones < pastWeekCotizaciones) {
                        _this.cotizacionesCompare = 'arrow-down';
                    }

                    if (_this.ganancias > pastWeekGanancias) {
                        _this.gananciasCompare = 'arrow-up';
                    } else if (_this.cotizaciones < pastWeekGanancias) {
                        _this.gananciasCompare = 'arrow-down';
                    }

            }, err => console.log('error pastWeek'));
        }, err => console.log('error'));    
    }

    //Si week=0 entonces devuelve la semana actual, si week=-1 es la semana pasada, week=-2 es semana antepasada, week=2 es dentro de dos semanas and so on
    getWeek(week:number = 0):string {

        let mondayTimestamp = new Date().setDate(new Date().getDate() - (new Date().getDay() - 1)),
        mondayDate = new Date(mondayTimestamp);      

        if (week < 0) {      
            mondayDate = new Date(new Date().setDate(mondayDate.getDate() - 7 * Math.abs(week)));
        } else if (week > 0) {
            mondayDate = new Date(new Date().setDate(mondayDate.getDate() + 7 * week));
        }
            
        let sundayDate = new Date(new Date(mondayDate).setDate(mondayDate.getDate() + 6)),
            start = this.formatDate(mondayDate),
            end = this.formatDate(sundayDate);        

        return `fecIni=${start}&fecFin=${end}`;
    }

    formatDate(date:Date) {
        let day = ((date.getDate() + '').length == 1) ? '0' + date.getDate() : date.getDate(),
            month = ((date.getMonth() + 1 + '').length == 1) ? '0' + (date.getMonth() + 1) : date.getMonth() + 1,
            year = date.getFullYear();    
        return `${month}/${day}/${year}`;
    }  

    goToStatisticProductsPage(){
        this.navCtrl.push(StatisticProductsPage, {prevPage: "chat"}, {animate: true});
    }

    goToStatisticWeekPage(option:string) {    
        this.navCtrl.push(StatisticWeekPage, {prevPage: "chat", option: option}, {animate: true});
    }  

    goToStatisticClientsPage(){
        this.navCtrl.push(StatisticClientsPage, {prevPage: "chat"}, {animate: true});
    }
}
