import { Component, ViewChild  } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { StatisticWeekPage } from '../week/statistic-week';

@Component({
    selector: 'statistic-weeks',
    templateUrl: 'statistic-weeks.html',
})
export class StatisticWeeksPage {
 
    barChart: any;
    doughnutChart: any;
    lineChart: any;

    private weeks:any = [];
    private weekEnd:number = this.getWeekLastDay();
    private monthName:string = this.getMonthName();
    private optionList:any =[];    

    constructor(public navCtrl: NavController, public navParams: NavParams) {}        

    public goBack = () => this.navCtrl.pop();    

    selectWeek(id:number):void {
        let selectedWeek = this.weeks[id];
        this.navCtrl.push(StatisticWeekPage, {prevPage:"chat", selectedWeek: selectedWeek}, {animate: true});
    }
    
    ionViewDidLoad() {

        let getWeek, fecIni, fecFin, monthIni, monthFin, weekStr, id = 0;
        for (let i = 0; i >= -5; i--) {            

            getWeek = this.getWeek(i);
            fecIni = this.getWeekFirstDay(getWeek);
            fecFin = this.getWeekLastDay(getWeek);
            monthIni = this.getMonthFirstDay(getWeek).substr(0, 3);
            monthFin = this.getMonthLastDay(getWeek).substr(0, 3);

            if (monthIni == monthFin) {
                weekStr = `${fecIni} - ${fecFin} de ${monthFin}`;
            } else {
                weekStr = `${fecIni} de ${monthIni} - ${fecFin} de ${monthFin}`;
            }            

            this.weeks.push({
                getWeek: getWeek,
                weekStr: weekStr,
                cotizaciones: 0,
                id: id++,
            });
        }
    }

    getMonthName(month:number = new Date().getMonth() + 1):string {

        let name = '';
        switch(month) {
            case 1:
                name = 'Enero';
                break;
            case 2:
                name = 'Febrero';
                break;
            case 3:
                name = 'Marzo';
                break;
            case 4:
                name = 'Abril';
                break;
            case 5:
                name = 'Mayo';
                break;
            case 6:
                name = 'Junio';
                break;
            case 7:
                name = 'Julio';
                break;
            case 8:
                name = 'Agosto';
                break;
            case 9:
                name = 'Septiembre';
                break;
            case 10:
                name = 'Octubre';
                break;
            case 11:
                name = 'Noviembre';
                break;
            case 12:
                name = 'Diciembre';
                break;
        }

        return name;
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

    getWeekFirstDay(getWeek:string = this.getWeek()):number {
        let fecIni = getWeek.substr(7, 10),
            arr = fecIni.split('/');

        return Number(arr[1]);
    }

    getMonthFirstDay(getWeek:string = this.getWeek()):string {
        let fecIni = getWeek.substr(7, 10),
            arr = fecIni.split('/');

        return this.getMonthName(+arr[0]);
    }    

    getWeekLastDay(getWeek:string = this.getWeek()):number {        
        let fecEnd = getWeek.substring(getWeek.length - 10),
            arr = fecEnd.split('/');
            
        return Number(arr[1]);
    }

    getMonthLastDay(getWeek:string = this.getWeek()):string {
        let fecEnd = getWeek.substring(getWeek.length - 10),
            arr = fecEnd.split('/');
            
        return this.getMonthName(+arr[0]);
    }

    formatDate(date:Date) {
        let day = ((date.getDate() + '').length == 1) ? '0' + date.getDate() : date.getDate(),
        month = ((date.getMonth() + 1 + '').length == 1) ? '0' + (date.getMonth() + 1) : date.getMonth() + 1,
        year = date.getFullYear();    
        
        return `${month}/${day}/${year}`;
    }
}
