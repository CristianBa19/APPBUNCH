import { Component, ViewChild } from '@angular/core';
//import { NavController, Events, Tabs, Tab  } from 'ionic-angular';
import { NavController, Tabs, Tab  } from 'ionic-angular';
import { AdvertisementPage } from './../advertisement/advertisement';
import { NotificationPage } from './../notification/notification';
import { StatisticsPage } from './../statistics/statistics';
import { ProfilePage } from '../../pages/profile/profile';

//import { NewAdvertisementPage2 } from './../new-advertisement-2/new-advertisement';
//import { AcquireProductPage } from './../acquire-product/acquire-product';
//import { ProductsPage } from './../products/products';
//import { TextingPage } from '../../pages/texting/texting';
//import { FilterPage } from './../filter-page/filter-page';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public tab1Root: any = NotificationPage;
  public tab2Root: any = AdvertisementPage; //TextingPage;

  public tab3Root: any = AdvertisementPage;
  public tab4Root: any = StatisticsPage;

  public tab5Root: any = AdvertisementPage; //FilterPage;
  public tab6Root: any = AdvertisementPage; //ProductsPage;

  public tab7Root: any = ProfilePage;

  public isClient: any;
  @ViewChild('appTabs')  tabsRef: Tabs;
  @ViewChild('tab3')  tabRef3: Tab;
  @ViewChild('tab4')  tabRef4: Tab;
  @ViewChild('tab5')  tabRef5: Tab;
  //@ViewChild('tab6')  tabRef6: Tab;

  constructor(
    public navCtrl: NavController, 
    //private _event: Events
  ) {
    localStorage.setItem("isClient","false");
    this.isClient = false;
    /*_event.subscribe('user:client', (isClient) =>{
      this.isClient = isClient;
      if(isClient) {
        this.setClientMode();
      } else {
        this.setSellerMode();
      }
    });*/
    this.setSellerMode();
  }

  /*private setClientMode = () =>{
    localStorage.setItem("isClient","true");
    this.isClient = true;
    setTimeout(()=>{
      let productPage = document.getElementById("tab-t0-5");
      if(productPage) {
        productPage.click();
      }
    }, 200)

  };*/

  private setSellerMode = () => {
    localStorage.setItem("isClient","false");
    this.isClient = false;
    setTimeout(()=>{
      let advertisementPage = document.getElementById("tab-t0-2");
      if(advertisementPage) {
        advertisementPage.click();
      }
    }, 200)
  }
  tapped(event){
    if(event.id != "t0-2") {
      if(event.id == "t0-4"){
        if(document.getElementById("tab-t0-5") && document.getElementById("tab-t0-4")){
          document.getElementById("tab-t0-5").setAttribute("aria-selected", "false");
          document.getElementById("tab-t0-4").setAttribute("aria-selected", "true");
        }
      }
      if(event.id == "t0-5"){
        if(document.getElementById("tab-t0-5") && document.getElementById("tab-t0-4")) {
          document.getElementById("tab-t0-4").setAttribute("aria-selected", "false");
          document.getElementById("tab-t0-5").setAttribute("aria-selected", "true");
        }
      }
      if(this.isClient == true && event.id != "t0-5" && event.id != "t0-4"){
        if(document.getElementById("tab-t0-5") && document.getElementById("tab-t0-4")) {
          document.getElementById("tab-t0-4").setAttribute("aria-selected", "false");
          document.getElementById("tab-t0-5").setAttribute("aria-selected", "false");
        }
      }
    }
  }

}
