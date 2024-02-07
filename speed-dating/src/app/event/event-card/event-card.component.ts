import { Component } from '@angular/core';
import {faClock} from "@fortawesome/free-regular-svg-icons";
import {faMapLocationDot} from "@fortAwesome/free-solid-svg-icons";


@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css']
})
export class EventCardComponent {

  protected readonly faClock = faClock;
  protected readonly faMapLocationDot = faMapLocationDot;

  openMap() {
    //TODO: SET OPEN THE LATITUDE AND LONGITUDE OF THE LOCATION FROM BACKEND
    window.open("https://maps.google.com", "_blank");
  }
}
