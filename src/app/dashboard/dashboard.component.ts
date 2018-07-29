import { Component, OnInit } from '@angular/core';
import { Setting, SETTINGS } from '../app.settings';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  categories: Setting[];

  constructor() { }

  ngOnInit() {
    this.categories = SETTINGS.categories;
  }

}
