import {Component, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: [
    './statistic.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss',
    '../../../../assets/charts/radial/css/radial.scss'
  ],
  encapsulation: ViewEncapsulation.None
})
export class StatisticComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
