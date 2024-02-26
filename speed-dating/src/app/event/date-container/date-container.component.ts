import {Component, EventEmitter, Input, Output, SimpleChanges} from '@angular/core';
import {ParticipantListComponent} from "../participant-list/participant-list.component";
import {UserModel} from "../../models/userModel";
import {BehaviorSubject, repeat, Subscription} from "rxjs";
import {DateModel} from "../../models/dateModel";
import {EventStateService} from "../../services/event-state.service";
import {BackendService} from "../../services/backend.service";

@Component({
  selector: 'app-date-container',
  templateUrl: './date-container.component.html',
  styleUrls: ['./date-container.component.css']
})
export class DateContainerComponent {

  @Input() datesList!: DateModel[];
  @Input() participantList!: ParticipantListComponent;
  @Output() onParticipantClick = new EventEmitter<string>();
  listUsers?: UserModel[];
  hasDates: boolean = false;

  constructor(private eventStateService: EventStateService, private backendService: BackendService) {
  }
  ngOnInit() {
    this.subscribeToDates();
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
    this.listUsers = this.participantList.participantsList?.filter(p => p.gender == 'male')
  }

  /**
   * Method to handle drag and dropped participants
   * @param eventData the new date pair
   */
  handleEvent(eventData: { tableUsers: UserModel[], tableNumber: number }) {
    if (eventData.tableUsers[1].firstname != 'TBD'){
      this.backendService.matchUserWithUser(eventData.tableUsers[0], eventData.tableUsers[1]).subscribe({
        next: (response) => {
          this.eventStateService.removeDate(eventData.tableUsers[0]);
          response.tableNumber = eventData.tableNumber;
          this.eventStateService.addEvent(response);
        },
        error: (error) => {
          console.log(error)
        }
      })
      // tell backend to create date, then add date to EventStateService
    }
  }
  onUserClick(id: string){
    this.onParticipantClick.emit(id)
  }

  handleTableSwap(event: { previousTableNumber: number, currentTableNumber: number }) {
    this.eventStateService.changeTable(event.previousTableNumber, event.currentTableNumber)
  }
}
