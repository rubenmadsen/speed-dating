import { Component, Input, AfterViewInit} from '@angular/core';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { EventModel } from 'src/app/models/eventModel';
import { EventService } from '../../services/event.service';
import { Router } from '@angular/router';
import {CityModel} from "../../models/cityModel";

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css'],
})
export class EventCardComponent {

  protected readonly faClock = faClock;
  @Input() event!: EventModel;
  @Input() eventCardClass: string = "";

  city!: CityModel;
  imageUrl:string | undefined = undefined;
  constructor(private eventService: EventService, private router: Router) {  }

  ngOnInit(){
    this.imageUrl = `url(http://localhost:3000/${this.event.imagePath})`;
  }

  onEventSelected() {
    this.eventService.changeEvent(this.event);
    this.router.navigate(['event']);
  }

}
