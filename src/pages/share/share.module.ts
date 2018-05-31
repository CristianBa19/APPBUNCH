import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SharePage } from './share';

@NgModule({
  declarations: [
    SharePage,
  ],
  imports: [
    IonicPageModule.forChild(SharePage),
  ],
  exports: [
    SharePage
  ]
})
export class SharePageModule {}
