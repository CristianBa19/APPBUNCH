import { Component, ViewChild  } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { StatisticProductsDetailsPage } from '../products-details/statistic-products-details';
import { StatisticWeeksPage } from '../weeks/statistic-weeks';
//import { Chart } from 'chart.js';
import { Http } from '@angular/http';

@Component({
    selector: 'statistic-week',
    templateUrl: 'statistic-week.html',
})
export class StatisticWeekPage {    
    @ViewChild('lineCanvas') lineCanvas;
     
    lineChart: any;
    title:string;
    option:string;
    weekInit:number = this.getWeekFirstDay();
    weekEnd:number = this.getWeekLastDay();
    monthName:string = this.getMonthName();    
    totalEarnings:number = 0;
    totalPrices:number = 0;
    selectedWeekGetWeek:string;
    weekStr:string = `${this.weekInit} al ${this.weekEnd} de ${this.monthName}`;

    constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http) {
        this.option = navParams.data.option;
        this.title = (this.option == 'earnings') ? 'Ganancias' : 'Cotizaciones';
        if (navParams.data.selectedWeek != undefined) {            
            this.selectedWeekGetWeek = navParams.data.selectedWeek.getWeek;
            this.weekStr = navParams.data.selectedWeek.weekStr;
        }
    }

    goToStatisticsProductsDetailsPage() {
        this.navCtrl.push(StatisticProductsDetailsPage, {prevPage: 'chat'}, {animate: true});
    }

    goToStatisticWeeksPage() {
        this.navCtrl.push(StatisticWeeksPage, {prevPage: 'chat'}, {animate: true});
    }    

    public goBack = () => {
        this.navCtrl.pop();
    }
    
    getMonthName():string {
        let month = new Date().getMonth(),
            name = '';
        switch(month) {
            case 0:
                name = 'Enero';
                break;
            case 1:
                name = 'Febrero';
                break;
            case 2:
                name = 'Marzo';
                break;
            case 3:
                name = 'Abril';
                break;
            case 4:
                name = 'Mayo';
                break;
            case 5:
                name = 'Junio';
                break;
            case 6:
                name = 'Julio';
                break;
            case 7:
                name = 'Agosto';
                break;
            case 8:
                name = 'Septiembre';
                break;
            case 9:
                name = 'Octubre';
                break;
            case 10:
                name = 'Noviembre';
                break;
            case 11:
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

    getWeekFirstDay():number {
        let getWeek = this.getWeek(),
            fecIni = getWeek.substr(7, 10),
            arr = fecIni.split('/');

        return Number(arr[1]);
    }

    getWeekLastDay():number {
        let getWeek = this.getWeek(),
            fecEnd = getWeek.substring(getWeek.length - 10),
            arr = fecEnd.split('/');        
            
        return Number(arr[1]);
    }

    formatDate(date:Date) {
        let day = ((date.getDate() + '').length == 1) ? '0' + date.getDate() : date.getDate(),
        month = ((date.getMonth() + 1 + '').length == 1) ? '0' + (date.getMonth() + 1) : date.getMonth() + 1,
        year = date.getFullYear();    
        
        return `${month}/${day}/${year}`;
    }

    getDates(startDate, endDate) {
        var dates = [],
            currentDate = startDate,
            addDays = function(days) {
                var date = new Date(this.valueOf());
                date.setDate(date.getDate() + days);
                return date;
            };
        while (currentDate <= endDate) {
            dates.push(currentDate);
            currentDate = addDays.call(currentDate, 1);
        }
        return dates;
    };            

    ionViewDidLoad() {             

        var t = this;             
        let actualWeek = this.selectedWeekGetWeek || this.getWeek(),        
            fecIni = actualWeek.substr(7,10), // format mm/dd/yyyy
            fecEnd = actualWeek.substr(actualWeek.length - 10), // format mm/dd/yyyy
            fecIniArr = fecIni.split('/'),
            fecEndArr = fecEnd.split('/'),
            fecIniYear = +fecIniArr[2], fecIniMonth = +fecIniArr[0] -1, fecIniDay = +fecIniArr[1], fecEndYear = +fecEndArr[2], fecEndMonth = +fecEndArr[0] -1, fecEndDay = +fecEndArr[1],
            dates = this.getDates(new Date(fecIniYear, fecIniMonth, fecIniDay), new Date(fecEndYear, fecEndMonth, fecEndDay)),
            formatedDates = [];        
        
        dates.forEach((date, index, arr) => {
            formatedDates.push(t.formatDate(date));
            arr[index] = date.getDate().toString();            
        });
        
        //var labels = dates;    
        var lineChartData = [];
        let encodedString, val;

        encodedString = btoa(`IdVend=1&fecIni=${formatedDates[0]}&fecFin=${formatedDates[0]}`)
        t.http.get(`http://services.bunch.guru/WebService.asmx/ConsultaEstadisticas?param=${encodedString}`).map(res => res.json()).subscribe(data => {                        
            val = (t.option == 'earnings') ? +data.Ganancias.total : +data.Cotizaciones.total;
            lineChartData.push(val);

            encodedString = btoa(`IdVend=1&fecIni=${formatedDates[1]}&fecFin=${formatedDates[1]}`)
            t.http.get(`http://services.bunch.guru/WebService.asmx/ConsultaEstadisticas?param=${encodedString}`).map(res => res.json()).subscribe(data => {
                val = (t.option == 'earnings') ? +data.Ganancias.total : +data.Cotizaciones.total;
                lineChartData.push(val);

                encodedString = btoa(`IdVend=1&fecIni=${formatedDates[2]}&fecFin=${formatedDates[2]}`)
                t.http.get(`http://services.bunch.guru/WebService.asmx/ConsultaEstadisticas?param=${encodedString}`).map(res => res.json()).subscribe(data => {
                    val = (t.option == 'earnings') ? +data.Ganancias.total : +data.Cotizaciones.total;
                    lineChartData.push(val);

                    encodedString = btoa(`IdVend=1&fecIni=${formatedDates[3]}&fecFin=${formatedDates[3]}`)
                    t.http.get(`http://services.bunch.guru/WebService.asmx/ConsultaEstadisticas?param=${encodedString}`).map(res => res.json()).subscribe(data => {
                        val = (t.option == 'earnings') ? +data.Ganancias.total : +data.Cotizaciones.total;
                        lineChartData.push(val);

                        encodedString = btoa(`IdVend=1&fecIni=${formatedDates[4]}&fecFin=${formatedDates[4]}`)
                        t.http.get(`http://services.bunch.guru/WebService.asmx/ConsultaEstadisticas?param=${encodedString}`).map(res => res.json()).subscribe(data => {
                            val = (t.option == 'earnings') ? +data.Ganancias.total : +data.Cotizaciones.total;
                            lineChartData.push(val);

                            encodedString = btoa(`IdVend=1&fecIni=${formatedDates[5]}&fecFin=${formatedDates[5]}`)
                            t.http.get(`http://services.bunch.guru/WebService.asmx/ConsultaEstadisticas?param=${encodedString}`).map(res => res.json()).subscribe(data => {
                                val = (t.option == 'earnings') ? +data.Ganancias.total : +data.Cotizaciones.total;
                                lineChartData.push(val);

                                encodedString = btoa(`IdVend=1&fecIni=${formatedDates[6]}&fecFin=${formatedDates[6]}`)
                                t.http.get(`http://services.bunch.guru/WebService.asmx/ConsultaEstadisticas?param=${encodedString}`).map(res => res.json()).subscribe(data => {
                                    val = (t.option == 'earnings') ? +data.Ganancias.total : +data.Cotizaciones.total;
                                    lineChartData.push(val);
                                                                        
                                    //lineChartData = [65.2, 22, 11, 40, 23, 12, 44];
                                    if (t.option == 'earnings') {
                                        t.totalEarnings = lineChartData.reduce((prev, curr) => prev + curr);
                                    } else {
                                        t.totalPrices = lineChartData.reduce((prev, curr) => prev + curr);
                                    }

                                    /*t.lineChart = new Chart(t.lineCanvas.nativeElement, {
                                        type: 'line',            
                                        data: {
                                            labels: labels,
                                            datasets: [
                                                {
                                                    label: "", //My First dataset
                                                    fill: "start",
                                                    lineTension: 0.5,
                                                    backgroundColor: "rgba(77,186,192,1)", //rgba(75,192,192,0.4)
                                                    borderColor: "rgba(77,186,192,1)",
                                                    borderCapStyle: 'butt',
                                                    borderDash: [],
                                                    borderDashOffset: 0.0,
                                                    borderJoinStyle: 'miter',
                                                    pointBorderColor: "rgba(77,186,192,1)",
                                                    pointBackgroundColor: "#fff",
                                                    pointBorderWidth: 0, //1,
                                                    pointHoverRadius: 5,
                                                    pointHoverBackgroundColor: "rgba(77,186,192,1)",
                                                    pointHoverBorderColor: "rgba(220,220,220,1)",
                                                    pointHoverBorderWidth: 2,
                                                    pointRadius: 0, //1,
                                                    pointHitRadius: 10,
                                                    data: lineChartData,
                                                    spanGaps: false,                        
                                                }
                                            ]
                                        },
                                        options: {
                                            legend: {
                                                labels: {
                                                    usePointStyle: true,
                                                    fontSize: 0,
                                                }
                                            },
                                            elements: { point: { radius: 0 } },
                                            scales: {
                                                xAxes: [
                                                    {
                                                        ticks: {
                                                            //display: false
                                                            //beginAtZero: true,
                                                            //min: 0,
                                                        },
                                                        gridLines: {
                                                            display: false,
                                                            drawBorder: false,
                                                        }
                                                    }
                                                ],
                                                yAxes: [
                                                    {
                                                        ticks: {
                                                            display: false,
                                                            beginAtZero: true
                                                        },
                                                        gridLines: {
                                                            display: false,
                                                            drawBorder: false,
                                                        }
                                                    }
                                                ] //, {gridLines: {display: false}}
                                            },                
                                            tooltips: {
                                                displayColors: false,
                                            }
                                        }
                            
                                    });*/
                                });
                            });
                        });
                    });
                });
            });
        });     
    }
}
