import {Component, Input} from '@angular/core';
import {faClock} from "@fortawesome/free-regular-svg-icons";
import { EventModel } from 'src/app/models/eventModel';


@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css']
})
export class EventCardComponent {

  protected readonly faClock = faClock;

  @Input() event?: EventModel;

  openMap() {
    //TODO: SET OPEN THE LATITUDE AND LONGITUDE OF THE LOCATION FROM BACKEND
    window.open("https://maps.google.com", "_blank");
  }
}
