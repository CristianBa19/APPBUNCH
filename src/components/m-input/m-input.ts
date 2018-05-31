import { Component, Input } from '@angular/core';

/**
 * Generated class for the MInputComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'm-input',
  templateUrl: 'm-input.html'
})
export class MInputComponent {
  
  @Input() label: string;
  @Input() field: string;  
  @Input() id: string;    
  @Input() change: any;
  @Input() x: any;
  @Input() disabled: any;
  @Input() readonly: any;
  @Input() type:string = 'text';
  @Input() maxlength: any = '888';

  constructor() {    
  }

}
