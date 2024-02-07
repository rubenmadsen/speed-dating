import { Component } from '@angular/core';
import {faInfo} from "@fortawesome/free-solid-svg-icons/faInfo";


@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.css']
})
export class DateComponent {


  protected readonly faInfo = faInfo;
}
