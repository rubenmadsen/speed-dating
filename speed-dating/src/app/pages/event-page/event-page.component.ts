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
  participants?: UserModel[];

  me!: UserModel;
  isRegisted: Boolean = false;

  cancelEventButtonClass: string = 'trans clr-accent border-accent';
  clearTablesButtonClass: string = 'trans clr-accent border-accent disabled';
  automaticMatchingButtonClass: string = 'accent border-accent clr-white disabled';
  startDateButtonClass: string = 'accent border-accent clr-white disabled';


  isOrganizer$: Observable<boolean> | undefined;

  constructor(private eventService: EventService, private authService: AuthService,
              private backend: BackendService,
              private eventStateService: EventStateService) { }

  /**
   * Load an event
   */
   async ngOnInit() {
    this.eventStateService.clearDates();
    this.subscription = this.eventService.currentEvent.subscribe(event => {
      this.event = event;
    });

    this.backend.getMe().subscribe(r => {
      this.me = r

      if (this.event?.participants.some(participant => participant._id === r._id)) {
        this.isRegisted = true;
      } else {
      }
    });
    this.subscribeToDates()


    const baseClass = 'trans clr-accent border-accent';
    const disabledClass = ' disabled';
    const accentClass = 'accent border-accent clr-white';

    // await this.authService.checkSession();
    this.isOrganizer$ = this.authService.isOrganizer;
    this.participantsList = this.event?.participants;
    this.participants = this.event?.participants;


    if(this.participants && this.participants.length == this.event?.totalParticipants) {
      this.clearTablesButtonClass = baseClass;
      this.automaticMatchingButtonClass = accentClass;
      this.startDateButtonClass = accentClass;
    } else {
      this.clearTablesButtonClass = baseClass + disabledClass;
      this.automaticMatchingButtonClass = accentClass + disabledClass;
      this.startDateButtonClass = accentClass + disabledClass;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  registerAtEvent() {
     if(this.event == null){
       return
     }
    this.backend.joinEvent(this.event).subscribe(r => {
      this.eventService.changeEvent(r)
      this.isRegisted = true;
    });
  }

  unregister() {
    if(this.event == null){
      return
    }
    this.backend.leaveEvent(this.event).subscribe(r => {
      console.log(r);
      this.eventService.changeEvent(r)
      this.isRegisted = false;
    })
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
    this.eventStateService.updateDates([]);
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
