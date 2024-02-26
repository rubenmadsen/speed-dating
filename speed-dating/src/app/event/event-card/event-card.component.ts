import {Component, Input, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { EventModel } from 'src/app/models/eventModel';
import { EventService } from '../../services/event.service';
import { Router } from '@angular/router';
import {CityModel} from "../../models/cityModel";
import {BackendService} from "../../services/backend.service";
import {firstValueFrom} from "rxjs";
import * as events from "events";

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css'],
})
export class EventCardComponent {

  protected readonly faClock = faClock;
  @Input() event!: EventModel;
  @Input() eventCardClass: string = "";
  @ViewChild('spotsRef') spotsRef!:ElementRef;
  status: string = "availability"
  city!: CityModel;
  imageUrl:string | undefined = undefined;
  constructor(private eventService: EventService, private router: Router, private backend:BackendService) {  }

  async ngOnInit(){
    this.status = this.event.currentParticipants +  "/" + this.event.totalParticipants;
    this.imageUrl = `url(http://localhost:3000/${this.event.imagePath})`;
    const me = await firstValueFrom(this.backend.getMe());
    if (me){
      const seats = this.event.participants.filter(participant => participant.gender === me.gender).length
      this.status = 10 - seats + "";
      if ((10 - seats) === 0)
        this.spotsRef.nativeElement.classList.toggle("full",true)
      else
        this.spotsRef.nativeElement.classList.toggle("available",true)
      this.status = this.status === "1" ? this.status + " Spot Available" : this.status + " Spots Available";
    }
  }

  onEventSelected() {
    this.eventService.changeEvent(this.event);
    this.router.navigate(['event']);
  }

}
