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
  when:string | undefined = undefined;
  constructor(private eventService: EventService, private router: Router, private backend:BackendService) {  }

  async ngOnInit(){
    this.status = this.event.currentParticipants +  "/" + this.event.totalParticipants;
    this.imageUrl = `url(http://localhost:3000/${this.event.imagePath})`;
    const me = await firstValueFrom(this.backend.getMe());
    if (me && !me.isOrganizer){
      const seats = this.event.participants.filter(participant => participant.gender === me.gender).length
      this.status = 10 - seats + "";
      if ((10 - seats) === 0 || this.event.hasEnded)
        this.spotsRef.nativeElement.classList.toggle("full",true)
      else
        this.spotsRef.nativeElement.classList.toggle("available",true)
      this.status = this.status === "1" ? this.status + " Spot Available" : this.status + " Spots Available";
    }
    this.when = this.setDateLabel(new Date(this.event.startDate));
  }

  onEventSelected() {
    this.eventService.changeEvent(this.event);
    this.router.navigate(['event']);
  }
  getDayOfWeek(date: Date): string {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return daysOfWeek[date.getDay()];
  }
  getMonthOfYear(date:Date){
    const monthsOfYear= ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const shortMonths = monthsOfYear.map(month => month.substring(0, 3));
    return shortMonths[date.getMonth()];
  }
  setDateLabel(dateToCheck: Date): string {
    const currentDate = new Date();
    const sixDaysFromNow = new Date(currentDate);
    sixDaysFromNow.setDate(currentDate.getDate() + 6);
    //currentDate.setHours(0, 0, 0, 0);
    //sixDaysFromNow.setHours(23, 59, 59, 999);
    //dateToCheck.setHours(12, 0, 0, 0);
    let label = this.getMonthOfYear(dateToCheck) + " " + dateToCheck.getDate();

    if(dateToCheck >= currentDate && dateToCheck <= sixDaysFromNow){
      if (currentDate.getDate() == dateToCheck.getDate())
        label = "Today";
      else if(currentDate.getDate() +1 == dateToCheck.getDate())
        label = "Tomorrow";
      else
        label = this.getDayOfWeek(dateToCheck);
    }
    // console.log("")
    // console.log("Now",currentDate);
    // console.log("Event", dateToCheck)
    // console.log("Future", sixDaysFromNow)
    // console.log("larger than today",dateToCheck >= currentDate)
    // console.log("less than in six days",dateToCheck <= sixDaysFromNow)
    // console.log("")
    return label;
  }
}
