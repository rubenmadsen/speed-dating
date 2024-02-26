import {Component, Input, OnDestroy, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {faGripVertical} from "@fortawesome/free-solid-svg-icons/faGripVertical";
import {BehaviorSubject, Observable, Subscription} from "rxjs";
import {EventService} from "../../services/event.service";
import {EventModel} from "../../models/eventModel";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {UserModel} from "../../models/userModel";
import {BackendService} from "../../services/backend.service";
import {DateModel} from "../../models/dateModel";

import {ParticipantListComponent} from '../../event/participant-list/participant-list.component';
import {DateContainerComponent} from '../../event/date-container/date-container.component';
import {EventStateService} from "../../services/event-state.service";
import {StatusMessage} from "../../interfaces/statusMessage";
import {StatusMessageType} from "../../interfaces/StatusMessageType";
import {GlobalService} from "../../services/global.service";

import {Location} from '@angular/common';

@Component({
  selector: 'app-event-page',
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.css']
})
export class EventPageComponent implements OnInit, OnDestroy {

  protected readonly faGripVertical = faGripVertical;
  event: EventModel | null = null;

  @ViewChild(ParticipantListComponent) childParticipantList!: ParticipantListComponent;

  clickedParticipant!:UserModel;
  participantIsClickedOn: Boolean = false;

  subscription!: Subscription;
  participantsList?: UserModel[];
  datesList: DateModel[] = [];

  me!: UserModel;
  isRegisted: Boolean = false;
  hasAutoMatched = false;
  removedIsPressed = false;

  cancelEventButtonClass: string = 'trans clr-accent border-accent';
  clearTablesButtonClass: string = 'trans clr-accent border-accent disabled';
  automaticMatchingButtonClass: string = 'accent border-accent clr-white disabled';
  startDateButtonClass: string = 'accent border-accent clr-white disabled';


  isOrganizer$: Observable<boolean> | undefined;

  constructor(private eventService: EventService, private authService: AuthService,
              private backend: BackendService,
              private eventStateService: EventStateService,
              private globalService: GlobalService,
              private router: Router,
              private _location: Location) { }
  backClicked() {
    this._location.back();
  }
  /**
   * Load an event
   */
   async ngOnInit() {
    this.eventStateService.clearDates();
    this.subscribeToDates()

    this.subscription = this.eventService.currentEvent.subscribe(event => {
      this.event = event;
    });

    // await this.authService.checkSession();
    this.isOrganizer$ = this.authService.isOrganizer;
    this.participantsList = this.event?.participants;
    this.createEmptyDates();

    this.backend.getMe().subscribe(r => {
      this.me = r
      if (this.event?.participants.some(participant => participant._id === r._id)) {
        this.isRegisted = true;
      } else {
      }
    });

    const baseClass = 'trans clr-accent border-accent';
    const disabledClass = ' disabled';
    const accentClass = 'accent border-accent clr-white';

    if(this.participantsList && this.participantsList.length == this.event?.totalParticipants) {
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

  /**
   * Helper method to generate temporary dates
   */
  createEmptyDates(){
    let i = 1;
    this.participantsList?.forEach(participant => {
      if (participant.gender == 'male'){
        const date : DateModel = {
          event: this.event!,
          tableNumber: i,
          dateRound: 0,
          personOne: participant,
          personTwo: null,
          percentage: 0,
          feedback: [],
        }
        i += 1;
        this.eventStateService.addEvent(date)
      }
    })

  }
  back(){
    this.removedIsPressed = false;
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


  startDates() {
     if(!this.checkDates()){
       const mess: StatusMessage = {
         message: "Please match all participants",
         type: StatusMessageType.ALERT,
       };
       this.globalService.setGlobalStatus(mess);
       return
     }

    // Send dates to backend, this.datesList
  }

  /**
   * Helper method to check is all dates has both participants
   */
  checkDates(): boolean {
    for (const date of this.datesList) {
      if (date.personTwo === null) {
        return false;
      }
    }
    return true;
  }

  subscribeToDates() {
    this.eventStateService.dates$.subscribe(dates => {
      if(dates.length != 0){
        this.datesList = dates;
      }
    });
  }

  removeEvent(){
    if(!this.removedIsPressed){
      this.removedIsPressed = true;
      return
    }
    this.backend.deleteEvent(this.event!).subscribe({
      next: (response) => {
        const loadingMess: StatusMessage = {
          message: "Event removed",
          type: StatusMessageType.SUCCESS,
        };
        this.globalService.setGlobalStatus(loadingMess);
        setTimeout(() => this.router.navigate(['']), 500);
      },
      error: (error) => {
        const loadingMess: StatusMessage = {
          message: "Couldn't remove event",
          type: StatusMessageType.ALERT,
        };
        this.globalService.setGlobalStatus(loadingMess);        }
    })

  }


  /**
   * Method to have the child components re-generate their lists
   */
  clearTables(){
    this.eventStateService.clearDates();
    this.createEmptyDates()
    this.hasAutoMatched = false;
    this.childParticipantList.populateList();
  }


  /**
   * Method to automatically match the dates
   */
  automaticMatching() {
    if (!this.hasAutoMatched) {

      const loadingMess: StatusMessage = {
        message: "Automatic matching in progress...",
        type: StatusMessageType.SUCCESS,
      };
      this.globalService.setGlobalStatus(loadingMess);
      this.backend.getNextRoundOfDatesForEvent(this.event!).subscribe({
        next: (response) => {
          this.childParticipantList.clearList();
          this.eventStateService.updateDates(response)
          this.hasAutoMatched = true;

        },
        error: (error) => {
          console.log(error);
        }
      })
    } else {
        const mess: StatusMessage = {
          message: "Automatic matching already done",
          type: StatusMessageType.WARNING
        };
        this.globalService.setGlobalStatus(mess);
    }
  }
  getParticipant(id :string){
    this.backend.getSpecificUser(id).subscribe(user => {
      this.clickedParticipant = user;
      this.participantIsClickedOn = true;
    });
  }
}
