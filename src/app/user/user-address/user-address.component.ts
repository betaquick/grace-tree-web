import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-user-profile-address',
  templateUrl: './user-address.component.html',
  styleUrls: [
    './user-address.component.scss',
    '../../../assets/icon/icofont/css/icofont.scss'
  ]
})
export class UserAddressComponent implements OnInit {

  editMode: boolean;

  ngOnInit(){
    this.editMode = false;
    
  }
}
