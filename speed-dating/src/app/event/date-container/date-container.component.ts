import {Component, Input, SimpleChanges} from '@angular/core';
import {ParticipantListComponent} from "../participant-list/participant-list.component";
import {UserModel} from "../../models/userModel";
import {BehaviorSubject, Subscription} from "rxjs";
import {DateModel} from "../../models/dateModel";
import {EventStateService} from "../../services/event-state.service";

@Component({
  selector: 'app-date-container',
  templateUrl: './date-container.component.html',
  styleUrls: ['./date-container.component.css']
})
export class DateContainerComponent {

  @Input() datesList!: DateModel[];
  @Input() participantList!: ParticipantListComponent;

  listUsers?: UserModel[];
  hasDates: boolean = false;

  constructor(private eventStateService: EventStateService) {
  }

  ngOnInit() {
    this.filterParticipants();
    this.subscribeToDates();
  }

   private filterParticipants() {
    this.listUsers = this.participantList.participantsList
   }


  subscribeToDates() {
    this.eventStateService.dates$.subscribe(dates => {
      this.datesList = dates;
      if(dates.length != 0){
        this.hasDates = true;
      }
    });
  }

  /**
   * Used for parent component to filter again
   */
  filterAgain(){
    this.hasDates = false
    this.listUsers = this.participantList.participantsList
  }

  handleEvent(eventData: { tableUsers: UserModel[], tableNumber: number }) {
  }
}
