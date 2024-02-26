import {Component, Input, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {faGripVertical} from "@fortawesome/free-solid-svg-icons/faGripVertical";
import {BehaviorSubject, Observable, Subscription} from "rxjs";
import {EventService} from "../../services/event.service";
import {EventModel} from "../../models/eventModel";
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {UserModel} from "../../models/userModel";
import {BackendService} from "../../services/backend.service";
import {DateModel} from "../../models/dateModel";

import {ParticipantListComponent} from '../../event/participant-list/participant-list.component';
import {DateContainerComponent} from '../../event/date-container/date-container.component';
import {EventStateService} from "../../services/event-state.service";


@Component({
  selector: 'app-event-page',
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.css']
})
export class EventPageComponent implements OnInit, OnDestroy {

  protected readonly faGripVertical = faGripVertical;
  event: EventModel | null = null;

  @ViewChild(ParticipantListComponent) childParticipantList!: ParticipantListComponent;
  @ViewChild(DateContainerComponent) childDateContainer!: DateContainerComponent;


  subscription!: Subscription;
  participantsList?: UserModel[];
  datesList!: DateModel[];

  isOrganizer$: Observable<boolean> | undefined;

  constructor(private eventService: EventService, private authService: AuthService,
              private backend: BackendService,
              private eventStateService: EventStateService) { }

  /**
   * Load an event
   */
   async ngOnInit() {
    this.subscription = this.eventService.currentEvent.subscribe(event => {
      this.event = event;
    });
    this.isOrganizer$ = this.authService.isOrganizer;
    this.participantsList = this.event?.participants;
    this.subscribeToDates()
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  subscribeToDates() {
    this.eventStateService.dates$.subscribe(dates => {
      if(dates.length != 0){
        this.datesList = dates;
      }
    });
  }


  /**
   * Method to have the child components re-generate their lists
   */
  clearTables(){
     this.childParticipantList.populateList();
     this.childDateContainer.filterAgain();
  }


    /**
   * Method to automatically match the dates
   */
  automaticMatching(){
     this.backend.getNextRoundOfDatesForEvent(this.event!).subscribe({
       next: (response) => {
         console.log(response)
         this.childParticipantList.clearList();
         this.eventStateService.updateDates(response)
       },
       error: (error) => {
         console.log(error);
       }
     })
  }
}
